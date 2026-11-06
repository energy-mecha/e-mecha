# Energy Mechatronics Lab. 홈페이지

국립순천대학교 전기공학과 에너지메카트로닉스연구실 홈페이지 (GitHub Pages용 정적 사이트, 빌드 도구 불필요)

## 구성
| 파일 | 내용 |
|---|---|
| `index.html` | Home — 연구실 소개, 실적 요약, 연구분야, 뉴스, Join Us |
| `members.html` | 지도교수, 구성원, 졸업생, 연락처 |
| `research.html` | 연구분야 상세(DAB, P2H, PV 단선 검출, DC 아크, 인재양성), 보유장비 |
| `publications.html` | 국제/국내 저널, 국제/국내 학술대회, 특허 (탭 · 검색 · 연도 필터) — 특허 탭: 대표 특허기술 카드 · 연도별/기술분야별 보기(분류는 `content.js` 의 `patentFields`) · 협력 안내 |
| `projects.html` | 진행/완료 연구과제 |
| `teaching.html` | 담당 교과목 (목록은 `content.js` 의 `teaching`) |
| `capstone.html` | 종합설계(캡스톤디자인) 과제 — 영상·수상 (`content.js` 의 `capstone`) |
| `awards.html` | 교수 및 지도학생 수상 |
| `assets/js/content.js` | **직접 수정**: 뉴스, 구성원, 수상, 연락처, 통계 |
| `assets/js/data.js` | **자동 생성**: 엑셀 실적 → 논문/학회/특허/과제 |

## 내용 업데이트
- 뉴스 · 구성원 · 연락처: `assets/js/content.js` 수정 (뉴스 항목에 `link: "주소"` 를 넣으면 제목이 링크가 됩니다)
- 논문 · 학회 · 특허 · 과제: 엑셀 파일을 갱신한 뒤
  ```
  python tools/build_data.py <엑셀 폴더 경로>
  ```
- 구성원 사진: `assets/img/members/` 에 넣고 `content.js` 의 `photo` 에 경로 지정
- 전략기술포트폴리오 PDF(특허 탭 「대표 특허기술」 링크): `assets/files/emecha-tech-portfolio-v2.2.pdf`. 새 버전을 올릴 때는 파일을 넣고 `publications.html` 의 PDF 링크 3곳(제목·보기·다운로드)의 파일명을 바꿉니다.

## 언어 (영어 기본 / 한국어 선택)
- 상단 오른쪽 `EN | 한국어` 버튼으로 전환하며, 마지막 선택은 브라우저에 기억됩니다. 주소에 `?lang=ko` 를 붙이면 한국어로 열립니다.
- HTML: 번역할 글을 `<p lang="ko">…</p><p lang="en">…</p>` (또는 `<span lang="…">`) 쌍으로 적습니다. 현재 언어가 아닌 쪽은 자동으로 숨겨집니다.
- `content.js`: 글을 `{ ko: "한국어", en: "English" }` 로 적습니다. 문자열 하나만 적으면 두 언어에 같이 표시됩니다.
- 연구과제 영문명/기관 영문명: `content.js` 의 `projectsEn`, `agencyEn` 에 추가합니다. 없으면 한국어로 표시됩니다.
- 논문 제목은 게재된 원문 그대로 표시합니다. 특허는 엑셀에 영문명이 있으면 영어 화면에서 영문명을 보여줍니다.

## GitHub Pages 배포
저장소 Settings → Pages → Source: `Deploy from a branch`, Branch: `main` / `(root)`
→ https://energy-mecha.github.io/e-mecha/
