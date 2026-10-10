(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const isMobile = () => matchMedia("(max-width: 767px)").matches;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const { SITE, SONGS, PLAYER_SONGS, TOOLS, PEOPLE, FOLDERS, LYRIC_SONGS, AI_MAP } = window;
  const isYouTube = (url) => /youtube\.com|youtu\.be/.test(url);

  /* ---------- generated images: soft placeholder until they exist ---------- */
  function guardImage(img) {
    const fail = () => {
      img.classList.add("missing");
      const box = img.parentElement;
      if (box) box.classList.add("ph");
    };
    if (img.complete && img.naturalWidth === 0) fail();
    else img.addEventListener("error", fail, { once: true });
  }
  $$("img[data-fallback]").forEach(guardImage);

  /* ---------- links: mail + ask Claude / ChatGPT ---------- */
  const q = encodeURIComponent(SITE.askPrompt);
  const askUrl = { claude: `https://claude.ai/new?q=${q}`, chatgpt: `https://chatgpt.com/?q=${q}` };
  $$("[data-ask]").forEach((a) => (a.href = askUrl[a.dataset.ask]));
  $("#fMail").textContent = SITE.email;

  // mailto는 PC에 메일 앱이 없으면 아무 반응이 없어서, 누르면 주소를 복사하고
  // Gmail(새 메일 창) / 메일 앱 중에서 고를 수 있는 안내를 띄워요.
  const gmailHref = (subject) =>
    `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(SITE.email)}` +
    (subject ? `&su=${encodeURIComponent(subject)}` : "");
  const mailtoHref = (subject) =>
    `mailto:${SITE.email}` + (subject ? `?subject=${encodeURIComponent(subject)}` : "");
  const toast = document.createElement("div");
  toast.className = "mail-toast";
  toast.setAttribute("role", "status");
  document.body.appendChild(toast);
  let toastTimer = 0;
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    const ta = Object.assign(document.createElement("textarea"), { value: text });
    ta.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } finally { ta.remove(); }
    return Promise.resolve();
  }
  function openMail(subject) {
    copyText(SITE.email).catch(() => {});
    toast.innerHTML = `
      <p class="mt-msg"><b>${SITE.email}</b><span>주소를 복사했어요</span></p>
      <div class="mt-actions">
        <a href="${gmailHref(subject)}" target="_blank" rel="noopener noreferrer">Gmail로 쓰기</a>
        <a href="${mailtoHref(subject)}">메일 앱으로 열기</a>
        <button type="button" class="mt-close" aria-label="닫기">×</button>
      </div>`;
    toast.classList.add("show");
    $(".mt-close", toast).addEventListener("click", () => toast.classList.remove("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 8000);
  }
  $$("[data-mail]").forEach((a) => {
    a.href = mailtoHref();
    a.addEventListener("click", (e) => { e.preventDefault(); openMail(); });
  });

  // calendar widget → booking page if set (Google 캘린더 약속 일정 링크), otherwise a meeting-request email
  function openBooking() {
    if (SITE.bookingUrl) window.open(SITE.bookingUrl, "_blank", "noopener");
    else openMail("미팅 요청드려요");
  }
  $("#calWidget").addEventListener("click", openBooking);
  $("#calWidget").addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openBooking(); }
  });

  /* ---------- time: menubar, world clock, calendar, dock ---------- */
  const zoneNow = (tz) => new Date(new Date().toLocaleString("en-US", { timeZone: tz }));
  const seoulNow = () => zoneNow("Asia/Seoul");
  const KDAY = ["일", "월", "화", "수", "목", "금", "토"];

  // macOS-style world clock: one small face per city, dark face at night
  const CITIES = [
    { name: "SEOUL",      tz: "Asia/Seoul" },
    { name: "TOKYO",      tz: "Asia/Tokyo" },
    { name: "NEW YORK",   tz: "America/New_York" },
    { name: "SÃO PAULO",  tz: "America/Sao_Paulo" },
  ];
  const tickMarks = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    const r1 = i % 3 === 0 ? 36 : 39;
    return `<line x1="${50 + r1 * Math.sin(a)}" y1="${50 - r1 * Math.cos(a)}" x2="${50 + 43 * Math.sin(a)}" y2="${50 - 43 * Math.cos(a)}"/>`;
  }).join("");
  $("#worldClock").innerHTML = CITIES.map((c) => `
    <div class="wc" data-tz="${c.tz}">
      <svg viewBox="0 0 100 100" class="wc-face" aria-hidden="true">
        <circle cx="50" cy="50" r="48" class="wc-bg"/>
        <g class="wc-ticks">${tickMarks}</g>
        <line class="wc-h" x1="50" y1="50" x2="50" y2="27"/>
        <line class="wc-m" x1="50" y1="50" x2="50" y2="15"/>
        <line class="wc-s" x1="50" y1="58" x2="50" y2="12"/>
        <circle cx="50" cy="50" r="3" class="wc-dot"/>
      </svg>
      <p class="wc-city">${c.name}</p>
    </div>`).join("");

  function drawWorldClock() {
    $$("#worldClock .wc").forEach((el) => {
      const d = zoneNow(el.dataset.tz);
      const h = d.getHours(), m = d.getMinutes(), s = d.getSeconds();
      el.classList.toggle("night", h < 6 || h >= 18);
      $(".wc-h", el).setAttribute("transform", `rotate(${(h % 12) * 30 + m * 0.5} 50 50)`);
      $(".wc-m", el).setAttribute("transform", `rotate(${m * 6 + s * 0.1} 50 50)`);
      $(".wc-s", el).setAttribute("transform", `rotate(${s * 6} 50 50)`);
    });
  }

  function renderCalendar(d) {
    $("#calDay").textContent = `${KDAY[d.getDay()]}요일`;
    $("#calDate").textContent = `${d.getMonth() + 1}월 ${d.getDate()}일`;
    const grid = $("#calGrid");
    grid.innerHTML = KDAY.map((k) => `<span class="h">${k}</span>`).join("");
    const first = new Date(d.getFullYear(), d.getMonth(), 1).getDay();
    const days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    grid.insertAdjacentHTML("beforeend", "<span></span>".repeat(first));
    for (let i = 1; i <= days; i++) {
      grid.insertAdjacentHTML("beforeend", i === d.getDate() ? `<span class="today">${i}</span>` : `<span>${i}</span>`);
    }
    $("#dockDay").textContent = KDAY[d.getDay()];
    $("#dockDate").textContent = d.getDate();
  }

  let lastDate = -1;
  function tick() {
    const d = seoulNow();
    const h = d.getHours(), m = d.getMinutes(), s = d.getSeconds();
    const ampm = h < 12 ? "오전" : "오후";
    const h12 = h % 12 || 12;
    $("#mbClock").textContent = `${d.getMonth() + 1}월 ${d.getDate()}일 (${KDAY[d.getDay()]})  ${ampm} ${h12}:${String(m).padStart(2, "0")}`;
    drawWorldClock();
    if (d.getDate() !== lastDate) { lastDate = d.getDate(); renderCalendar(d); }
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- music player (30s preview, links to Spotify) ---------- */
  // preview(음원 파일명)가 있는 곡은 /preview/파일명 (Worker → R2)에서 진짜로 재생하고,
  // 없는 곡은 예전처럼 30초 타이머만 흐른다. 음원을 못 가져와도 타이머로 이어 간다.
  const player = $(".w-player");
  const PREVIEW = 30;
  const audio = new Audio();
  audio.preload = "none";
  let songIdx = 0, elapsed = 0, playing = false, lastT = 0, useAudio = false, raf = 0;

  function loadSong(i) {
    songIdx = (i + PLAYER_SONGS.length) % PLAYER_SONGS.length;
    const s = PLAYER_SONGS[songIdx];
    const img = $("#playerCover img");
    img.classList.remove("missing");
    img.parentElement.classList.remove("ph");
    img.src = s.cover;
    guardImage(img);
    $("#playerTitle").textContent = s.title;
    $("#playerSub").textContent = `${s.ip} · 키글${s.preview ? " · 30초 미리듣기" : ""}`;
    ["#playerCover", "#playerTitle", "#playerSpotify"].forEach((id) => ($(id).href = s.link));
    const yt = isYouTube(s.link);
    $("#playerSpotify").textContent = yt ? "YouTube에서 보기 ↗" : "Spotify에서 듣기 ↗";
    $("#playerSpotify").classList.toggle("is-youtube", yt);
    audio.pause();
    useAudio = !!s.preview;
    if (useAudio) audio.src = `/preview/${encodeURIComponent(s.preview)}`;
    else { audio.removeAttribute("src"); audio.load(); }
    player.classList.toggle("has-audio", useAudio);
    elapsed = 0;
    drawProgress();
    if (playing) play(); // 재생 중에 곡을 넘기면 다음 곡도 바로 이어서
  }
  function drawProgress() {
    const e = Math.min(elapsed, PREVIEW);
    $("#playerFill").style.width = `${(e / PREVIEW) * 100}%`;
    const fmt = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
    $("#playerCur").textContent = fmt(e);
    $("#playerLeft").textContent = `-${fmt(PREVIEW - e)}`;
  }
  function play() {
    lastT = performance.now();
    if (useAudio) audio.play().catch(() => {}); // 자동재생 차단 등은 조용히 넘기고 타이머가 돈다
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
  }
  function loop(t) {
    if (!playing) return;
    if (useAudio) elapsed = audio.currentTime;
    else elapsed += (t - lastT) / 1000;
    lastT = t;
    if (elapsed >= PREVIEW) { loadSong(songIdx + 1); return; } // loadSong → play 가 루프를 다시 건다
    drawProgress();
    raf = requestAnimationFrame(loop);
  }
  audio.addEventListener("ended", () => { if (playing) loadSong(songIdx + 1); });
  audio.addEventListener("error", () => { useAudio = false; lastT = performance.now(); player.classList.remove("has-audio"); });
  $("#playerPlay").addEventListener("click", () => {
    playing = !playing;
    player.classList.toggle("playing", playing);
    $("#playerPlay").setAttribute("aria-label", playing ? "일시정지" : "재생");
    if (playing) play();
    else { audio.pause(); cancelAnimationFrame(raf); }
  });
  $("#playerNext").addEventListener("click", () => loadSong(songIdx + 1));
  $("#playerPrev").addEventListener("click", () => loadSong(songIdx - 1));
  loadSong(0);

  /* ---------- today's language: random song, then KR → EN → JA → PT ---------- */
  const LANGS = ["KR", "EN", "JA", "PT"];
  const HTML_LANG = { KR: "ko", EN: "en", JA: "ja", PT: "pt" };
  const langLine = $("#langLine");
  let songPick = -1, langIdx = 0, langTimer;

  function pickSong() {
    // a different song from the one just shown
    let next;
    do { next = Math.floor(Math.random() * LYRIC_SONGS.length); }
    while (LYRIC_SONGS.length > 1 && next === songPick);
    songPick = next;
  }
  function showLang(i, animate = true) {
    langIdx = i;
    const apply = () => {
      const song = LYRIC_SONGS[songPick], code = LANGS[langIdx];
      langLine.textContent = song.lines[code];
      langLine.lang = HTML_LANG[code];
      $("#langSong").textContent = `〈${song.title}〉`;
      $$("#langTabs button").forEach((b, j) => b.classList.toggle("on", j === langIdx));
      langLine.classList.remove("out");
    };
    if (!animate) return apply();
    langLine.classList.add("out");
    setTimeout(apply, 320);
  }
  function advance() {
    if (langIdx === LANGS.length - 1) { pickSong(); showLang(0); }
    else showLang(langIdx + 1);
  }
  function startLang() { clearInterval(langTimer); langTimer = setInterval(advance, 3200); }
  $$("#langTabs button").forEach((b) => b.addEventListener("click", () => { showLang(+b.dataset.i); startLang(); }));
  pickSong();
  showLang(0, false);
  startLang();

  /* ---------- tools ---------- */
  const TOOL_ICON = {
    sheets: `<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2" fill="#fff"/><path d="M8 9h8M8 12.5h8M8 16h8M12 9v7" stroke="#0f9d58" stroke-width="1.6"/></svg>`,
    docs: `<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2" fill="#fff"/><path d="M8 8.5h8M8 11.5h8M8 14.5h8M8 17.5h5" stroke="#2f6fe0" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    claude: `<svg viewBox="0 0 24 24"><g stroke="#fff" stroke-width="2.3" stroke-linecap="round"><path d="M12 3.5v17M3.5 12h17M6 6l12 12M18 6 6 18"/></g></svg>`,
    chatgpt: `<svg viewBox="0 0 24 24"><g fill="none" stroke="#fff" stroke-width="1.7"><ellipse cx="12" cy="12" rx="8" ry="3.6"/><ellipse cx="12" cy="12" rx="8" ry="3.6" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="8" ry="3.6" transform="rotate(120 12 12)"/></g></svg>`,
    gemini: `<svg viewBox="0 0 24 24"><defs><linearGradient id="gg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4f8df7"/><stop offset=".55" stop-color="#9b72f2"/><stop offset="1" stop-color="#e26b9a"/></linearGradient></defs><path d="M12 2c.7 5.3 4.7 9.3 10 10-5.3.7-9.3 4.7-10 10-.7-5.3-4.7-9.3-10-10 5.3-.7 9.3-4.7 10-10Z" fill="url(#gg)"/></svg>`,
    suno: `<svg viewBox="0 0 24 24"><g fill="#111"><rect x="4" y="9" width="2.4" height="6" rx="1.2"/><rect x="8.2" y="6" width="2.4" height="12" rx="1.2"/><rect x="12.4" y="3.5" width="2.4" height="17" rx="1.2"/><rect x="16.6" y="7.5" width="2.4" height="9" rx="1.2"/></g></svg>`,
    audimee: `<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3" fill="#fff"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>`,
    elevenlabs: `<svg viewBox="0 0 24 24"><rect x="7.5" y="4" width="3" height="16" rx="1" fill="#111"/><rect x="13.5" y="4" width="3" height="16" rx="1" fill="#111"/></svg>`,
  };
  $("#toolsGrid").innerHTML = TOOLS.map(
    (t) => `<a class="tool t-${t.key}" ${t.url ? `href="${t.url}" target="_blank" rel="noopener noreferrer"` : ""} data-tip="${t.name}" aria-label="${t.name}" draggable="false">${TOOL_ICON[t.key] || `<span class="tool-letter">${t.name[0]}</span>`}</a>`
  ).join("");

  /* ---------- desktop folders ---------- */
  const folderBox = $("#folders");
  FOLDERS.filter((f) => !f.hidden).forEach((f, i) => {
    const el = document.createElement("button");
    el.className = "widget folder";
    el.dataset.open = f.id;
    el.dataset.hint = "폴더를 누르면 세부 업무를 알 수 있어요.";
    el.setAttribute("aria-label", `${f.name} — 폴더를 누르면 세부 업무를 알 수 있어요.`);
    // two columns, numbered left→right then top→bottom (01 02 / 03 04 / 05 06)
    const row = Math.floor(i / 2), col = 1 - (i % 2);
    el.style.top = `calc(64px + ${row} * min(108px, 13vh))`;
    el.style.right = `calc(2.5% + ${col * 96}px)`;
    el.innerHTML = `<img class="folder-icon" src="assets/folder.png" alt="" draggable="false"><span class="folder-name">${f.name}</span>`;
    const img = $("img", el);
    img.addEventListener("error", () => img.replaceWith(Object.assign(document.createElement("span"), { className: "folder-icon-css" })), { once: true });
    folderBox.appendChild(el);
  });

  /* ---------- widget intro (staggered) ---------- */
  const widgets = $$(".desktop .widget");
  const order = [".w-clock", ".w-lang", ".w-cal", ".w-photo", ".w-player", ".folder", ".w-tools"];
  const sorted = order.flatMap((sel) => widgets.filter((w) => w.matches(sel)));
  sorted.forEach((w, i) => {
    w.style.setProperty("--d", `${420 + i * 70}ms`);
    w.classList.add("in");
    w.addEventListener("animationend", () => { w.classList.remove("in"); w.classList.add("settled"); }, { once: true });
  });

  /* ---------- draggable widgets ---------- */
  let zTop = 30;
  widgets.forEach((w) => {
    let start = null, moved = false;
    w.addEventListener("pointerdown", (e) => {
      if (isMobile() || e.button !== 0) return;
      if (e.target.closest(".pc-btn, .pc-spotify, .lang-tabs button")) return;
      const desk = $("#desktop").getBoundingClientRect();
      const r = w.getBoundingClientRect();
      start = { x: e.clientX, y: e.clientY, left: r.left - desk.left, top: r.top - desk.top };
      moved = false;
    });
    window.addEventListener("pointermove", (e) => {
      if (!start) return;
      const dx = e.clientX - start.x, dy = e.clientY - start.y;
      if (!moved && Math.hypot(dx, dy) < 4) return;
      if (!moved) {
        moved = true;
        w.userMoved = true;
        w.classList.remove("collide-hidden");
        w.classList.add("dragging", "settled");
        w.classList.remove("in");
        w.style.zIndex = ++zTop;
        w.style.right = "auto"; w.style.bottom = "auto";
        try { w.setPointerCapture(e.pointerId); } catch (_) {}
      }
      w.style.left = `${start.left + dx}px`;
      w.style.top = `${start.top + dy}px`;
    });
    window.addEventListener("pointerup", () => {
      if (!start) return;
      start = null;
      w.classList.remove("dragging");
      if (moved) {
        // the click that follows a drag must not open the folder
        w.justDragged = true;
        setTimeout(() => { w.justDragged = false; moved = false; }, 0);
      }
    });
    w.addEventListener("click", (ev) => {
      if (w.justDragged) { ev.preventDefault(); ev.stopImmediatePropagation(); }
    }, true);
    w.addEventListener("dragstart", (e) => e.preventDefault());
  });

  /* ---------- reveal on scroll ---------- */
  let ioFired = false;
  const io = new IntersectionObserver(
    (entries) => {
      ioFired = true;
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );
  // safety nets for hosts that pause animations or never report intersections
  setTimeout(() => {
    document.documentElement.classList.add("anim-safe");
    if (!ioFired) document.documentElement.classList.add("reveal-safe");
  }, 3000);
  function observeGroup(items, step = 70) {
    items.forEach((el, i) => {
      el.classList.add("reveal");
      el.style.transitionDelay = `${(i % 4) * step}ms`;
      io.observe(el);
    });
  }
  $$(".reveal").forEach((el) => io.observe(el));
  observeGroup($$(".ach-item"), 80);

  /* ---------- people marquee ---------- */
  const avatarColors = ["#57A4F0", "#f0386b", "#8231E8", "#28b44a", "#f5a524", "#0ea5a5", "#e86a33", "#5b6cf0"];
  const cards = PEOPLE.map((p, i) => `
    <div class="p-card">
      <div>
        <div class="p-head"><span class="p-avatar" style="background:${avatarColors[i % avatarColors.length]}">${p.who[0]}</span><span class="p-kind">${p.kind}</span></div>
        <p class="p-who">${p.who}</p>
        <p class="p-line">${p.line}</p>
      </div>
    </div>`).join("");
  $("#marquee").innerHTML = cards + cards;
  $$("#marquee .p-card").slice(PEOPLE.length).forEach((c) => c.setAttribute("aria-hidden", "true"));

  /* ---------- songs grid ---------- */
  // 카드의 썸네일·제목은 YouTube 링크, 아래 줄의 하트는 따로 눌린다(링크 밖).
  const ipClass = { "코코비": "ip-cocobi", "베베바나": "ip-bebebana", "도라큐라": "ip-doracula" };
  const songId = (s) => (s.link.match(/[?&]v=([\w-]{6,})/) || [])[1] || s.title.replace(/\s+/g, "-");
  const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.1C1.3 7.9 3.5 4.5 7 4.5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.5 0 5.7 3.4 4.3 6.9-1.8 4.5-9.3 9.1-9.3 9.1z"/></svg>';
  $("#songGrid").innerHTML = SONGS.map((s) => `
    <article class="song">
      <a class="song-link" href="${s.link}" target="_blank" rel="noopener noreferrer">
        <div class="song-cover"><img src="${s.cover}" alt="${s.title} 썸네일" loading="lazy" data-fallback="cover">
          <span class="song-play${isYouTube(s.link) ? " is-youtube" : ""}" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 4.5v15L19.5 12z"/></svg></span></div>
        <div class="song-meta"><p class="song-title">${s.title}</p>${s.year ? `<span class="song-year">${s.year}</span>` : ""}</div>
      </a>
      <div class="song-foot">
        <span class="ip-chip ${ipClass[s.ip] || ""}">${s.ip}</span>
        <button class="heart" type="button" data-id="${songId(s)}" data-n="0" aria-pressed="false" aria-label="${s.title} 하트">${HEART}<span class="heart-n">0</span></button>
      </div>
    </article>`).join("");
  $$("#songGrid img").forEach(guardImage);
  observeGroup($$(".song"), 80);

  /* ---------- hearts: 숫자는 D1(/api/likes)에 모두 공유, 내가 누른 곡은 이 브라우저가 기억 ---------- */
  const LIKED_KEY = "likedSongs";
  let liked = new Set();
  try { liked = new Set(JSON.parse(localStorage.getItem(LIKED_KEY) || "[]")); } catch {}
  const saveLiked = () => { try { localStorage.setItem(LIKED_KEY, JSON.stringify([...liked])); } catch {} };
  const fmtN = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n));
  const setCount = (b, n) => { b.dataset.n = n; b.querySelector(".heart-n").textContent = fmtN(n); };
  const hearts = $$("#songGrid .heart");
  hearts.forEach((b) => b.setAttribute("aria-pressed", String(liked.has(b.dataset.id))));

  fetch("/api/likes", { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((counts) => hearts.forEach((b) => setCount(b, counts[b.dataset.id] || 0)))
    .catch(() => $("#songGrid").classList.add("no-likes")); // API가 없는 곳(Vercel 등)에선 하트를 숨긴다

  $("#songGrid").addEventListener("click", async (e) => {
    const b = e.target.closest(".heart");
    if (!b || b.disabled) return;
    const id = b.dataset.id, was = b.getAttribute("aria-pressed") === "true", prev = Number(b.dataset.n);
    const delta = was ? -1 : 1;
    // 먼저 화면을 바꾸고(바로 반응), 서버가 실패하면 되돌린다
    b.setAttribute("aria-pressed", String(!was));
    setCount(b, Math.max(0, prev + delta));
    if (!was) { b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop"); }
    was ? liked.delete(id) : liked.add(id);
    saveLiked();
    b.disabled = true;
    try {
      const r = await fetch(`/api/likes/${encodeURIComponent(id)}`, {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ delta }),
      });
      if (!r.ok) throw new Error(r.status);
      setCount(b, (await r.json()).count);
    } catch {
      b.setAttribute("aria-pressed", String(was));
      setCount(b, prev);
      was ? liked.add(id) : liked.delete(id);
      saveLiked();
    } finally {
      b.disabled = false;
    }
  });

  /* ---------- AI MAP ---------- */
  const mapItems = (arr) => arr.map((x, i) => `<li><b>${String(i + 1).padStart(2, "0")}</b><div><p class="am-t">${x.t}</p><p class="am-d">${x.d}</p></div></li>`).join("");
  if (AI_MAP) {
    $("#aimapAi").innerHTML = mapItems(AI_MAP.ai);
    $("#aimapHuman").innerHTML = mapItems(AI_MAP.human);
    if (AI_MAP.aiRole) $("#aimapAiRole").textContent = AI_MAP.aiRole;
    if (AI_MAP.humanRole) $("#aimapHumanRole").textContent = AI_MAP.humanRole;
  }

  /* ---------- anchors into the sticky folder stack ---------- */
  // A sticky folder's on-screen spot depends on the scroll position, so a plain #songs jump
  // from further down lands on the last folder (AI MAP). Scroll to each folder's real place instead.
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented) return;
    const target = document.getElementById(a.getAttribute("href").slice(1));
    if (!target || !target.classList.contains("pillar")) return;
    if (getComputedStyle(target).position !== "sticky") return; // mobile: normal flow, default jump is fine
    e.preventDefault();
    const stack = target.parentElement;
    let y = stack.getBoundingClientRect().top + scrollY + parseFloat(getComputedStyle(stack).paddingTop || 0);
    for (const p of stack.children) { if (p === target) break; y += p.offsetHeight; }
    y -= parseFloat(getComputedStyle(target).top) || 0;
    window.scrollTo({ top: Math.max(0, y), behavior: reduceMotion ? "auto" : "smooth" });
    history.replaceState(null, "", a.getAttribute("href"));
  });

  /* ---------- about: the future ---------- */
  $("#futureBtn").addEventListener("click", (e) => {
    const open = $("#futureBody").classList.toggle("open");
    e.currentTarget.setAttribute("aria-expanded", open);
  });

  /* ---------- folder window ---------- */
  const layer = $("#winLayer"), win = $("#win");
  let lastFocus = null, activeFolderEl = null;

  function renderFolder(f) {
    const list = (arr) => `<ul class="wb-list">${arr.map((x) => `<li>${x}</li>`).join("")}</ul>`;
    const tags = (arr) => `<div class="wb-tags">${arr.map((x) => `<span class="wb-tag">${x}</span>`).join("")}</div>`;
    const flow = `<ol class="wb-steps">${f.flow.map((s, i) => `<li><b>${String(i + 1).padStart(2, "0")}</b><span>${s}</span></li>`).join("")}</ol>`;
    const outputs = (arr) => `<ul class="wb-list wb-out">${arr.map((o) => typeof o === "string" ? `<li>${o}</li>`
      : `<li><b>${o.t}</b>${o.d ? `<span>${o.d}</span>` : ""}</li>`).join("")}</ul>`;
    const good = (g) => Array.isArray(g) ? `<ul class="wb-good-list">${g.map((x) => `<li>${x}</li>`).join("")}</ul>` : `<p>${g}</p>`;
    return `
      <p class="wb-path">업무 / ${f.name}</p>
      <p class="wb-summary">${f.summary}</p>
      ${f.image ? `<div class="wb-img"><img src="${f.image}" alt="" data-fallback="cover"></div>` : ""}
      <div class="wb-grid">
        <div class="wb-sec full"><p class="wb-k">왜 하나요?</p><p class="wb-p">${f.why}</p></div>
        <div class="wb-sec full"><p class="wb-k">진행 흐름</p>${flow}</div>
        <div class="wb-sec"><p class="wb-k">결과물</p>${outputs(f.output)}</div>
        <div class="wb-sec"><p class="wb-k">함께하는 사람</p>${list(f.people)}</div>
        ${f.good ? `<div class="wb-sec full"><p class="wb-k">완성 기준</p><div class="wb-good">${good(f.good)}</div></div>` : ""}
        <div class="wb-sec full"><p class="wb-k">쓰는 도구</p>${tags(f.tools)}</div>
      </div>`;
  }

  function openFolder(id, origin) {
    const f = FOLDERS.find((x) => x.id === id);
    if (!f) return;
    lastFocus = document.activeElement;
    $("#winTitle").textContent = f.name;
    $("#winBody").innerHTML = renderFolder(f);
    $$("#winBody img[data-fallback]").forEach(guardImage);
    $("#winBody").scrollTop = 0;

    // grow the window out of whatever was clicked
    win.style.transition = "none";
    win.style.transformOrigin = "50% 50%";
    if (origin) {
      const r = origin.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const wx = (innerWidth - win.offsetWidth) / 2, wy = (innerHeight - win.offsetHeight) / 2;
      win.style.transformOrigin = `${cx - wx}px ${cy - wy}px`;
    }
    void win.offsetWidth;
    win.style.transition = "";
    layer.classList.add("open");
    layer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    $$(".folder").forEach((el) => el.classList.toggle("active", el.dataset.open === id));
    activeFolderEl = origin;
    if (id === "labtool") $("#labLink").classList.add("open");
    setTimeout(() => $("#winClose").focus({ preventScroll: true }), 50);
  }

  function closeFolder() {
    if (!layer.classList.contains("open")) return;
    layer.classList.remove("open");
    layer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    $$(".folder").forEach((el) => el.classList.remove("active"));
    $("#labLink").classList.remove("open");
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-open]");
    if (t) { e.preventDefault(); openFolder(t.dataset.open, t); }
  });
  // 카드처럼 버튼이 아닌 [data-open] 요소도 키보드(Enter·Space)로 열 수 있게
  document.addEventListener("keydown", (e) => {
    const t = e.target.closest && e.target.closest('[data-open][role="button"]');
    if (t && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openFolder(t.dataset.open, t); }
  });
  $("#winClose").addEventListener("click", closeFolder);
  layer.addEventListener("click", (e) => { if (e.target === layer) closeFolder(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeFolder(); });

  if (reduceMotion) widgets.forEach((w) => w.classList.add("settled"));

  /* ---------- keep the headline clear of widgets at any window size ---------- */
  // 1) shrink the headline a little; 2) if that is not enough, hide the widgets that
  // would still cover it. Widgets the visitor dragged themselves are left alone.
  const heroH1 = $(".hero-copy h1");
  const MIN_HERO_FS = 34;
  // the real line boxes of the text (an inline-block's own box can be much wider than its words)
  function textLineRects(el) {
    const rects = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    while (walker.nextNode()) {
      if (!walker.currentNode.textContent.trim()) continue;
      range.selectNodeContents(walker.currentNode);
      rects.push(...[...range.getClientRects()].filter((r) => r.width > 0));
    }
    return rects;
  }
  function overlappingWidgets() {
    const pad = 14;
    const texts = [
      ...textLineRects($(".hero-copy h1")),
      ...textLineRects($(".hero-sub")),
      ...$$(".ask-chip").map((el) => el.getBoundingClientRect()),
    ];
    return widgets.filter((w) => {
      if (w.userMoved || w.classList.contains("collide-hidden")) return false;
      const r = w.getBoundingClientRect();
      return texts.some((t) => r.left < t.right + pad && r.right > t.left - pad &&
                               r.top < t.bottom + pad && r.bottom > t.top - pad);
    });
  }
  function fitHero() {
    widgets.forEach((w) => w.classList.remove("collide-hidden"));
    heroH1.style.fontSize = "";
    if (isMobile()) return;
    let size = parseFloat(getComputedStyle(heroH1).fontSize);
    while (overlappingWidgets().length && size > MIN_HERO_FS) {
      size = Math.max(MIN_HERO_FS, size - 2);
      heroH1.style.fontSize = `${size}px`;
    }
    overlappingWidgets().forEach((w) => w.classList.add("collide-hidden"));
  }
  let fitTimer;
  window.addEventListener("resize", () => { clearTimeout(fitTimer); fitTimer = setTimeout(fitHero, 120); });
  fitHero();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitHero);
  setTimeout(fitHero, 2600); // again once the intro animation has settled
})();
