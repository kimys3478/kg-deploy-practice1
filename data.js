// ─────────────────────────────────────────────────────────────
//  페이지 내용 데이터. 여기만 고치면 화면이 바뀌어요.
//  (곡 제목·링크는 임시 값이에요. 실제 곡으로 바꿔 주세요.)
// ─────────────────────────────────────────────────────────────

window.SITE = {
  name: "김윤선",
  email: "kim_yoonsun@kiglestudio.com",
  // 캘린더 위젯을 누르면 열리는 미팅 예약 링크 (Calendly, Google 캘린더 예약 페이지 등)
  // 비워 두면 '미팅 요청' 제목으로 메일 쓰기 창이 열려요.
  bookingUrl: "",
  askPrompt:
    "키글(Kigle)에서 동요 음원 기획과 다국어(KR·JA·PT) 번역·더빙을 맡고 있는 김윤선에 대해 알려 줘. " +
    "코코비·베베바나·도라큐라 IP의 음원 기획, 번역·더빙, 녹음 검수, AI 보이스 컨버전과 번역 검수 자동화 도구 제작을 해 왔어. " +
    "이 사람이 하는 일과 일하는 방식을 정리해 줘.",
};

// 오늘의 언어: 직접 기획한 코코비 노래 속 같은 가사 한 줄을 네 언어로.
// 곡은 랜덤으로 골라지고, 한 곡의 네 언어를 다 보여 준 뒤 다른 곡으로 넘어가요.
window.LYRIC_SONGS = [
  {
    title: "일어나, 아침이야",
    lines: { KR: "멋진 하루 될 거야", EN: "Let’s have a great day.", JA: "いい日になるさ。", PT: "Vamos ter um dia bom." },
  },
  {
    title: "내 생일 까먹었어",
    lines: { KR: "행복한 오늘 하루 내가 주인공!", EN: "This will be a happy day. I will be the star!", JA: "今日は私が主人公！", PT: "Hoje será um dia feliz. Eu serei a estrela!" },
  },
  {
    title: "슈퍼 히어로 파워",
    lines: { KR: "함께라면 우린 최고야!", EN: "We are stronger together!", JA: "一緒にいれば さいきょうさ！", PT: "Somos mais fortes juntos!" },
  },
  {
    title: "놀이터 예절송",
    lines: { KR: "같이 노니까 더 재밌어!", EN: "It’s so much fun when we’re playing together!", JA: "一緒に遊ぶともっと楽しい！", PT: "É legal quando brincamos juntos!" },
  },
];

// 내가 기획한 노래들 (썸네일 = assets/cover-XX.jpg)
// 노래 아카이브 (썸네일 = assets/yt-영상ID.jpg, 유튜브 썸네일을 받아 둔 파일)
const yt = (id) => ({ cover: `assets/yt-${id}.jpg`, link: `https://www.youtube.com/watch?v=${id}` });
window.SONGS = [
  { title: "로봇 엄마 vs 진짜 엄마",   ip: "코코비",   year: "", ...yt("9a841b3Bt3Q") },
  { title: "엄마는 뱀파이어?",         ip: "코코비",   year: "", ...yt("t_TZ2rq3_Wg") },
  { title: "내 친구는 슈퍼히어로",      ip: "코코비",   year: "", ...yt("8HZwnxEI4fs") },
  { title: "뚱뚱 아빠 vs 날씬 아빠",   ip: "코코비",   year: "", ...yt("45-ZgWr5E20") },
  { title: "배꼽 댄스송",              ip: "베베바나", year: "", ...yt("AI699nW3fNA") },
  { title: "나는 아기 의사",           ip: "베베바나", year: "", ...yt("RvyqcGo5jfQ") },
];

// 첫 화면 노래 듣기 위젯: 헬로 코코비(스포티파이)부터, 다음 곡은 아카이브 노래들
window.PLAYER_SONGS = [
  { title: "헬로 코코비", ip: "코코비", cover: "assets/cover-hello-cocobi.webp", link: "https://open.spotify.com/track/2twn7E9Pa7rElQI4Q8pqmF" },
  ...window.SONGS,
];

// 내가 쓰는 도구 (아이콘은 CSS로 그려요, 누르면 각 서비스 사이트가 새 탭으로 열려요)
window.TOOLS = [
  { name: "Google Sheets", key: "sheets", url: "https://workspace.google.com/products/sheets/" },
  { name: "Google Docs",   key: "docs", url: "https://workspace.google.com/products/docs/" },
  { name: "Claude",        key: "claude", url: "https://claude.ai/" },
  { name: "ChatGPT",       key: "chatgpt", url: "https://chatgpt.com/" },
  { name: "Gemini",        key: "gemini", url: "https://gemini.google.com/" },
  { name: "Suno",          key: "suno", url: "https://suno.com/" },
  { name: "Audimee",       key: "audimee", url: "https://www.audimee.com/" },
  { name: "ElevenLabs",    key: "elevenlabs", url: "https://elevenlabs.io/" },
];

// 함께 일하는 사람들 (마키 카드) · kind: IN-HOUSE(사내) / PARTNER(외부)
window.PEOPLE = [
  { who: "사운드 파트",   kind: "IN-HOUSE", line: "동요 음원 업무 전반" },
  { who: "애니메이션팀",  kind: "IN-HOUSE", line: "동요 기획 의도 공유, MD 홍보 콘텐츠 기획" },
  { who: "뉴미디어팀",    kind: "IN-HOUSE", line: "다국어 배급, 메타데이터, 자막 검수" },
  { who: "앱기획팀",      kind: "IN-HOUSE", line: "앱 나레이션 번역·더빙, 다국어 QA" },
  { who: "앱디자인팀",    kind: "IN-HOUSE", line: "앨범 커버 디자인" },
  { who: "경영지원팀",    kind: "IN-HOUSE", line: "IP 상표권 관리, 지원사업 지원" },
  { who: "MD 파트",       kind: "IN-HOUSE", line: "국내외 스토어 운영, 상세 페이지 기획" },
  { who: "번역사·성우",   kind: "PARTNER",  line: "언어별 번역과 노래·나레이션 녹음" },
  { who: "녹음 스튜디오", kind: "PARTNER",  line: "녹음·디렉션·믹스 검수" },
  { who: "유통사",        kind: "PARTNER",  line: "음원 발매, 판매 정산" },
];

// 업무 폴더 → 창으로 열리는 상세
// 틀: 한 줄 소개 / 왜 하나요? / 진행 흐름 / 결과물 { t: 이름, d: 설명 } / 함께하는 사람 / 이걸 보면 잘한 거예요 / 쓰는 도구
window.FOLDERS = [
  {
    id: "planning", name: "01. 음원 기획·작사",
    summary: "전 세계 아이들이 따라 부를 노래의 소재와 가사, 그리고 그 노래로 만들 영상 이야기를 함께 설계해요.",
    why: "타깃에 꼭 맞는 히트곡으로 서비스를 넓히기 위해서예요.",
    flow: [
      "아이들이 좋아할 주제와 소재를 모아요.",
      "소재 회의에서 방향을 정해요.",
      "가사와 영상 이야기를 함께 써요.",
      "가사 회의에서 다듬어 확정해요.",
      "번역과 녹음의 기준이 될 가이드를 직접 녹음해요.",
    ],
    output: [
      { t: "소재 문서", d: "후보 소재와 고른 이유" },
      { t: "가사 문서", d: "가사, 영상 스토리, 캐릭터 설정, 연출 메모" },
      { t: "가이드 음원", d: "모든 언어 작업의 기준" },
    ],
    people: ["글로벌팀", "뉴미디어팀", "애니메이션팀"],
    good: ["따라 부르기 쉽고 내용이 재미있어요.", "여러 문화권에서도 이해하기 쉬워요.", "유튜브 조회수 · 음원 판매량이 높아요."],
    tools: ["Google Docs", "Google Sheets", "Claude", "ChatGPT", "Gemini", "Suno"],
  },
  {
    id: "localization", name: "02. 다국어 번역·더빙",
    summary: "키글에서 나오는 노래, 앱, 문서가 다국어로 자연스럽게 들리고 읽히도록 만들어요.",
    why: "KR · JA · PT 세 개 언어를 담당 지원하고 글로벌 플랫폼으로 넓혀 가기 위해서예요.",
    flow: [
      "기준이 되는 가사(KR · EN)를 준비해요.",
      "묶음 단위로 언어별 번역을 의뢰해요.",
      "뜻·문법·반복·어휘·음절 수·표기를 검수해요.",
      "번역사와 피드백을 주고받아 확정해요.",
      "곡 순서대로 합쳐 녹음 문서를 만들어요.",
    ],
    output: [{ t: "번역 문서" }, { t: "녹음 문서" }, { t: "앱 나레이션 시트" }],
    people: ["글로벌팀", "앱기획팀", "업무지원파트", "외주 번역사", "다국어 성우"],
    good: ["가사가 멜로디에 자연스럽게 얹혀요.", "언어가 바뀌어도 캐릭터 성격이 유지돼요.", "아이 눈높이의 쉬운 말이에요."],
    tools: ["Google Docs", "Google Sheets", "Claude", "ChatGPT", "Gemini"],
  },
  {
    id: "recording", name: "03. 녹음·사운드 검수",
    summary: "번역된 가사가 실제 목소리와 노래가 되는 과정을 이끌고, 완성된 음원을 귀로 꼼꼼히 확인해요.",
    why: "빠르게 만들면서도 상업적으로 손색없는 음원 품질을 지키기 위해서예요.",
    flow: [
      "녹음 문서를 준비하고, 언어별 성우·스튜디오 일정을 맞춰요.",
      "녹음 현장에서 발음·감정·캐릭터 톤을 디렉팅해요.",
      "AI 보이스 컨버전으로 캐릭터 목소리를 통일해요. (베베바나)",
      "완성 음원 AR의 가사와 믹싱을 검수해요.",
      "확정 음원을 관련 팀에 넘겨요.",
    ],
    output: [
      { t: "언어별 AR", d: "KR·JA·PT 완성 음원" },
      { t: "녹음·믹싱 피드백", d: "스튜디오 수정 요청" },
      { t: "외주 비용 기록", d: "번역사·성우·스튜디오 비용" },
    ],
    people: ["글로벌팀", "외주 성우", "녹음 스튜디오"],
    good: ["발매 스케줄에 맞춰 음원을 준비해요.", "가사가 정확하고 발음이 또렷해요.", "믹싱에 거슬리는 부분이 없어요."],
    tools: ["Audimee", "ElevenLabs", "Google Sheets", "Google Docs"],
  },
  {
    id: "release", name: "04. 발매·배급",
    summary: "완성된 노래와 영상이 국내외 음원 플랫폼과 해외 영상 플랫폼에 빠짐없이 나가도록 준비하고 관리해요.",
    why: "글로벌 음원·영상 플랫폼을 넓히기 위해서예요.",
    flow: [
      "곡을 앨범으로 묶고 커버 제작을 함께해요.",
      "유통사와 발매일을 조율해요.",
      "음원과 메타데이터를 업로드해요.",
      "플랫폼 반영을 확인하고 링크를 정리해요.",
      "언어별 자막과 해외 영상 배급을 검수해요.",
    ],
    output: [
      { t: "앨범", d: "국내외 음원 플랫폼 발매" },
      { t: "발매 링크 시트", d: "플랫폼별 링크 모음" },
      { t: "언어별 자막 문서", d: "가사와 대사의 순서표" },
    ],
    people: ["애니메이션팀", "뉴미디어팀", "앱디자인팀", "음원 유통사"],
    good: ["정확한 정보로 빠짐없이 발매돼요.", "자막과 노래의 싱크가 맞아요.", "신규 IP가 글로벌 플랫폼에 자리 잡아요."],
    tools: ["Google Sheets", "Google Docs", "유통사 플랫폼"],
  },
  {
    id: "system", name: "05. 관리 시스템",
    summary: "여러 IP, 언어, 파트너가 얽힌 일을 놓치지 않도록 시트와 폴더를 정리해요.",
    why: "누가 봐도 최신 파일을 바로 찾고, 같은 일을 두 번 하지 않기 위해서예요.",
    flow: [
      "다국어 문서들을 관리해요.",
      "음원·멀티파일과 폴더 체계를 정리해요.",
      "반복되는 검수와 변환을 자동화해요.",
    ],
    output: [
      { t: "종합 관리 시트", d: "번역·더빙·가사·자막 현황" },
      { t: "파일 체계", d: "음원·멀티파일 백업과 폴더" },
      { t: "가사 도구", d: "번역 검수와 문서 변환 자동화" },
    ],
    people: ["글로벌팀", "외부 파트너"],
    good: ["처음 보는 사람도 파일을 바로 찾아요.", "문서를 옮겨 적는 일이 줄어요."],
    tools: ["Google Sheets", "Google Docs", "Claude"],
  },
  {
    id: "biz", name: "06. 사업 지원",
    summary: "IP 콘텐츠가 사업으로 이어지도록 파트너, 비용, 권리, 스토어 운영을 지원해요.",
    why: "품질은 지키면서 비용은 아끼고, 회사의 재무를 안정적으로 만들기 위해서예요.",
    flow: [
      "번역사·성우·스튜디오 파트너를 확보하고 효율적으로 관리해요.",
      "판매·저작권 수익과 외주 비용을 월말에 정리해요.",
      "글로벌 상표권과 음원 저작권을 관리해요.",
      "정부 지원사업 문서 작성을 도와요.",
      "국내외 스토어와 해외 영상 수익을 지원해요.",
    ],
    output: [
      { t: "월말 정산 자료", d: "판매·저작권·외주 비용" },
      { t: "권리 관리 문서", d: "상표권·저작권 관련 서류" },
      { t: "스토어 운영 자료", d: "상품 페이지와 해외 계정 지원" },
    ],
    people: ["경영지원팀", "글로벌팀", "유통사", "특허법인", "Amazon"],
    good: ["파트너와 비용이 제때 정리돼요.", "권리와 운영 이슈가 누락되지 않아요."],
    tools: ["Google Sheets", "Google Docs"],
  },
  {
    // The Lab: 직접 만든 사내 도구. 내부 링크·시트 구조·곡별 판단 내용은 공개하지 않아요.
    id: "labtool", name: "동요 정보 찾기", hidden: true,
    image: "assets/lab-tool-screen.png", // 실제 웹앱 입력 화면 캡처
    summary: "곡 제목만 넣으면 저작권 이의 제기에 필요한 곡 정보를 한 번에 모아 줘요.",
    why: "유튜브 동요 영상에 저작권 신고가 들어오면 언어별 제목, 발매일, ISRC, 원곡 정보가 필요해요. 이 정보가 여러 시트에 흩어져 있어 곡 하나를 찾는 데도 다소 번거로웠어요.",
    flow: ["곡 제목 입력", "시트별 실시간 조회", "발매일 · ISRC · 튠 정리", "이의 제기 사유 분류", "신청 문구 제안"],
    output: ["사내 웹앱", "사용 · 관리 안내 문서"],
    people: ["뉴미디어팀"],
    tools: ["Google Apps Script", "Google Sheets", "Claude"],
  },
];

// AI MAP: AI가 빠르게, 사람이 정확하게
window.AI_MAP = {
  aiRole: "반복은 줄이고 선택지를 넓히는 역할",
  humanRole: "창의성과 디테일을 책임지는 역할",
  ai: [
    { t: "기획 아이디어 확장", d: "Claude · Gemini" },
    { t: "음원 제작 보조", d: "Suno" },
    { t: "가사 초벌 번역·문서 검수", d: "Claude · Gemini" },
    { t: "캐릭터 보이스 생성·컨버전", d: "ElevenLabs · Audimee" },
    { t: "자료 취합·문서 변환", d: "Claude" },
  ],
  human: [
    { t: "아이 눈높이에 맞는 주제 선택", d: "무엇을 왜 만들지 결정해요." },
    { t: "멜로디와 가사의 최종 판단", d: "음절·리듬·뜻을 함께 들어요." },
    { t: "번역의 문화·캐릭터 검수", d: "언어가 달라도 같은 이야기를 지켜요." },
    { t: "녹음 디렉팅과 AR 검수", d: "발음·감정·믹싱 품질을 책임져요." },
    { t: "파트너 피드백과 최종 승인", d: "완성물의 기준은 사람이 세워요." },
  ],
};
