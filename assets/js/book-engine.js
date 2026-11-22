/* =========================================================
   3D 책 엔진 — book.html(Lab Book), portfolio.html(기술포트폴리오)이 함께 씁니다.
   사용법: BK.start({ spreads: [...], cover: "<표지 HTML>", extra: {href, title, icon} })
   spread = { t: ["한국어 제목", "English title"], L: () => html, R: () => html, init?: (pL, pR) => {} }
   ========================================================= */
(function(){
"use strict";
var $ = function(s, r){ return (r || document).querySelector(s); };
var $$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
function bi(ko, en){ return '<span lang="ko">' + ko + '</span><span lang="en">' + (en == null ? ko : en) + '</span>'; }
function biS(ko, en){ return '<tspan lang="ko">' + ko + '</tspan><tspan lang="en">' + (en == null ? ko : en) + '</tspan>'; }
function bo(o){ if (o == null) return ""; return typeof o === "string" ? o : bi(o.ko || "", o.en || o.ko || ""); }
function lang(){ return document.documentElement.getAttribute("data-lang") || "en"; }
function wf(d, cls){ return '<path class="ink" d="' + d + '"/><path class="flow ' + (cls || "") + '" d="' + d + '"/>'; }
function flap(qKo, qEn, aKo, aEn, tag){
  return '<div class="flap"><div class="a">' + bi(aKo, aEn) + '</div>' +
    '<div class="q"><div class="tag">' + (tag || "NOTE") + '</div><div class="qq">' + bi(qKo, qEn) + '</div>' +
    '<span class="hint">' + bi("눌러서 답 확인 ↑", "Lift the flap for the answer ↑") + '</span></div></div>';
}
function left(o){
  return '<div class="pg"><div class="kicker">' + o.kicker + '</div><h2 class="ttl">' + o.title + '</h2>' +
    (o.lead ? '<p class="lead">' + o.lead + '</p>' : "") + (o.formula ? '<div class="formula">' + o.formula + '</div>' : "") +
    (o.body || "") + (o.flap || "") + (o.note ? '<div class="note">' + o.note + '</div>' : "") + '</div>';
}
function fig(svg, ctl, cap){ return '<div class="fig-pg">' + svg + (ctl || "") + '<div class="figcap">' + cap + '</div></div>'; }
function rnd(a, b){ return a + Math.random() * (b - a); }
var cleanups = [];
function onCleanup(fn){ cleanups.push(fn); }
function runCleanup(){ cleanups.splice(0).forEach(function(f){ try { f(); } catch (e) {} }); }

var DEFS = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
  '<filter id="glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
  '<filter id="bigglow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="6"/></filter>' +
  '<pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" stroke="#2a2926" stroke-width=".8" opacity=".55"/></pattern>' +
  '<linearGradient id="warm" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff8a1f" stop-opacity=".55"/><stop offset="1" stop-color="#ffd27a" stop-opacity=".15"/></linearGradient>' +
  '</defs></svg>';

function start(opts){
  var S = opts.spreads;
  var extra = opts.extra ? '<a href="' + opts.extra.href + '" title="' + opts.extra.title + '"' + (opts.extra.newTab ? ' target="_blank" rel="noopener"' : "") + '>' + opts.extra.icon + '</a>' : "";
  document.body.insertAdjacentHTML("afterbegin", DEFS +
    '<div class="stage" id="stage"><div class="scaler" id="scaler"><div class="plane"><div class="mat"></div>' +
    '<div class="book closed" id="book"><div class="board"></div><div class="ribbon"></div>' +
    '<div class="half L"><article class="page" id="pL"></article></div><div class="half R"><article class="page" id="pR"></article></div>' +
    '<div class="cover" id="cover" role="button" tabindex="0" aria-label="Open the book"><div class="face front">' + opts.cover + '</div>' +
    '<div class="face back"><div class="pwrap"><article class="page" id="coverBack"></article></div></div></div>' +
    '</div></div></div></div><div class="light"></div>' +
    '<div class="openhint" id="openhint">' + bi("책을 눌러 펼쳐 보세요", "Tap the book to open it") + '</div>' +
    '<div class="tocpop" id="tocpop"></div>' +
    '<nav class="bar" aria-label="Book navigation">' +
    '<button id="bToc" title="Contents"><svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h10"/></svg></button>' +
    '<button id="bPrev" title="Previous"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>' +
    '<div class="lbl" id="lbl"></div>' +
    '<button id="bNext" title="Next"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button>' +
    '<span class="sep"></span><button class="lang" id="bLang" title="Language">KO / EN</button>' + extra +
    '<a href="' + (opts.home || "index.html") + '" title="Classic site"><svg viewBox="0 0 24 24"><path d="M3 11l9-7 9 7v9H3z"/><path d="M9 20v-6h6v6"/></svg></a></nav>');

  var book = $("#book"), cover = $("#cover"), pL = $("#pL"), pR = $("#pR"), scaler = $("#scaler");
  var cur = -1, busy = false, flat = false;
  function folio(n){ return '<div class="folio">' + n + '</div>'; }
  function html(i){ return { L: S[i].L() + folio(i ? i * 2 : "i"), R: S[i].R() + folio(i * 2 + 1) }; }
  function place(i){ var h = html(i); pL.innerHTML = h.L; pR.innerHTML = h.R; }
  function initSpread(i){ if (S[i] && S[i].init) S[i].init(pL, pR); }
  function after(el, ms, fn){ var done = false; var f = function(){ if (done) return; done = true; el.removeEventListener("transitionend", h); fn(); };
    var h = function(e){ if (e.target === el && e.propertyName === "transform") f(); }; el.addEventListener("transitionend", h); setTimeout(f, ms); }
  function mkLeaf(dir, frontHTML, backHTML){
    var lf = document.createElement("div"); lf.className = "leaf " + dir;
    lf.innerHTML = '<div class="face front ' + (dir === "fwd" ? "r" : "l") + '"><article class="page">' + frontHTML + '</article></div>' +
      '<div class="face back ' + (dir === "fwd" ? "l" : "r") + '"><article class="page">' + backHTML + '</article></div>';
    book.appendChild(lf); return lf;
  }
  function go(t){
    t = Math.max(-1, Math.min(S.length - 1, t));
    if (busy || t === cur) return;
    $("#tocpop").classList.remove("show");
    runCleanup();
    var from = cur; cur = t; ui();
    if (flat){
      if (t < 0){ book.classList.add("closed"); cover.classList.remove("gone", "open"); }
      else { book.classList.remove("closed"); cover.classList.add("gone"); place(t); initSpread(t); window.scrollTo(0, 0); }
      return;
    }
    busy = true;
    if (from < 0){
      var h = html(t); pR.innerHTML = h.R; $("#coverBack").innerHTML = h.L;
      cover.classList.remove("gone"); void cover.offsetWidth;
      book.classList.remove("closed"); cover.classList.add("open");
      after(cover, 1400, function(){ pL.innerHTML = h.L; cover.classList.add("gone"); busy = false; initSpread(t); });
      return;
    }
    if (t < 0){
      $("#coverBack").innerHTML = pL.innerHTML;
      cover.classList.remove("gone"); void cover.offsetWidth;
      book.classList.add("closed"); cover.classList.remove("open");
      after(cover, 1400, function(){ busy = false; });
      return;
    }
    var n = html(t), lf;
    if (t > from){
      lf = mkLeaf("fwd", pR.innerHTML, n.L); pR.innerHTML = n.R;
      void lf.offsetWidth; lf.classList.add("go");
      after(lf, 1200, function(){ pL.innerHTML = n.L; lf.remove(); busy = false; initSpread(t); });
    } else {
      lf = mkLeaf("bwd", pL.innerHTML, n.R); pL.innerHTML = n.L;
      void lf.offsetWidth; lf.classList.add("go");
      after(lf, 1200, function(){ pR.innerHTML = n.R; lf.remove(); busy = false; initSpread(t); });
    }
  }
  function ui(){
    var title = cur < 0 ? ["표지", "Cover"] : S[cur].t;
    $("#lbl").innerHTML = '<i>' + (cur < 0 ? "—" : String(cur).padStart(2, "0")) + '</i>' + bi(title[0], title[1]);
    $("#bPrev").disabled = cur < 0; $("#bNext").disabled = cur >= S.length - 1;
    document.body.classList.toggle("opened", cur >= 0);
    $("#tocpop").innerHTML = '<button data-go="-1"' + (cur < 0 ? ' class="cur"' : "") + '><i>—</i>' + bi("표지", "Cover") + '</button>' +
      S.map(function(s, i){ return '<button data-go="' + i + '"' + (i === cur ? ' class="cur"' : "") + '><i>' + String(i).padStart(2, "0") + '</i>' + bi(s.t[0], s.t[1]) + '</button>'; }).join("");
    try { history.replaceState(null, "", cur < 0 ? location.pathname + location.search : "#p" + cur); } catch (e) {}
  }
  function fit(){
    var f = innerWidth < 760 || innerHeight < 500;
    if (f !== flat){ flat = f; document.body.classList.toggle("flat", flat);
      if (cur >= 0){ book.classList.remove("closed"); cover.classList.add("open", "gone"); } }
    if (flat){ scaler.style.transform = ""; return; }
    var s = Math.min((innerWidth - 40) / 1300, (innerHeight - 90) / 900);
    scaler.style.transform = "translate(-50%,-50%) scale(" + s.toFixed(3) + ")";
  }

  cover.addEventListener("click", function(){ if (cur < 0) go(0); });
  cover.addEventListener("keydown", function(e){ if ((e.key === "Enter" || e.key === " ") && cur < 0){ e.preventDefault(); go(0); } });
  $("#bPrev").addEventListener("click", function(){ go(cur - 1); });
  $("#bNext").addEventListener("click", function(){ go(cur + 1); });
  $("#bToc").addEventListener("click", function(e){ e.stopPropagation(); $("#tocpop").classList.toggle("show"); });
  $("#bLang").addEventListener("click", function(){
    var l = lang() === "ko" ? "en" : "ko";
    document.documentElement.setAttribute("data-lang", l); document.documentElement.lang = l;
    try { localStorage.setItem("lang", l); } catch (e) {}
  });
  document.addEventListener("click", function(e){
    var g = e.target.closest("[data-go]"); if (g && !g.closest(".leaf")){ go(+g.dataset.go); return; }
    var f = e.target.closest(".flap"); if (f && !f.closest(".leaf,.cover")){ f.classList.toggle("open"); return; }
    if (!e.target.closest("#tocpop")) $("#tocpop").classList.remove("show");
  });
  document.addEventListener("keydown", function(e){
    if (e.target.tagName === "INPUT") return;
    if (e.key === "ArrowRight") go(cur + 1); else if (e.key === "ArrowLeft") go(cur - 1);
  });
  addEventListener("resize", fit);

  var m = /^#p(\d+)$/.exec(location.hash);
  fit();
  if (m){ var t0 = Math.min(S.length - 1, +m[1]); cur = t0; book.classList.remove("closed"); cover.classList.add("open", "gone"); place(t0); initSpread(t0); }
  ui();
  addEventListener("hashchange", function(){ var h = /^#p(\d+)$/.exec(location.hash); if (h && +h[1] !== cur) go(+h[1]); });
}

window.BK = { $: $, $$: $$, bi: bi, biS: biS, bo: bo, wf: wf, flap: flap, left: left, fig: fig, rnd: rnd, onCleanup: onCleanup, start: start };
})();
