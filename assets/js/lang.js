/* 페이지 표시 전에 언어를 정합니다 (기본: 영어).
   우선순위: 주소의 ?lang=ko|en → 마지막으로 고른 언어(localStorage) → en */
(function () {
  var l = "en";
  try {
    var q = new URLSearchParams(location.search).get("lang");
    var saved = localStorage.getItem("lang");
    if (q === "ko" || q === "en") { l = q; localStorage.setItem("lang", q); }
    else if (saved === "ko" || saved === "en") l = saved;
  } catch (e) { /* 저장소 사용 불가 시 기본값 */ }
  document.documentElement.lang = l;
  document.documentElement.setAttribute("data-lang", l);
})();
