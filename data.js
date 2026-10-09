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
    "키글(Kigle)에서 동요 음원 기획과 다국어(KR·EN·JA·PT) 콘텐츠를 맡고 있는 김윤선에 대해 알려 줘. " +
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

// 내가 쓰는 도구 (아이콘은 CSS로 그려요)
window.TOOLS = [
  { name: "Google Sheets", key: "sheets" },
  { name: "Google Docs",   key: "docs" },
  { name: "Claude",        key: "claude" },
  { name: "ChatGPT",       key: "chatgpt" },
  { name: "Gemini",        key: "gemini" },
  { name: "Suno",          key: "suno" },
  { name: "Audimee",       key: "audimee" },
  { name: "ElevenLabs",    key: "elevenlabs" },
];

// 함께 일하는 사람들 (마키 카드)
window.PEOPLE = [
  { who: "애니메이션팀", kind: "사내 팀", line: "동요 영상의 기획 의도를 공유해요. MD 홍보 콘텐츠를 함께 만들어요" },
  { who: "뉴미디어팀",   kind: "사내 팀", line: "유튜브 채널에 올라갈 음원과 언어별 제목 · 설명을 함께 준비해요. 언어별 자막과 영상을 검수해요" },
  { who: "앱기획팀",     kind: "사내 팀", line: "앱 나레이션 스크립트와 앱 소개글 등을 다국어로 현지화해요" },
  { who: "앱사업팀",     kind: "사내 팀", line: "앱 출시 일정에 맞춰 다국어 콘텐츠 번역을 확인해요. 아마존 마케팅을 서포트해요" },
  { who: "앱디자인팀",   kind: "사내 팀", line: "언어마다 달라지는 앱 타이틀 텍스트를 확인해요" },
  { who: "개발팀",       kind: "사내 팀", line: "다국어 텍스트와 음성 파일을 전달하고, 앱 반영을 확인해요" },
  { who: "경영지원팀",   kind: "사내 팀", line: "파트너 계약과 비용 정산을 함께 챙겨요. 지원사업 준비 및 상표권 관리 등을 함께해요" },
  { who: "음원 유통사",  kind: "파트너",  line: "음반 발매 일정을 조율하고, 음원 메타데이터를 관리하여 원활한 발매를 도와요. 저작권 및 판매 데이터를 전달받아 기록해요" },
  { who: "녹음 스튜디오", kind: "파트너", line: "녹음 일정을 잡고, 디렉션부터 믹스 검수까지 진행해요" },
];

// 업무 폴더 → 창으로 열리는 상세
// 틀: 한 줄 요약 / 왜 하는가 / 진행 흐름 / 결과물 / 함께하는 사람 / 잘했다는 기준 / 쓰는 도구
window.FOLDERS = [
  {
    id: "planning", name: "음원 기획·작사",
    summary: "IP의 세계관에 맞춰 아이 눈높이의 노래를 기획하고 가사를 써요.",
    why: "노래는 아이가 캐릭터를 처음 만나는 가장 짧은 길이라서요. 한 곡이 영상과 숏폼까지 이어지는 출발점이 돼요.",
    flow: ["주제와 타깃 연령 정하기", "레퍼런스와 분위기 정리", "가사 초안 (AI와 브레인스토밍)", "작곡·편곡 협의", "가이드 녹음", "최종 확정"],
    output: ["곡 기획서", "가사 (KR / EN)", "숏폼 스토리 콘티"],
    people: ["애니메이션팀", "뉴미디어팀", "앱기획팀"],
    good: "아이가 한 번 듣고 따라 부를 수 있을 것. 영상팀이 가사만 보고도 장면을 떠올릴 수 있을 것.",
    tools: ["Google Docs", "Claude", "ChatGPT", "Suno"],
  },
  {
    id: "localization", name: "다국어 번역·더빙",
    summary: "키글의 모든 콘텐츠를 KR · EN · JA · PT 네 언어로 이어요.",
    why: "같은 노래라도 그 나라 아이 귀에 자연스러워야 진짜 '우리 노래'가 되니까요.",
    flow: ["원문 정리", "번역사 배정", "리듬에 맞춘 가사 번역", "원어민 검수", "성우 캐스팅·더빙", "자막·메타데이터 반영"],
    output: ["언어별 가사·자막", "더빙 음원", "제목·설명 메타데이터"],
    people: ["번역사 파트너", "현지 성우", "앱기획팀", "뉴미디어팀"],
    good: "번역된 노래가 번역처럼 들리지 않을 것.",
    tools: ["Google Sheets", "Google Docs", "Claude", "ChatGPT", "Gemini"],
  },
  {
    id: "recording", name: "녹음·사운드 검수",
    summary: "녹음 디렉션부터 최종 믹스 검수까지 소리를 챙겨요.",
    why: "아이들은 작은 발음 차이와 어색한 숨소리도 금방 알아채요.",
    flow: ["녹음 일정 잡기", "디렉션 가이드 공유", "녹음 참관·원격 디렉션", "테이크 선정", "믹스 검수 피드백", "마스터 확정"],
    output: ["녹음 가이드", "검수 체크리스트", "최종 마스터 음원"],
    people: ["녹음 스튜디오", "성우"],
    good: "다시 녹음할 일이 없도록, 처음부터 정확하게.",
    tools: ["Google Sheets", "Audimee", "ElevenLabs"],
  },
  {
    id: "release", name: "발매·배급",
    summary: "완성된 노래가 플랫폼마다 제때, 올바른 정보로 나가도록 해요.",
    why: "좋은 노래도 찾을 수 없으면 들리지 않으니까요.",
    flow: ["발매 일정 수립", "음원·커버·메타데이터 준비", "유통사 전달", "플랫폼 등록 확인", "발매 후 모니터링"],
    output: ["발매 캘린더", "언어별 메타데이터 시트"],
    people: ["음원 유통사", "뉴미디어팀", "경영지원팀"],
    good: "발매일에 오류 없이, 모든 언어로.",
    tools: ["Google Sheets", "Google Docs"],
  },
  {
    id: "system", name: "관리 시스템",
    summary: "곡과 언어, 파트너가 늘어도 흐트러지지 않는 관리 체계를 만들어요.",
    why: "IP 3개에 언어 4개면 챙길 것이 금방 수백 개가 돼요.",
    flow: ["현황 파악", "시트 구조 설계", "팀과 규칙 합의", "자동화 (번역 검수 도구 등)", "주기적인 정리"],
    output: ["음원 마스터 시트", "번역 검수 자동화 도구", "작업 가이드 문서"],
    people: ["사내 여러 팀"],
    good: "제가 없어도 누구나 찾아볼 수 있을 것.",
    tools: ["Google Sheets", "Claude", "ChatGPT"],
  },
  {
    id: "biz", name: "사업 지원",
    summary: "음원과 언어 쪽 경험으로 사업 제안과 파트너십을 도와요.",
    why: "해외 파트너와 이야기할 때, 콘텐츠를 잘 아는 사람이 옆에 있으면 일이 빨라지니까요.",
    flow: ["요청 받기", "자료 정리·번역", "미팅 지원", "후속 정리"],
    output: ["제안서 번역", "음원 소개 자료", "미팅 노트"],
    people: ["앱사업팀", "해외 파트너"],
    good: "상대가 다시 묻지 않아도 될 만큼 명확하게.",
    tools: ["Google Docs", "Gemini", "ChatGPT"],
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
