/* 공통 레이아웃(헤더/사이드바/푸터) + 페이지별 렌더링 + 언어 전환(EN/KO)
   - 번역할 글은 <span lang="ko">…</span><span lang="en">…</span> 쌍으로 렌더링하고,
     CSS 가 현재 언어(html[data-lang])가 아닌 쪽을 숨깁니다. */
(function () {
  const L = window.LAB;
  const D = window.LAB_DATA || {};
  const page = document.body.dataset.page;
  const root = document.documentElement;

  const NAV = [
    ["index.html", "Home", "home"],
    ["members.html", "Members", "members"],
    ["research.html", "Research", "research"],
    ["publications.html", "Publications", "publications"],
    ["projects.html", "Projects", "projects"],
    ["teaching.html", "Teaching", "teaching"],
    ["awards.html", "Awards", "awards"],
  ];

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $ = (sel, r = document) => r.querySelector(sel);

  /* ---------- i18n helpers ---------- */
  const lang = () => (root.dataset.lang === "ko" ? "ko" : "en");
  // 이미 escape 된 HTML 두 개 → 언어 쌍
  const bi = (ko, en) => (en == null || en === ko ? ko : `<span lang="ko">${ko}</span><span lang="en">${en}</span>`);
  // 값(문자열 또는 {ko,en}) → escape 된 언어 쌍
  const T = (v) => (v && typeof v === "object" ? bi(esc(v.ko), esc(v.en ?? v.ko)) : esc(v));
  // 값 → 현재 언어의 일반 문자열 (속성/검색용)
  const plain = (v) => (v && typeof v === "object" ? (v[lang()] ?? v.ko) : String(v ?? ""));
  const langHooks = [];
  const onLang = (fn) => { langHooks.push(fn); fn(lang()); };
  function setLang(l) {
    root.dataset.lang = l;
    root.lang = l;
    try { localStorage.setItem("lang", l); } catch (e) { /* 저장 불가 환경 */ }
    langHooks.forEach((fn) => fn(l));
  }

  /* ---------- header ---------- */
  const header = document.createElement("div");
  header.innerHTML = `
    <a class="sr-only" href="#main">${bi("본문 바로가기", "Skip to content")}</a>
    <header class="site-header"><div class="container">
      <a class="brand" href="index.html">
        <img src="assets/img/emblem.png" alt="Sunchon National University emblem">
        <span><span class="brand-title">${esc(L.name)}</span><br><span class="brand-sub">${bi(`${esc(L.nameKo)} · ${esc(L.universityKo)} ${esc(L.deptKo)}`, `${esc(L.dept)}, ${esc(L.university)}`)}</span></span>
      </a>
      <div class="header-tools">
        <nav class="main-nav" id="main-nav" aria-label="Main menu"><ul>
          ${NAV.map(([href, label, key]) => `<li><a href="${href}" class="${key === (document.body.dataset.nav || page) ? "active" : ""}">${label}</a></li>`).join("")}
        </ul></nav>
        <div class="lang-switch" role="group" aria-label="Language">
          <button type="button" data-l="en" lang="en-US">EN</button><button type="button" data-l="ko" lang="ko-KR">한국어</button>
        </div>
        <button class="nav-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="Menu">☰</button>
      </div>
    </div></header>`;
  document.body.prepend(...header.childNodes);

  const toggle = $(".nav-toggle");
  toggle.addEventListener("click", () => {
    const nav = $("#main-nav");
    nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", nav.classList.contains("open"));
  });
  const sw = $(".lang-switch");
  sw.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-l]");
    if (b) setLang(b.dataset.l);
  });
  onLang((l) => sw.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.l === l)));

  /* 문서 제목: <title data-ko="..."> 이 있으면 언어에 따라 전환 */
  const titleEl = document.querySelector("title");
  const titleEn = titleEl.textContent, titleKo = titleEl.dataset.ko || titleEn;
  onLang((l) => { document.title = l === "ko" ? titleKo : titleEn; });

  /* ---------- layout: profile sidebar + content ---------- */
  const c = L.contact;
  const ICON = {
    pin: '<path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/>',
    uni: '<path d="M12 3 1 9l11 6 9-4.9V17h2V9L12 3zM5 13.2v4L12 21l7-3.8v-4L12 17l-7-3.8z"/>',
    mail: '<path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>',
    phone: '<path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1L6.6 10.8z"/>',
    link: '<path d="M10.6 13.4a1 1 0 0 0 1.4 0l4-4a3 3 0 1 0-4.2-4.2l-1.3 1.3 1.4 1.4 1.3-1.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 0 0 1.4zm2.8-2.8a1 1 0 0 0-1.4 0l-4 4a3 3 0 1 0 4.2 4.2l1.3-1.3-1.4-1.4-1.3 1.3a1 1 0 1 1-1.4-1.4l4-4a1 1 0 0 0 0-1.4z"/>',
    people: '<path d="M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-2.3 0-7 1.2-7 3.5V19h14v-2.5C15 14.2 10.3 13 8 13zm8 0c-.3 0-.6 0-1 .1 1.2.8 2 1.9 2 3.4V19h6v-2.5c0-2.3-4.7-3.5-7-3.5z"/>',
  };
  const ico = (k) => `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${ICON[k]}</svg>`;
  const pi = L.pi;
  const nameEnShort = pi.nameEn.replace(/,.*$/, "");
  const sidebar = document.createElement("aside");
  sidebar.className = "sidebar";
  sidebar.setAttribute("aria-label", "Principal investigator");
  sidebar.innerHTML = `
    <img class="author__avatar" src="${esc(pi.photo)}" alt="Prof. ${esc(nameEnShort)}">
    <h3 class="author__name">${bi(`${esc(pi.name)} 교수<small>${esc(pi.nameEn)}</small>`, `Prof. ${esc(nameEnShort)}<small>${esc(pi.name)}</small>`)}</h3>
    <p class="author__bio">Professor @ ${esc(L.university)}<br>${bi(esc(L.nameKo), esc(L.name))}</p>
    <ul class="author__urls">
      <li>${ico("pin")} Suncheon, Korea</li>
      <li>${ico("uni")} <a href="https://elec.scnu.ac.kr" target="_blank" rel="noopener">${bi(`${esc(L.universityKo)} ${esc(L.deptKo)}`, `Dept. of Electrical Eng., SCNU`)}</a></li>
      ${c.email ? `<li>${ico("mail")} <span>Email : <a href="mailto:${esc(c.email)}">${esc(c.email)}</a></span></li>` : ""}
      ${c.phone ? `<li>${ico("phone")} <span>Tel : <a href="tel:${esc(c.phone.replace(/[^\d+]/g, ""))}">${esc(c.phone)}</a></span></li>` : ""}
      <li>${ico("people")} <a href="members.html">Members</a></li>
      ${L.links.map((l) => `<li>${l.icon === "scnu" ? '<span class="ico-scnu" aria-hidden="true"></span>' : ico("link")} <a href="${esc(l.url)}" target="_blank" rel="noopener">${T(l.label)}</a></li>`).join("")}
    </ul>
    <a class="side-cta" href="index.html#join">Join the Lab</a>`;
  const mainEl = $("#main");
  const layout = document.createElement("div");
  layout.className = "layout";
  mainEl.before(layout);
  layout.append(sidebar, mainEl);

  /* ---------- footer ---------- */
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `<div class="container">
    <div class="footer-grid">
      <div>
        <div class="footer-brand"><img src="assets/img/emblem.png" alt=""><b>${esc(L.name)}</b></div>
        <p>${bi(`${esc(L.nameKo)}<br>${esc(L.universityKo)} ${esc(L.deptKo)} · 스마트에너지연구소`, `${esc(L.dept)}<br>${esc(L.university)} · Smart Energy Research Institute`)}</p>
      </div>
      <div>
        <h3>Contact Us</h3>
        <ul>
          <li>${T(c.address)}</li>
          ${c.office ? `<li>${T(c.office)}</li>` : ""}
          ${c.phone ? `<li>Tel. ${esc(c.phone)}</li>` : ""}
          ${c.email ? `<li><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>` : ""}
        </ul>
      </div>
      <div>
        <h3>Other Links</h3>
        <ul>${L.links.map((l) => `<li><a href="${esc(l.url)}" target="_blank" rel="noopener">${T(l.label)}</a></li>`).join("")}
          ${NAV.slice(1).map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join("")}</ul>
      </div>
    </div>
    <div class="footer-bottom"><span>© ${new Date().getFullYear()} ${esc(L.name)}, ${esc(L.university)}. All rights reserved.</span><span>Last updated ${esc(D.updated || "")}</span></div>
  </div>`;
  document.body.append(footer);

  /* ---------- lightbox (figure 확대) ---------- */
  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.innerHTML = "<img alt=''>";
  lb.addEventListener("click", () => lb.classList.remove("open"));
  document.addEventListener("keydown", (e) => e.key === "Escape" && lb.classList.remove("open"));
  document.body.append(lb);
  document.addEventListener("click", (e) => {
    const f = e.target.closest(".fig, .zoom");
    if (!f) return;
    const img = f.tagName === "IMG" ? f : f.querySelector("img");
    lb.firstChild.src = img.src;
    lb.firstChild.alt = img.alt;
    lb.classList.add("open");
  });

  /* ---------- scroll progress + back to top ---------- */
  const bar = document.createElement("div");
  bar.id = "scroll-progress";
  const topBtn = document.createElement("button");
  topBtn.id = "back-to-top";
  topBtn.setAttribute("aria-label", "Back to top");
  topBtn.innerHTML = "&#8963;";
  topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  document.body.append(bar, topBtn);
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + "%";
    topBtn.classList.toggle("show", scrollY > 600);
  };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll, { passive: true });
  onScroll();

  /* scroll reveal (페이지 렌더링 후 실행) */
  const reveal = () => {
    const els = document.querySelectorAll(".card, .stat, .research-area, .profile, .fig, .year-group");
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((ents) => ents.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("revealed"); io.unobserve(e.target); }
    }), { threshold: 0.06 });
    els.forEach((el) => { if (el.getBoundingClientRect().top > innerHeight) { el.classList.add("reveal-init"); io.observe(el); } });
  };

  /* ---------- helpers ---------- */
  const TAG = { publication: "Publication", award: "Award", people: "People", grant: "Grant", patent: "Patent" };

  function renderNews(el, limit) {
    if (!el) return;
    const filterEl = $("#news-filter");
    let cur = "all";
    const draw = () => {
      const items = L.news.filter((n) => cur === "all" || n.type === cur).slice(0, limit || 999);
      el.innerHTML = items.map((n) => `<li><span class="news-date">${esc(n.date)}</span><span class="tag ${n.type}">${TAG[n.type]}</span><span>${T(n.text)}</span></li>`).join("");
    };
    if (filterEl) {
      const types = ["all", ...Object.keys(TAG)];
      filterEl.innerHTML = types.map((t) => `<button class="chip ${t === "all" ? "on" : ""}" data-t="${t}">${t === "all" ? "All" : TAG[t]}</button>`).join("");
      filterEl.addEventListener("click", (e) => {
        const b = e.target.closest(".chip");
        if (!b) return;
        cur = b.dataset.t;
        filterEl.querySelectorAll(".chip").forEach((x) => x.classList.toggle("on", x === b));
        draw();
      });
    }
    draw();
  }

  /* ---------- HOME ---------- */
  if (page === "home") {
    renderNews($("#news"), 10);
    const recent = (D.journals || []).filter((j) => j.scope === "intl").slice(0, 4);
    $("#recent-pubs").innerHTML = recent.map((j, i) => `<li class="pub" data-n="${i + 1}"><div><div class="pub-title">${esc(j.title)}</div><div class="pub-meta"><i>${esc(j.venue)}</i>, ${esc(j.date)}</div></div></li>`).join("");
  }

  /* ---------- MEMBERS ---------- */
  if (page === "members") {
    const p = L.pi;
    const tl = (arr) => arr.map((x) => `<li><span class="when">${T(x.when)}</span><span>${T(x.what)}</span></li>`).join("");
    $("#pi").innerHTML = `
      <div><img class="profile-photo" src="${esc(p.photo)}" alt="Prof. ${esc(nameEnShort)}">
        <ul class="contact-list">
          ${c.office ? `<li><b>Office</b> ${T(c.office)}</li>` : ""}
          ${c.phone ? `<li><b>Tel</b> ${esc(c.phone)}</li>` : ""}
          ${c.email ? `<li><b>Email</b> <a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>` : ""}
        </ul></div>
      <div>
        <h2>${bi(`${esc(p.name)} <span class="en">${esc(p.nameEn)}</span>`, `${esc(p.nameEn)} <span class="en">${esc(p.name)}</span>`)}</h2>
        <div class="role">${T(p.title).replace(/Senior Member of the IEEE/g, "<em>$&</em>")}</div>
        <h3 class="subhead">Research Interests</h3>
        <ul>${p.interests.map((i) => `<li>${T(i)}</li>`).join("")}</ul>
        <h3 class="subhead">Career</h3>
        <ul class="timeline">${tl(p.career)}</ul>
        <h3 class="subhead">Professional Service</h3>
        <ul class="timeline">${tl(p.service)}</ul>
        <p><a class="more-link" href="awards.html">Awards &amp; Honors</a></p>
      </div>`;
    // 한국어 화면: 한글 이름 + 영문 이름, 영어 화면: 영문 이름 + 한글 이름 (영문 이름이 없으면 한 줄)
    const nameHTML = (n) => {
      const ko = esc(n.ko ?? n), en = esc(n.en ?? n.ko ?? n);
      return en === ko ? `<h3>${ko}</h3>` : `<h3>${bi(ko, en)}</h3><div class="alt-name">${bi(en, ko)}</div>`;
    };
    const people = (list) => list.length
      ? `<div class="grid c4">${list.map((m) => `<div class="card person">
          ${m.photo
            ? `<div class="avatar"><img src="${esc(m.photo)}" alt="${esc(plain(m.name))}" loading="lazy"></div>`
            : `<div class="avatar no-photo" role="img" aria-label="${esc(L.name)}"><img src="assets/img/emblem.png" alt=""><b>${esc(L.name)}</b></div>`}
          ${nameHTML(m.name)}
          <div class="pos">${T(m.pos)}</div>
          ${m.edu?.length ? `<ul class="edu">${m.edu.map((e) => `<li>${T(e)}</li>`).join("")}</ul>` : ""}
          ${m.work ? `<div class="work">${T(m.work)}</div>` : ""}
          ${m.topic ? `<div class="topic">${T(m.topic)}</div>` : ""}</div>`).join("")}</div>`
      : `<div class="empty-note">${bi("구성원 정보 업데이트 예정", "Member information coming soon")}</div>`;
    $("#grad").innerHTML = people(L.members.grad || []);
    $("#ug").innerHTML = people(L.members.undergrad || []);
    $("#alumni").innerHTML = people([...L.alumni].sort((a, b) => (b.year || 0) - (a.year || 0)));
    $("#contact-addr").innerHTML = T(c.address);
  }

  /* ---------- TEACHING ---------- */
  if (page === "teaching") {
    $("#courses").innerHTML = (L.teaching || []).map((t, i) => {
      const tag = t.href ? "a" : "div";
      return `<${tag} class="card course${t.href ? " linked" : ""}"${t.href ? ` href="${esc(t.href)}"` : ""}>
        <div class="body"><div class="num">${String(i + 1).padStart(2, "0")}</div>
        <h3>${bi(esc(t.ko), esc(t.en))}</h3>
        <p>${bi(esc(t.en), esc(t.ko))}</p>
        ${t.href ? `<span class="more-link">${bi("과제 보기", "View Projects")}</span>` : ""}
        ${t.term ? `<span class="term">${T(t.term)}</span>` : ""}</div></${tag}>`;
    }).join("");
  }

  /* ---------- CAPSTONE ---------- */
  if (page === "capstone") {
    const list = L.capstone || [];
    $("#cap-count").innerHTML = bi(`${list.length}개 과제`, `${list.length} projects`);
    $("#capstone").innerHTML = list.map((p) => `<article class="cap">
        <button class="cap-video" type="button" data-yt="${esc(p.yt)}" aria-label="Play video: ${esc(p.title.en)}">
          <img src="https://i.ytimg.com/vi/${esc(p.yt)}/hqdefault.jpg" alt="" loading="lazy"><span class="cap-play" aria-hidden="true"></span></button>
        <div class="cap-body">
          <span class="cap-year">${esc(p.year)}</span>
          <h3>${T(p.title)}</h3>
          <ul class="cap-awards">${p.awards.map((a) => `<li>${T(a)}</li>`).join("")}</ul>
          <a class="more-link" href="https://youtu.be/${esc(p.yt)}" target="_blank" rel="noopener">${bi("YouTube에서 보기", "Watch on YouTube")}</a>
        </div></article>`).join("");
    $("#capstone").addEventListener("click", (e) => {
      const b = e.target.closest(".cap-video");
      if (!b) return;
      const f = document.createElement("iframe");
      f.src = `https://www.youtube-nocookie.com/embed/${b.dataset.yt}?autoplay=1&rel=0`;
      f.title = b.getAttribute("aria-label");
      f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      f.allowFullscreen = true;
      const w = document.createElement("div");
      w.className = "cap-video playing";
      w.appendChild(f);
      b.replaceWith(w);
    });
  }

  /* ---------- AWARDS ---------- */
  if (page === "awards") {
    const list = (arr) => arr.map((a) => `<li><span class="yr">${esc(a.y)}</span><span>${T(a.t)}</span></li>`).join("");
    $("#awards-pi").innerHTML = list(L.awardsPI);
    $("#awards-st").innerHTML = list(L.awardsStudents);
  }

  /* ---------- PUBLICATIONS ---------- */
  if (page === "publications") {
    const CATS = {
      ij: { label: "International Journals", items: D.journals.filter((j) => j.scope === "intl") },
      dj: { label: "Domestic Journals", items: D.journals.filter((j) => j.scope === "dom") },
      ic: { label: "International Conferences", items: D.conferences.filter((j) => j.scope === "intl") },
      dc: { label: "Domestic Conferences", items: D.conferences.filter((j) => j.scope === "dom") },
      pt: { label: "Patents", items: D.patents },
    };
    const year = (it) => (it.date || it.regDate || "").slice(0, 4);
    const tabsEl = $("#pub-tabs"), listEl = $("#pub-list"), q = $("#pub-q"), ySel = $("#pub-year"), countEl = $("#pub-count");
    let cat = (location.hash || "#ij").slice(1);
    if (!CATS[cat]) cat = "ij";

    tabsEl.innerHTML = Object.entries(CATS).map(([k, v]) => `<button class="tab" data-k="${k}">${v.label}<span class="cnt">${v.items.length}</span></button>`).join("");

    const itemHTML = (it, n) => {
      if (cat === "pt") {
        const ko = esc(it.title), en = it.title_en ? esc(it.title_en) : ko;
        return `<li class="pub" data-n="${n}"><div><div class="pub-title">${bi(ko, en)}</div>
          ${it.title_en ? `<div class="pub-meta"><i>${bi(en, ko)}</i></div>` : ""}
          <div class="pub-meta">${bi("등록번호", "Reg. No.")} ${esc(it.regNo)} (${esc(it.regDate)}) · ${bi("출원", "Appl.")} ${esc(it.appNo)} (${esc(it.appDate)})<span class="badge">KR</span></div>
          ${it.transfer ? `<div class="pub-meta transfer">${bi(`기술이전(특허양도) - ${esc(it.transfer.ko)}`, `Technology transfer (patent assignment) - ${esc(it.transfer.en)}`)}</div>` : ""}
          ${it.joint ? `<div class="pub-meta transfer">${bi(`공동특허 - ${esc(it.joint.ko)}`, `Joint patent - ${esc(it.joint.en)}`)}</div>` : ""}</div></li>`;
      }
      return `<li class="pub" data-n="${n}"><div><div class="pub-title">${esc(it.title)}</div>
        <div class="pub-meta"><i>${esc(it.venue)}</i>, ${esc(it.date)}</div></div></li>`;
    };

    const draw = () => {
      const ko = lang() === "ko";
      const items = CATS[cat].items;
      const years = [...new Set(items.map(year))].sort().reverse();
      const keepY = ySel.value;
      ySel.innerHTML = `<option value="">${ko ? "전체 연도" : "All years"}</option>` + years.map((y) => `<option ${y === keepY ? "selected" : ""}>${y}</option>`).join("");
      const kw = q.value.trim().toLowerCase();
      const filtered = items.filter((it) =>
        (!ySel.value || year(it) === ySel.value) &&
        (!kw || [it.title, it.title_en, it.venue].join(" ").toLowerCase().includes(kw)));
      countEl.textContent = ko ? `${filtered.length}건` : `${filtered.length} ${filtered.length === 1 ? "item" : "items"}`;
      let n = filtered.length, html = "";
      const groups = {};
      filtered.forEach((it) => (groups[year(it)] ||= []).push(it));
      Object.keys(groups).sort().reverse().forEach((y) => {
        html += `<div class="year-group"><h3>${y}</h3><ol class="pub-list">${groups[y].map((it) => itemHTML(it, n--)).join("")}</ol></div>`;
      });
      listEl.innerHTML = html || `<div class="empty-note">${bi("검색 결과가 없습니다.", "No results found.")}</div>`;
      tabsEl.querySelectorAll(".tab").forEach((t) => t.classList.toggle("on", t.dataset.k === cat));
    };
    tabsEl.addEventListener("click", (e) => {
      const t = e.target.closest(".tab");
      if (!t) return;
      cat = t.dataset.k;
      ySel.value = "";
      history.replaceState(null, "", "#" + cat);
      draw();
    });
    q.addEventListener("input", draw);
    ySel.addEventListener("change", draw);
    onLang((l) => {
      q.placeholder = l === "ko" ? "제목, 학술지/학회명으로 검색 (예: DAB, PV, transformer)" : "Search by title or venue (e.g., DAB, PV, transformer)";
      $("#pub-updated").textContent = l === "ko" ? `엑셀 실적 기준 · 최종 갱신 ${D.updated}` : `Last updated ${D.updated}`;
      draw();
    });
  }

  /* ---------- PROJECTS ---------- */
  if (page === "projects") {
    const ROLE = { "연구책임자": "Principal Investigator", "공동연구자": "Co-Investigator" };
    const PEN = L.projectsEn || {}, AEN = L.agencyEn || {};
    const row = (p) => `<tr><td class="period">${esc(p.start)} – ${esc(p.end)}</td>
      <td class="t">${bi(esc(p.title), esc(PEN[p.title] || p.title))}${p.ongoing ? ` <span class="badge solid">${bi("진행중", "Ongoing")}</span>` : ""}</td>
      <td>${bi(esc(p.agency), esc(AEN[p.agency] || p.agency))}</td><td>${bi(esc(p.role), esc(ROLE[p.role] || p.role))}</td></tr>`;
    const on = D.projects.filter((p) => p.ongoing), done = D.projects.filter((p) => !p.ongoing);
    $("#proj-on").innerHTML = on.map(row).join("") || `<tr><td colspan="4">—</td></tr>`;
    $("#proj-done").innerHTML = done.map(row).join("");
    $("#proj-count").innerHTML = bi(`진행 ${on.length}건 · 완료 ${done.length}건`, `${on.length} ongoing · ${done.length} completed`);
  }

  reveal();
})();
