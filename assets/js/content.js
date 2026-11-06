/* =========================================================
   직접 편집하는 콘텐츠 파일
   - 뉴스, 구성원, 수상, 연락처 등은 여기서 수정하세요.
   - 논문/학회/특허/과제 목록은 엑셀 → tools/build_data.py 로 data.js 에 자동 생성됩니다.
   - 다국어: { ko: "한국어", en: "English" } 형태로 적으면 언어 전환 시 바뀝니다.
     (en 을 생략하거나 문자열만 적으면 두 언어 모두 같은 글이 표시됩니다.)
   ========================================================= */

/* 구성원 정보에 반복해서 쓰는 값 */
const SCNU_EE = { ko: "국립순천대학교 전기공학과", en: "Electrical Engineering, Sunchon National University" };
const SCNU_EE_STUDENT = { ko: "재학 : 국립순천대학교 전기공학과", en: "Electrical Engineering, Sunchon National University" };
const EDU = (ko, en, school) => ({ ko: `${ko} : ${school.ko}`, en: `${en}, ${school.en}` });
const POS = {
  phd: { ko: "박사과정", en: "Ph.D. Student" },
  int: { ko: "석·박사 통합과정", en: "Integrated M.S. & Ph.D. Student" },
  ug: { ko: "학부연구생", en: "Undergraduate Researcher" },
};
const TOPIC = {
  pe: { ko: "전력전자, DC-DC 컨버터", en: "Power electronics, DC-DC converters" },
  dg: { ko: "분산형전원(태양광)", en: "Distributed generation (PV)" },
};

window.LAB = {
  name: "Energy Mechatronics Lab.",
  nameKo: "에너지메카트로닉스연구실",
  university: "Sunchon National University",
  universityKo: "국립순천대학교",
  dept: "Department of Electrical Engineering",
  deptKo: "전기공학과",

  contact: {
    address: { ko: "(57922) 전라남도 순천시 중앙로 255, 국립순천대학교 전기공학과", en: "Dept. of Electrical Engineering, Sunchon National University, 255 Jungang-ro, Suncheon-si, Jeollanam-do 57922, Republic of Korea" },
    email: "dkkim@scnu.ac.kr",      // 비워두면 표시되지 않습니다.
    phone: "061-750-3546",
    office: "",     // 예: { ko: "공과대학 2호관 000호", en: "Room 000, Engineering Bldg. 2" }
  },

  links: [
    { label: { ko: "국립순천대학교", en: "Sunchon National University" }, url: "https://www.scnu.ac.kr", icon: "scnu" },
  ],

  /* ---------------- 지도교수 ---------------- */
  pi: {
    name: "김대경",
    nameEn: "Dae-kyong Kim, Ph.D.",
    title: { ko: "Senior Member of the IEEE · 국립순천대학교 전기공학과 교수", en: "Senior Member of the IEEE · Professor, Dept. of Electrical Engineering, Sunchon National University" },
    photo: "assets/img/prof-kim.jpg",
    interests: [
      { ko: "Energy Grid용 DC-DC 컨버터(DAB) 설계 및 고장진단/예측 기술", en: "Design, fault diagnosis and prognosis of DC-DC converters (DAB) for energy grids" },
      { ko: "Solar PV 단선 위치 검출 기술", en: "Disconnection fault localization for solar PV" },
      { ko: "DC 아크 검출 기술", en: "DC arc fault detection" },
      { ko: "P2H(Power-to-Heat) 성능 향상 및 AI 예측 기술", en: "Performance enhancement and AI-based prediction for P2H (Power-to-Heat)" },
      { ko: "고주파 변압기 · 전기기기 설계 및 해석", en: "Design and analysis of high-frequency transformers and electric machines" },
    ],
    career: [
      { when: { ko: "2011 – 현재", en: "2011 – Present" }, what: { ko: "국립순천대학교 전기공학과 교수", en: "Professor, Dept. of Electrical Engineering, Sunchon National University" } },
      { when: "2005 – 2011", what: { ko: "한국전자기술연구원(KETI) 디지털컨버전스연구센터 센터장", en: "Director, Digital Convergence Research Center, Korea Electronics Technology Institute (KETI)" } },
      { when: "2001 – 2005", what: { ko: "삼성전자 가전연구소(수원) 선임연구원", en: "Senior Engineer, Digital Appliance R&D Center, Samsung Electronics (Suwon)" } },
    ],
    service: [
      { when: { ko: "2020 – 현재", en: "2020 – Present" }, what: { ko: "국립순천대학교 스마트에너지연구소 연구소장", en: "Director, Smart Energy Research Institute, Sunchon National University" } },
      { when: "2022 – 2025", what: { ko: "녹색에너지연구원 사외이사", en: "Outside Director, Green Energy Institute" } },
      { when: "2021 – 2024", what: { ko: "국립순천대학교 중소기업산학협력센터 센터장", en: "Director, SME Industry-Academia Cooperation Center, Sunchon National University" } },
      { when: "2014 – 2015", what: { ko: "University of Wisconsin–Madison, WEMPEC 방문교수", en: "Visiting Professor, WEMPEC, University of Wisconsin–Madison" } },
    ],
  },

  /* ---------------- 구성원 ----------------
     예) { name: { ko: "홍길동", en: "Gil-dong Hong" }, pos: POS.phd, photo: "assets/img/members/hong.jpg",
           edu: [EDU("공학사", "B.S.", SCNU_EE)], work: { ko: "㈜회사 (2020년 ~ 현재)", en: "Company (2020–present)" },
           topic: { ko: "전력전자", en: "Power electronics" } }
     photo 를 비우면 이름 첫 글자로 표시됩니다. edu · work · topic 은 비워도 됩니다. */
  members: {
    grad: [
      { name: { ko: "최철웅", en: "Cheol-Woong Choi" }, pos: POS.phd, photo: "assets/img/members/choi-cheolwoong.jpg",
        edu: [EDU("공학사", "B.S.", SCNU_EE), EDU("공학석사", "M.S.", SCNU_EE)], topic: TOPIC.pe },
      { name: { ko: "정태규", en: "Tae-Gyu Jung" }, pos: POS.int, photo: "assets/img/members/jung-taegyu.jpg",
        edu: [EDU("공학사", "B.S.", SCNU_EE), EDU("공학석사", "M.S.", SCNU_EE)], topic: TOPIC.pe },
      { name: { ko: "이환수", en: "Hwan-Su Lee" }, pos: POS.phd, photo: "assets/img/members/lee-hwansu.jpg",
        edu: [EDU("공학사", "B.S.", { ko: "국립순천대학교 전기제어공학과", en: "Electrical Control Engineering, Sunchon National University" }), EDU("공학석사", "M.S.", SCNU_EE)],
        work: { ko: "㈜에니트", en: "ENIT Co., Ltd." },
        topic: { ko: "고주파 변압기, 리액터", en: "High-frequency transformers, reactors" } },
      { name: { ko: "박정희", en: "Jeong-Hee Park" }, pos: POS.int, photo: "assets/img/members/park-jeonghee.jpg",
        edu: [EDU("공학사", "B.S.", SCNU_EE)],
        work: { ko: "㈜엘시스 (2016년 ~ 현재)", en: "ELSYS Co., Ltd. (2016–present)" },
        topic: { ko: "마이크로그리드, 전력거래", en: "Microgrids, power trading" } },
      { name: { ko: "장국태", en: "Kuk-Tai Jang" }, pos: POS.int, photo: "assets/img/members/jang-kuktai.jpg",
        edu: [EDU("공학사", "B.S.", { ko: "금오공과대학교 컴퓨터공학과", en: "Computer Engineering, Kumoh National Institute of Technology" })],
        work: { ko: "㈜알파닉스 (2011년 ~ 현재)", en: "Alphanix Co., Ltd. (2011–present)" },
        topic: { ko: "신재생에너지, 신호처리, AI", en: "Renewable energy, signal processing, AI" } },
      { name: { ko: "여승엽", en: "Seung-Yeop Yeo" }, pos: POS.int, photo: "assets/img/members/yeo-seungyeop.jpg",
        edu: [EDU("공학사", "B.S.", { ko: "전남대학교 기계IT융합공학과", en: "Mechanical & IT Convergence Engineering, Chonnam National University" })],
        work: { ko: "㈜더블유피 (2021년 ~ 현재)", en: "WP Co., Ltd. (2021–present)" },
        topic: TOPIC.dg },
      { name: { ko: "윤석희", en: "Seok-Hee Youn" }, pos: POS.int, photo: "assets/img/members/youn-seokhee.jpg",
        edu: [EDU("공학사", "B.S.", { ko: "전남대학교 스마트전기제어공학과", en: "Smart Electrical & Control Engineering, Chonnam National University" })],
        work: { ko: "㈜더블유피 (2024년 ~ 현재)", en: "WP Co., Ltd. (2024–present)" },
        topic: { ko: "신재생에너지", en: "Renewable energy" } },
    ],
    undergrad: [
      { name: { ko: "진찬수", en: "Chan-Su Jin" }, pos: POS.ug, photo: "assets/img/members/jin-chansu.jpg", edu: [SCNU_EE_STUDENT], topic: TOPIC.pe },
      { name: { ko: "김민준", en: "Min-Jun Kim" }, pos: POS.ug, photo: "assets/img/members/kim-minjun.jpg", edu: [SCNU_EE_STUDENT], topic: TOPIC.pe },
      { name: { ko: "서민재", en: "Min-Jae Seo" }, pos: POS.ug, photo: "assets/img/members/seo-minjae.jpg", edu: [SCNU_EE_STUDENT], topic: TOPIC.pe },
      { name: { ko: "김준헌", en: "Jun-Heon Kim" }, pos: POS.ug, photo: "assets/img/members/kim-junheon.jpg", edu: [SCNU_EE_STUDENT], topic: TOPIC.pe },
    ],
  },

  /* 졸업생 — 구성원과 같은 형식, pos 에 졸업 연도/구분.
     year(졸업·수료·재직 종료 연도) 기준 최신순으로 자동 정렬됩니다. */
  alumni: [
    { year: 2025, name: { ko: "기송도", en: "Song-Do Ki" }, pos: { ko: "Ph.D. · 2025년 졸업", en: "Ph.D. · 2025" }, photo: "assets/img/members/ki-songdo.jpg",
      edu: [EDU("공학사", "B.S.", { ko: "호남대학교 컴퓨터공학과", en: "Computer Engineering, Honam University" }), EDU("공학박사", "Ph.D.", SCNU_EE)],
      work: { ko: "㈜에니트 대표이사 (2018년 ~ 현재)", en: "CEO, ENIT Co., Ltd. (2018–present)" },
      topic: { ko: "신재생에너지, 전력전자, 에너지변환기기", en: "Renewable energy, power electronics, energy conversion devices" } },
    { year: 2026, name: { ko: "조석환", en: "Seok-Hwan Cho" }, pos: { ko: "Ph.D. · 2026년 졸업", en: "Ph.D. · 2026" }, photo: "assets/img/members/cho-seokhwan.jpg",
      edu: [EDU("공학사", "B.S.", { ko: "국립순천대학교 전자공학과", en: "Electronic Engineering, Sunchon National University" }), EDU("공학박사", "Ph.D.", SCNU_EE)],
      work: { ko: "㈜티엠씨솔루션즈 대표이사 (2022년 ~ 현재)", en: "CEO, TMC Solutions Co., Ltd. (2022–present)" },
      topic: { ko: "신재생에너지, 전력전자", en: "Renewable energy, power electronics" } },
    { year: 2025, name: { ko: "고재섭", en: "Jae-Sub Ko" }, pos: { ko: "연구교수 (2020 ~ 2025)", en: "Research Professor (2020–2025)" }, photo: "assets/img/members/ko-jaesub.jpg",
      edu: [EDU("공학사", "B.S.", SCNU_EE), EDU("공학석사", "M.S.", SCNU_EE), EDU("공학박사", "Ph.D.", SCNU_EE)],
      work: { ko: "국립강원대학교 전기공학과 교수 (2025년 ~ 현재)", en: "Professor, Electrical Engineering, Kangwon National University (2025–present)" },
      topic: { ko: "신재생에너지, 전력전자, 에너지변환기기", en: "Renewable energy, power electronics, energy conversion devices" } },
    { year: 2021, name: { ko: "소재현", en: "Jae-hyeon So" }, pos: { ko: "박사수료 · 2021년", en: "Ph.D. Coursework Completed · 2021" },
      edu: [EDU("공학사", "B.S.", SCNU_EE), EDU("공학박사수료", "Ph.D. coursework", SCNU_EE)],
      topic: { ko: "전기기기", en: "Electric machines" } },
    { year: 2024, name: { ko: "이승훈", en: "Seung-Hoon Lee" }, pos: { ko: "M.S. · 2024년 졸업", en: "M.S. · 2024" }, photo: "assets/img/members/lee-seunghoon.jpg",
      edu: [EDU("공학사", "B.S.", SCNU_EE), EDU("공학석사", "M.S.", SCNU_EE)],
      work: { ko: "㈜셀시스템 책임연구원 (2024년 ~ 현재)", en: "Principal Researcher, Cell System Co., Ltd. (2024–present)" },
      topic: { ko: "신재생에너지, EMS", en: "Renewable energy, EMS" } },
    { year: 2019, name: { ko: "박용운", en: "Young-Un Park" }, pos: { ko: "Ph.D. · 2019년 졸업", en: "Ph.D. · 2019" }, photo: "assets/img/members/park-youngun.jpg",
      edu: [EDU("공학사", "B.S.", SCNU_EE), EDU("공학석사", "M.S.", SCNU_EE), EDU("공학박사", "Ph.D.", SCNU_EE)],
      work: { ko: "순천제일대학교 전기자동화과 교수 (2025년 ~ 현재)", en: "Professor, Electrical Automation, Suncheon Jeil College (2025–present)" },
      topic: { ko: "마이크로그리드 및 전기기기", en: "Microgrids and electric machines" } },
    { year: 2019, name: { ko: "박제석", en: "Je-Seok Park" }, pos: { ko: "M.S. · 2019년 졸업", en: "M.S. · 2019" }, photo: "assets/img/members/park-jeseok.jpg",
      edu: [EDU("공학사", "B.S.", SCNU_EE), EDU("공학석사", "M.S.", SCNU_EE), EDU("공학박사", "Ph.D.", { ko: "국민대학교 자동차모빌리티대학원", en: "Graduate School of Automotive Engineering & Mobility, Kookmin University" })],
      work: { ko: "국민대학교 박사후연구원", en: "Postdoctoral Researcher, Kookmin University" },
      topic: { ko: "모터 드라이브", en: "Motor drives" } },
    { year: 2015, name: { ko: "김동성", en: "Dong-Seong Kim" }, pos: { ko: "M.S. · 2015년 졸업", en: "M.S. · 2015" }, photo: "assets/img/members/kim-dongseong.jpg",
      edu: [EDU("공학사", "B.S.", SCNU_EE), EDU("공학석사", "M.S.", SCNU_EE)],
      work: { ko: "㈜그린파워", en: "Green Power Co., Ltd." },
      topic: { ko: "전력전자", en: "Power electronics" } },
    { year: 2016, name: { ko: "서은재", en: "Eun-Jae Seo" }, pos: { ko: "M.S. · 2016년 졸업", en: "M.S. · 2016" }, photo: "assets/img/members/seo-eunjae.jpg",
      edu: [EDU("공학사", "B.S.", SCNU_EE), EDU("공학석사", "M.S.", SCNU_EE)],
      work: { ko: "한국전력공사", en: "Korea Electric Power Corporation (KEPCO)" },
      topic: { ko: "전력전자, 전기기기", en: "Power electronics, electric machines" } },
    { year: 2014, name: { ko: "정학균", en: "Hak-Gyun Jeong" }, pos: { ko: "M.S. · 2014년 졸업", en: "M.S. · 2014" }, photo: "assets/img/members/jeong-hakgyun.jpg",
      edu: [EDU("공학사", "B.S.", SCNU_EE), EDU("공학석사", "M.S.", SCNU_EE)],
      work: { ko: "㈜현대상선", en: "Hyundai Merchant Marine (HMM)" },
      topic: { ko: "전기기기", en: "Electric machines" } },
  ],

  /* ---------------- 강의 ---------------- */
  /* term: 개설 학년·학기 */
  teaching: [
    { ko: "전기자기학", en: "Electromagnetics", term: { ko: "2학년 1학기, 2학기", en: "Sophomore · Spring & Fall" } },
    { ko: "스마트에너지변환공학", en: "Smart Energy Conversion Engineering", term: { ko: "3학년 1학기", en: "Junior · Spring" } },
    { ko: "전기기기", en: "Electric Machines", term: { ko: "3학년 2학기", en: "Junior · Fall" } },
    { ko: "종합설계", en: "Capstone Design", term: { ko: "4학년 1학기, 2학기", en: "Senior · Spring & Fall" }, href: "capstone.html" },
    { ko: "기초전기실험", en: "Basic Electrical Engineering Laboratory", term: { ko: "2학년 2학기 (3주간)", en: "Sophomore · Fall (3 weeks)" } },
  ],

  /* ---------------- 종합설계(캡스톤디자인) 과제 — capstone.html ----------------
     yt: YouTube 영상 ID, awards: 수상·성과 목록 */
  capstone: [
    { year: "2025", yt: "ha_2q9V-PNk",
      title: { ko: "색온도 스펙트럼과 태양광 스트링의 임피던스를 이용한 DC 아크 검출 및 전원 차단장치", en: "DC Arc Detection and Power Cut-off Device Using Color-Temperature Spectrum and PV String Impedance" },
      awards: [
        { ko: "조명·전기설비 캡스톤디자인 경진대회 최우수상", en: "Grand Prize, Lighting & Electrical Installation Capstone Design Competition" },
        { ko: "특허출원", en: "Patent filed" },
        { ko: "대한전기학회 학술대회 발표", en: "Presented at KIEE Conference" } ] },
    { year: "2024", yt: "MDxx5ssl2ws",
      title: { ko: "바이패스 다이오드의 특성을 이용한 모듈 고장 위치 검출 및 원인 진단", en: "PV Module Fault Localization and Root-Cause Diagnosis Using Bypass Diode Characteristics" },
      awards: [
        { ko: "SCNU 캡스톤디자인 대상", en: "Grand Prize, SCNU Capstone Design" },
        { ko: "대한전기학회 스마트에너지경진대회 금상", en: "Gold Prize, KIEE Smart Energy Competition" },
        { ko: "대한전기학회 지역혁신 신기술 아이디어 페스티벌 장려상", en: "Honorable Mention, KIEE Regional Innovation Idea Festival" },
        { ko: "한국산학협력학회 캡스톤디자인 경진대회 장려상", en: "Honorable Mention, KSIAC Capstone Design Competition" },
        { ko: "특허등록", en: "Patent registered" },
        { ko: "대한전기학회 학술대회 발표", en: "Presented at KIEE Conference" } ] },
    { year: "2023", yt: "R0vDsg9BSZU",
      title: { ko: "가돌리늄의 특성을 이용한 배터리 화재 이중 안전장치", en: "Dual Safety Device for Battery Fires Using the Properties of Gadolinium" },
      awards: [
        { ko: "SCNU 캡스톤디자인 대상", en: "Grand Prize, SCNU Capstone Design" },
        { ko: "대한전기학회 스마트에너지경진대회 장려상", en: "Honorable Mention, KIEE Smart Energy Competition" },
        { ko: "SCNU 지산학연 성과 페스티벌 Creative상", en: "Creative Award, SCNU Regional-Industry-Academia Festival" },
        { ko: "특허등록", en: "Patent registered" },
        { ko: "대한전기학회 학술대회 발표", en: "Presented at KIEE Conference" } ] },
    { year: "2022", yt: "a5ORaoE4YhU",
      title: { ko: "주파수 특성을 이용한 태양광 단선 검출기", en: "Solar PV Disconnection Detector Using Frequency Characteristics" },
      awards: [
        { ko: "SCNU 캡스톤디자인 대상", en: "Grand Prize, SCNU Capstone Design" },
        { ko: "KEPCO 국제발명특허대전 동상", en: "Bronze Prize, KEPCO International Invention & Patent Exhibition" },
        { ko: "대한전기학회 스마트에너지경진대회 장려상", en: "Honorable Mention, KIEE Smart Energy Competition" },
        { ko: "전남도지사상 특별상", en: "Special Award, Governor of Jeollanam-do" },
        { ko: "SCNU 산학연성과 페스티벌 H-Tech상", en: "H-Tech Award, SCNU Industry-Academia Festival" },
        { ko: "특허등록", en: "Patent registered" },
        { ko: "대한전기학회 학술대회 발표", en: "Presented at KIEE Conference" } ] },
    { year: "2021", yt: "zK6yBW_POvg",
      title: { ko: "전자장 원리를 활용한 철가루 시계 구현", en: "Iron-Filings Clock Based on Electromagnetic Field Principles" },
      awards: [
        { ko: "SCNU 캡스톤디자인 금상", en: "Gold Prize, SCNU Capstone Design" },
        { ko: "S해커톤경진대회 장려상", en: "Honorable Mention, S-Hackathon Competition" },
        { ko: "특허등록", en: "Patent registered" },
        { ko: "대한전기학회 학술대회 발표", en: "Presented at KIEE Conference" } ] },
    { year: "2020", yt: "V2HaFmPrj3k",
      title: { ko: "스마트 치즈 숙성고", en: "Smart Cheese Ripening Chamber" },
      awards: [
        { ko: "특허등록", en: "Patent registered" },
        { ko: "대한전기학회 학술대회 발표", en: "Presented at KIEE Conference" } ] },
    { year: "2020", yt: "X6d_5AW8GHM",
      title: { ko: "카메라와 초음파 센서를 이용한 농업 기계용 안전 센서", en: "Safety Sensor for Agricultural Machinery Using a Camera and Ultrasonic Sensors" },
      awards: [
        { ko: "SCNU 캡스톤디자인 대상", en: "Grand Prize, SCNU Capstone Design" },
        { ko: "특허등록", en: "Patent registered" },
        { ko: "대한전기학회 학술대회 발표", en: "Presented at KIEE Conference" } ] },
  ],

  /* ---------------- 수상 ---------------- */
  awardsPI: [
    { y: "2025", t: { ko: "국립순천대학교 총장 표창장, 기술이전 우수자", en: "Presidential Commendation, Sunchon National University — Excellence in Technology Transfer" } },
    { y: "2024", t: { ko: "중소벤처기업부 장관 표창장, 산학협력 부문", en: "Minister's Commendation, Ministry of SMEs and Startups — Industry-Academia Cooperation" } },
    { y: "2024", t: { ko: "국립순천대학교 총장 표창장, 산학협력 우수자", en: "Presidential Commendation, Sunchon National University — Excellence in Industry-Academia Cooperation" } },
    { y: "2024", t: { ko: "국립순천대학교 총장 표창장, 특허등록 실적 우수자", en: "Presidential Commendation, Sunchon National University — Excellence in Patent Registration" } },
    { y: "2009", t: { ko: "광주광역시장 표창장, 기업유치 부문", en: "Mayor's Commendation, Gwangju Metropolitan City — Business Attraction" } },
    { y: "2009", t: "IEEE INTELEC 2009 Outstanding Paper Award" },
    { y: "2007", t: "ICEMS 2007 Outstanding Paper Award" },
    { y: "2005", t: { ko: "삼성전자 연말종합포상, 대표이사 표창 / 연구개발부문 동상", en: "Samsung Electronics Annual Awards — CEO Commendation / Bronze Prize in R&D" } },
    { y: "2003", t: { ko: "삼성전자 회로제어전문가과정 우수과제상", en: "Samsung Electronics Circuit Control Expert Program — Best Project Award" } },
  ],
  awardsStudents: [
    { y: "2025", t: { ko: "한국조명전기설비학회 캡스톤디자인 경진대회 최우수상", en: "Grand Prize, Capstone Design Competition, Korean Institute of Illuminating and Electrical Installation Engineers" } },
    { y: "2022–2024", t: { ko: "국립순천대학교 캡스톤디자인 경진대회 대상 (3년 연속)", en: "Grand Prize, Sunchon National University Capstone Design Competition (3 consecutive years)" } },
    { y: "2024", t: { ko: "공학교육혁신센터 교내 캡스톤디자인 경진대회 대상", en: "Grand Prize, Campus Capstone Design Competition, Engineering Education Innovation Center" } },
    { y: "2024", t: { ko: "International Students Joint Capstone Design Project (i-CAPS) Competition 금상", en: "Gold Prize, International Students Joint Capstone Design Project (i-CAPS) Competition" } },
    { y: "2022–2024", t: { ko: "대한전기학회 스마트에너지 경진대회 장려상 · 금상", en: "Honorable Mention and Gold Prize, KIEE Smart Energy Competition" } },
    { y: "2024", t: { ko: "대한전기학회 지역혁신 신기술 아이디어 페스티벌 장려상", en: "Honorable Mention, KIEE Regional Innovation New Technology Idea Festival" } },
    { y: "2024", t: { ko: "한국산학협력학회 창의혁신 캡스톤디자인 경진대회 장려상", en: "Honorable Mention, Creative Innovation Capstone Design Competition, Korea Society of Industry-Academic Cooperation" } },
    { y: "2023", t: { ko: "제53회 대한전기학회, 한국동서발전사장상", en: "Korea East-West Power CEO Award, 53rd KIEE Conference" } },
    { y: "2019, 2022", t: { ko: "한국전력 주관 BIXPO 국제발명특허대전 대학생 부문 동상", en: "Bronze Prize (University Division), BIXPO International Invention & Patent Exhibition hosted by KEPCO" } },
  ],

  /* ---------------- 뉴스 ----------------
     type: publication | award | people | grant | patent */
  news: [
    { date: "2026.02", type: "people", text: { ko: "㈜티엠씨솔루션즈 창업 박사 졸업 — 연구실 출신 두 번째 창업", en: "Ph.D. graduate founded TMC Solutions Co., Ltd. — the lab's second startup" } },
    { date: "2026.02", type: "patent", text: { ko: "특허 등록: 가돌리늄 보조 개폐 장치를 포함하는 화재 감시 시스템", en: "Patent registered: Fire monitoring system with a gadolinium-based auxiliary switching device" } },
    { date: "2026.01", type: "patent", text: { ko: "특허 등록: 온도 변화에 따라 자기적 특성이 변하는 가돌리늄을 이용한 리드스위치", en: "Patent registered: Reed switch using gadolinium whose magnetic properties change with temperature" } },
    { date: "2025.12", type: "patent", text: { ko: "특허 등록: 태양광 단선 검출기 및 이를 이용한 검출 방법", en: "Patent registered: Solar PV disconnection detector and detection method" } },
    { date: "2025.10", type: "publication", text: { ko: "IEEE ECCE 2025 논문 3편 발표 (DAB 위상각 보상, 재구성형 PV 어레이 P2H 등)", en: "Three papers presented at IEEE ECCE 2025 (DAB phase-shift compensation, reconfigurable PV array for P2H, and more)" } },
    { date: "2025.10", type: "publication", text: "IEEE IECON 2025 — Current Calculation Method for PV System using Capacitor Voltage Characteristics" },
    { date: "2025.08", type: "people", text: { ko: "㈜에니트 창업 졸업생 배출 — 연구실 출신 첫 창업", en: "Graduate founded ENIT Co., Ltd. — the lab's first startup" } },
    { date: "2025", type: "people", text: { ko: "연구실 출신 순천제일대학교 전기자동화과 교수 임용", en: "Lab alumnus appointed Professor at Suncheon Jeil College, Dept. of Electrical Automation" } },
    { date: "2025", type: "award", text: { ko: "김대경 교수, 국립순천대학교 총장 표창 (기술이전 우수자)", en: "Prof. Dae-kyong Kim received the SCNU Presidential Commendation (Excellence in Technology Transfer)" } },
    { date: "2025", type: "award", text: { ko: "한국조명전기설비학회 캡스톤디자인 경진대회 최우수상", en: "Grand Prize at the KIIEE Capstone Design Competition" } },
    { date: "2025.06", type: "publication", text: { ko: "Energies (SCIE) 게재 — PV Module Configurations in a Fixed-Load P2H System Considering Regional and Seasonal Solar Irradiance in Korea", en: "Published in Energies (SCIE) — PV Module Configurations in a Fixed-Load P2H System Considering Regional and Seasonal Solar Irradiance in Korea" } },
    { date: "2025.05", type: "patent", text: { ko: "특허 등록: DAB 컨버터에 사용되는 변압기의 변압비와 누설 인덕턴스 추정 시스템", en: "Patent registered: System for estimating turns ratio and leakage inductance of transformers in DAB converters" } },
    { date: "2025.05", type: "grant", text: { ko: "스마트 전력시스템 연계 에너지기술공유 교육 플랫폼 구축 사업 참여 (한국에너지기술평가원)", en: "Joined the KETEP project on an energy-technology sharing education platform linked to smart power systems" } },
    { date: "2025.02", type: "publication", text: { ko: "Energies (SCIE) 게재 — A Novel Structure of Variable Inductance HF Transformer for Power Level Enhancement in DAB Converters", en: "Published in Energies (SCIE) — A Novel Structure of Variable Inductance HF Transformer for Power Level Enhancement in DAB Converters" } },
    { date: "2024", type: "award", text: { ko: "김대경 교수, 중소벤처기업부 장관 표창 (산학협력 부문)", en: "Prof. Dae-kyong Kim received the Minister's Commendation, Ministry of SMEs and Startups (Industry-Academia Cooperation)" } },
    { date: "2024", type: "people", text: { ko: "연구실 출신 국립강릉원주대학교 전기공학과 교수 임용", en: "Lab alumnus appointed Professor at Gangneung-Wonju National University, Dept. of Electrical Engineering" } },
    { date: "2024", type: "award", text: { ko: "i-CAPS Competition 금상 · 교내 캡스톤디자인 경진대회 대상 (3년 연속)", en: "Gold Prize at i-CAPS Competition · Grand Prize at the campus Capstone Design Competition (3 consecutive years)" } },
    { date: "2024.10", type: "publication", text: { ko: "Energies (SCIE) 게재 — Current-Sensorless Method for Photovoltaic System Using Capacitor Charging Characteristics", en: "Published in Energies (SCIE) — Current-Sensorless Method for Photovoltaic System Using Capacitor Charging Characteristics" } },
    { date: "2024.01", type: "publication", text: { ko: "IEEE Access (SCIE) 게재 — Novel Phase Shift Angle Compensation Method of DAB Converter Considering Parasitic Capacitance of SiC MOSFET", en: "Published in IEEE Access (SCIE) — Novel Phase Shift Angle Compensation Method of DAB Converter Considering Parasitic Capacitance of SiC MOSFET" } },
  ],

  /* ---------------- 연구과제 영문명 ----------------
     data.js(엑셀 자동 생성)의 과제명/기관명은 한국어입니다.
     영어 화면에서 보여줄 이름을 "한국어 이름": "English name" 으로 추가하세요. 없으면 한국어 그대로 표시됩니다. */
  projectsEn: {
    "스마트 전력시스템 연계 에너지기술공유 교육 플랫폼 구축을 통한 고급인력 양성": "Advanced Workforce Training through an Energy-Technology Sharing Education Platform Linked to Smart Power Systems",
    "SW중심대학(국립순천대학교)": "Software-Centered University Program (Sunchon National University)",
    "광주·전남지역에너지 클러스터 인재양성": "Gwangju–Jeonnam Regional Energy Cluster Workforce Development",
    "환경조건을 고려한 P2H 시스템 구성 방법 및 제어 방법에 따른 국내 지역별, 계절별 경제성 분석": "Regional and Seasonal Economic Analysis of P2H System Configuration and Control Methods Considering Environmental Conditions in Korea",
    "스마트전력변환기 특성 분석 및 고장진단": "Characteristic Analysis and Fault Diagnosis of Smart Power Converters",
    "PV 시스템의 기생커패시턴스를 이용한 휴대형 단선위치 검출 장비 실용화 개발": "Commercialization of a Portable Disconnection-Location Detector Using the Parasitic Capacitance of PV Systems",
    "BI(BA) PV 안전 및 자산관리를 위한 Sentinel System & Cloud Analytics System 개발": "Sentinel System & Cloud Analytics System for BI(BA) PV Safety and Asset Management",
    "시뮬레이션을 통한 TAB 컨버터의 SPS 및 DPS 제어 비교 연구": "Simulation-Based Comparison of SPS and DPS Control for TAB Converters",
    "실증 데이터 분석 및 활용 전략 수립": "Field Data Analysis and Utilization Strategy",
    "Solar PV Analyzer 실증 및 데이터 분석": "Solar PV Analyzer Field Demonstration and Data Analysis",
    "이동형 융합기기용 전원시스템 고안전성 평가기반 구축사업": "High-Safety Evaluation Infrastructure for Power Systems of Mobile Convergence Devices",
    "4차 산업혁명 혁신선도대학 사업": "Leading University Program for the Fourth Industrial Revolution",
    "멀티펄스 전자기파를 이용한 태양광 솔라 디렉터 개발": "Solar Director for PV Systems Using Multi-Pulse Electromagnetic Waves",
    "수소연료전지시스템의 셀 고장진단 및 모니터링 선행기술조사": "Prior-Art Study on Cell Fault Diagnosis and Monitoring of Hydrogen Fuel Cell Systems",
    "분산전원에 사용되는 50kVA급 전력변환기용 일체형 변압기·리액터의 최적화 설계기술 개발": "Optimal Design of Integrated Transformer/Reactor for 50 kVA Power Converters in Distributed Generation",
    "농축산용 신재생에너지 표준화 센터 지원사업": "Renewable Energy Standardization Center for Agriculture and Livestock",
    "대전력 고주파 변압기의 성능향상을 위한 최적화 설계 및 온도해석": "Optimal Design and Thermal Analysis for Performance Enhancement of High-Power High-Frequency Transformers",
    "Smart Campus 구축을 통한 에너지 신사업 실증": "Demonstration of New Energy Business through a Smart Campus",
    "영구자석형 전동기의 코깅토크 저감을 위한 Sloping 노치의 최적설계에 관한 연구": "Optimal Design of Sloping Notches for Cogging Torque Reduction in Permanent Magnet Motors",
    "지역산업을 연계한 창조형에너지자동화설비 인재양성사업단": "Creative Energy Automation Workforce Program Linked to Regional Industry",
    "저낙차 소수력 발전용 30kW급 gearless 모듈형 다극 영구자석 발전기 개발": "30 kW Gearless Modular Multi-Pole PM Generator for Low-Head Small Hydropower",
    "선박용 3kW급 직류전원 시스템 개발": "3 kW DC Power System for Ships",
    "전력선 통신 기반의 다채널 HD급 멀티미디어 송수신 시스템 개발": "Multi-Channel HD Multimedia Transceiver System Based on Power Line Communication",
    "전동식 공기압축기용 모터제어기에 관한 기초연구": "Basic Study on Motor Controllers for Electric Air Compressors",
  },
  agencyEn: {
    "한국에너지기술평가원": "KETEP",
    "정보통신기획평가원": "IITP",
    "순천대학교": "Sunchon National University",
    "일반기업체": "Industry",
    "전남대학교산학협력단": "Chonnam National University",
    "중소기업기술정보진흥원": "TIPA",
    "한국산업기술진흥원": "KIAT",
    "한국연구재단": "NRF",
    "전남테크노파크": "Jeonnam Technopark",
    "한국전력공사": "KEPCO",
    "교육부": "Ministry of Education",
    "산업통상자원부": "MOTIE",
  },
};
