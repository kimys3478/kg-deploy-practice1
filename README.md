# 김윤선 포트폴리오

키글(Kigle)에서 동요 음원 기획과 다국어(KR · JA · PT) 번역·더빙을 맡고 있는 김윤선의 업무 소개 페이지예요.
빌드 과정이 없는 정적 사이트(HTML · CSS · JS · 이미지)라서, 이 리포를 그대로 Vercel이나 Cloudflare Pages에 연결하면 배포돼요.

## 파일 구성

| 파일 | 역할 | 이럴 때 고쳐요 |
| --- | --- | --- |
| `data.js` | 페이지 텍스트 대부분: 업무 폴더 6개 상세, COLLABORATION 카드, 노래 목록, 플레이어 곡, 오늘의 언어 가사, 도구 아이콘 링크, AI MAP, 메일 주소, "Claude에게 묻기" 질문 | 문구 · 곡 · 링크를 바꿀 때 (대부분 여기만) |
| `index.html` | 페이지 뼈대와 고정 문구: 첫 화면 소개, 업무 6개 카드, 섹션 제목, about-yoonsun.txt, 하단 이름 · 직함 | 섹션 제목, 소개 글, 하단 문구 |
| `styles.css` | 디자인 (색, 글꼴, 배치, 모바일 화면) | 모양을 바꿀 때 |
| `script.js` | 동작 (위젯 드래그, 시계, 플레이어, 폴더 창, 겹쳐 쌓이는 폴더로 이동하는 링크, 마우스 오버 안내) | 동작을 바꿀 때 |
| `assets/` | 이미지 (폴더 아이콘, 앨범 커버, 노래 썸네일, The Lab 화면) | 이미지 교체 |
| `tools/build_share.py` | 위 파일들을 메일로 보내기 좋은 HTML 하나(`dist/김윤선_포트폴리오.html`)로 묶는 스크립트 | 공유용 파일이 필요할 때 |

- 프로필 사진은 `assets/profile.jpg`라는 이름으로 넣으면 첫 화면과 The Lab 카드에 나타나요. (아직 없음)

## 페이지 구성

1. **첫 화면 (데스크톱):** 세계 시계, 미팅 캘린더, 노래 플레이어, 오늘의 언어, 업무 폴더 01~06, 내가 쓰는 도구, 소개 문장과 Claude · ChatGPT에게 묻기 · 메일 버튼
2. **하단 독:** 처음으로 · 업무 · AI MAP · 작업 · 소개 · 연락
3. **이런 일을 하고 있어요:** 업무 6개
4. **COLLABORATION:** 함께 일하는 팀과 파트너 (IN-HOUSE · PARTNER)
5. **겹쳐 쌓이는 폴더:** 노래 아카이브 → The Lab → AI MAP
6. **about-yoonsun.txt:** THEN · NOW · THE FUTURE
7. **하단:** 김윤선 · Content Manager, Global Team

## 로컬에서 보기

```bash
python -m http.server 8765
```

리포 맨 위 폴더에서 실행한 뒤 브라우저로 `http://localhost:8765`를 열어요.

## 배포

- **Vercel:** Add New → Project → 이 리포 Import → Framework Preset "Other", 나머지 그대로 → Deploy. 이후 `main`에 올릴 때마다 자동 재배포.
- **Cloudflare Pages:** Workers & Pages → Create → 이 리포 연결 → 빌드 명령 없음, 출력 폴더 `/` → Deploy.

## 버전 기록

| 버전 | 날짜 | 바꾼 내용 |
| --- | --- | --- |
| 21 | 2026-10-09 | 업무 폴더 상세 창의 "초안이에요" 안내 문구 삭제 |
| 20 | 2026-10-09 | 하단 직함 → Content Manager, Global Team |
| 19 | 2026-10-09 | AI MAP 문구 수정, 하단 "노래 아카이브" 링크가 AI MAP으로 가던 문제 수정, Claude · ChatGPT에게 묻기 · 메일 · 도구 아이콘 링크 연결 |
| 18 | 2026-10-09 | 업무 폴더 01~06 번호와 마우스 오버 안내, 폴더 6개 상세 문구 교체, COLLABORATION, 일하는 방식 섹션을 노래 아카이브 · The Lab · AI MAP 폴더로 교체, about-yoonsun.txt 문구 교체 |
| 17 | 2026-10-09 | 담당 언어 KR · JA · PT로 통일, 업무 흐름 · 결과물 정리, 협업 카드 추가 |
| 16 | 2026-10-08 | 첫 커밋. 위젯 첫 화면, 업무 6개, 일하는 방식 4가지, 노래 아카이브, The Lab |

Made with Claude · © 2026 김윤선
