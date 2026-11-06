"""
엑셀 실적 파일 → assets/js/data.js 변환 스크립트

사용법 (e-mecha 폴더에서):
    python tools/build_data.py            # 기본: 상위 폴더(../)의 엑셀 파일 사용
    python tools/build_data.py <엑셀폴더>

필요 패키지: openpyxl  (pip install openpyxl)

엑셀 파일 이름에 아래 키워드가 들어 있으면 자동으로 인식합니다.
    저널실적, 학술대회, 특허등록, 연구과제참여
학술대회 파일은 여러 개(예: 국내외학술대회_2026년.xlsx)를 함께 두면 모두 합쳐집니다.
"""
import glob
import json
import os
import re
import sys
import warnings
from datetime import datetime

import openpyxl

warnings.filterwarnings("ignore")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(ROOT)
OUT = os.path.join(ROOT, "assets", "js", "data.js")


def find_all(keyword):
    files = sorted(f for f in glob.glob(os.path.join(SRC, "*.xlsx"))
                   if keyword in os.path.basename(f) and not os.path.basename(f).startswith("~$"))
    if not files:
        raise SystemExit(f"'{keyword}' 엑셀 파일을 {SRC} 에서 찾을 수 없습니다.")
    return files


def find(keyword):
    return find_all(keyword)[0]


def open_sheet(path):
    try:
        return openpyxl.load_workbook(path, data_only=True).active
    except (ValueError, IndexError):
        # 특허청(KIPRIS) 등에서 내려받은 파일은 서식 정보가 깨져 있는 경우가 있어 서식을 건너뛰고 값만 읽음
        import openpyxl.reader.excel as rx
        orig, rx.apply_stylesheet = rx.apply_stylesheet, lambda archive, wb: None
        try:
            return openpyxl.load_workbook(path, data_only=True, read_only=True).active
        finally:
            rx.apply_stylesheet = orig


def rows(path):
    """헤더 행을 기준으로 dict 리스트를 반환"""
    ws = open_sheet(path)
    it = ws.iter_rows(values_only=True)
    header = [str(h).strip() if h is not None else "" for h in next(it)]
    out = []
    for r in it:
        if not any(c is not None and str(c).strip() for c in r):
            continue
        out.append({header[i] or f"_{i}": (r[i] if i < len(r) else None) for i in range(len(header))})
    return out


def clean(s):
    if s is None:
        return ""
    s = str(s).replace("\n", " ").replace("？", "·")
    return re.sub(r"\s+", " ", s).strip()


def ym(s):
    """'2025.06' / datetime / '2025-06-01' → '2025.06'"""
    if isinstance(s, datetime):
        return s.strftime("%Y.%m")
    s = clean(s)
    m = re.match(r"(\d{4})[.\-/](\d{1,2})", s)
    return f"{m.group(1)}.{int(m.group(2)):02d}" if m else s


# ---------------- 저널 ----------------
journals = []
for r in rows(find("저널실적")):
    kind = clean(r.get("학술지구분"))
    journals.append({
        "date": ym(r.get("게재년월")),
        "title": clean(r.get("논문명")),
        "venue": clean(r.get("학술지명")),
        "scope": "intl" if "국제" in kind else "dom",
        "index": "SCI(E)" if "SCI" in kind else ("KCI" if "KCI" in kind else ""),
    })

# ---------------- 학술대회 ----------------
# '학술대회'가 들어간 엑셀이 여러 개면(예: 연도별 추가 파일) 모두 합치고, 같은 업적번호는 한 번만 넣음
conferences = []
seen = set()
for r in (r for f in find_all("학술대회") for r in rows(f)):
    title = clean(r.get("논문명"))
    key = clean(r.get("업적번호")) or (title, ym(r.get("발표일자")))
    if key in seen:
        continue
    seen.add(key)
    # 헤더가 '학술대회\n구분' 처럼 줄바꿈을 포함할 수 있어 공백을 제거하고 찾음
    kind = next((clean(v) for k, v in r.items() if re.sub(r"\s", "", k) == "학술대회구분"), "")
    # 국외 학술대회이거나 논문 제목에 한글이 없으면(영문 논문) International 로 분류
    intl = kind == "국외" or not re.search(r"[가-힣]", title)
    conferences.append({
        "date": ym(r.get("발표일자")),
        "title": title,
        "venue": clean(r.get("학술대회명")),
        "scope": "intl" if intl else "dom",
    })

# ---------------- 특허 ----------------
def kr_no(s, kind):
    """특허청 번호를 하이픈 형식으로 — 출원(app): 1020230150042 → 10-2023-0150042, 등록(reg): 1029926410000 → 10-2992641-0000"""
    s = clean(s)
    d = re.sub(r"\D", "", s)
    if len(d) == 13 and d.startswith("10"):
        return f"{d[:2]}-{d[2:6]}-{d[6:]}" if kind == "app" else f"{d[:2]}-{d[2:9]}-{d[9:]}"
    return s


SCNU_OWNER = "국립순천대학교산학협력단"
# 기술이전 기업 영문명 (없으면 국문명 그대로 표시)
COMPANY_EN = {
    "㈜셀시스템": "Cell System Co., Ltd.",
    "㈜티엠씨솔루션즈": "TMC Solutions Co., Ltd.",
    "㈜프라임": "Prime Co., Ltd.",
    "유한회사 와이케이": "YK Ltd.",
    "㈜에니트": "ENIT Co., Ltd.",
    "한국전력공사": "KEPCO",
}


def company(name):
    """'주식회사프라임' · '(주)셀시스템' → '㈜프라임' · '㈜셀시스템'"""
    name = clean(name)
    name = re.sub(r"^(주식회사|\(주\))\s*", "㈜", name)
    return re.sub(r"\s*(주식회사|\(주\))$", "㈜", name)


def owner_names(owners):
    names = [company(o) for o in owners]
    return {"ko": ", ".join(names), "en": ", ".join(COMPANY_EN.get(n, n) for n in names)}


def transfer(r):
    """학교가 출원한 뒤 최종권리자가 기업으로 바뀐 특허 → 기술이전(특허양도) 기업명."""
    owners = [o for o in clean(r.get("최종권리자")).split("|") if o]
    if not owners or SCNU_OWNER in owners:
        return None
    return owner_names(owners)


def joint(r):
    """학교와 기업이 함께 권리자인 특허(공동출원) → 학교를 뺀 공동권리자 이름."""
    owners = [o for o in clean(r.get("최종권리자")).split("|") if o]
    others = [o for o in owners if o != SCNU_OWNER]
    if SCNU_OWNER not in owners or not others:
        return None
    return owner_names(others)


patents = []
for r in rows(find("특허등록")):
    if "발명의명칭" in r:
        # 특허청(KIPRIS) 검색 결과 형식: 국문·영문 명칭이 따로 있고 번호는 숫자만 있음
        if clean(r.get("상태")) not in ("", "등록"):
            continue
        ko, en = clean(r.get("발명의명칭")), clean(r.get("발명의명칭(영문)"))
        en = en.rstrip(". ") if re.search(r"[A-Za-z]", en) else ""
        en = en[:1].upper() + en[1:]
        # 특허청 영문 명칭은 약어가 소문자로 되어 있어 대문자로 바로잡음
        for w in ("DC", "AC", "DAB", "MPPT", "PV", "AI", "IoT", "ESS", "LED", "SiC", "MOSFET"):
            en = re.sub(rf"\b{w}\b", w, en, flags=re.I)
        patents.append({
            "title": ko,
            "title_en": en,
            "appDate": clean(r.get("출원일자")),
            "appNo": kr_no(r.get("출원번호"), "app"),
            "regDate": clean(r.get("등록일자")) or clean(r.get("출원일자")),
            "regNo": kr_no(r.get("등록번호"), "reg") or kr_no(r.get("출원번호"), "app"),
            "transfer": transfer(r),
            "joint": joint(r),
        })
        continue
    title = clean(r.get("지식재산권명"))
    # "국문명(English name)" 형태면 분리 (영문명이 '...'로 잘린 경우 포함)
    m = re.match(r"^(.*?[가-힣].*?)\s*\(([A-Za-z][^()]*)\)?\s*$", title)
    ko, en = (m.group(1), m.group(2)) if m else (title, "")
    en = re.sub(r"\.{3}$", "…", en.strip())
    patents.append({
        "title": ko,
        "title_en": en,
        "appDate": clean(r.get("출원일자")),
        "appNo": clean(r.get("출원번호")),
        "regDate": clean(r.get("등록일자")) or clean(r.get("출원일자")),
        "regNo": clean(r.get("등록번호")) or clean(r.get("출원번호")),
    })

# ---------------- 연구과제 (연차별 과제를 하나로 병합) ----------------
proj = {}
for r in rows(find("연구과제")):
    title = re.sub(r"^\((교내|사업)\)\s*", "", clean(r.get("연구과제명")))
    key = re.sub(r"[\s·]", "", title).replace("kAV", "kVA")
    vals = list(r.values())
    start, end = r.get("연구기간"), vals[6] if len(vals) > 6 else None
    p = proj.setdefault(key, {
        "title": title.replace("50kAV", "50kVA"),
        "agency": clean(r.get("연구비지원기관")),
        "type": clean(r.get("연구비 지원구분")),
        "role": clean(r.get("참여구분")),
        "start": start, "end": end,
    })
    if start and (p["start"] is None or start < p["start"]):
        p["start"] = start
    if end and (p["end"] is None or end > p["end"]):
        p["end"] = end
        p["agency"] = clean(r.get("연구비지원기관")) or p["agency"]

today = datetime.now()
projects = []
for p in proj.values():
    projects.append({
        "title": p["title"], "agency": p["agency"], "type": p["type"], "role": p["role"],
        "start": ym(p["start"]), "end": ym(p["end"]),
        "ongoing": bool(p["end"] and p["end"] >= today),
    })
projects.sort(key=lambda x: (x["end"], x["start"]), reverse=True)

for lst in (journals, conferences):
    lst.sort(key=lambda x: x["date"], reverse=True)
patents.sort(key=lambda x: x["regDate"], reverse=True)

data = {
    "updated": today.strftime("%Y.%m.%d"),
    "journals": journals,
    "conferences": conferences,
    "patents": patents,
    "projects": projects,
}
os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8") as f:
    f.write("/* 자동 생성 파일 — 직접 수정하지 말고 tools/build_data.py 를 실행하세요. */\n")
    f.write("window.LAB_DATA = ")
    json.dump(data, f, ensure_ascii=False, indent=1)
    f.write(";\n")

print(f"저널 {len(journals)} / 학술대회 {len(conferences)} / 특허 {len(patents)} / 과제 {len(projects)} → {OUT}")
