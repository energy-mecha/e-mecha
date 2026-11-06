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


def rows(path):
    """헤더 행을 기준으로 dict 리스트를 반환"""
    ws = openpyxl.load_workbook(path, data_only=True).active
    it = ws.iter_rows(values_only=True)
    header = [str(h).strip() if h is not None else "" for h in next(it)]
    out = []
    for r in it:
        if not any(c is not None and str(c).strip() for c in r):
            continue
        out.append({header[i] or f"_{i}": r[i] for i in range(len(header))})
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
patents = []
for r in rows(find("특허등록")):
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
