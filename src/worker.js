// Cloudflare Worker. 정적 파일(index.html 등)은 그대로 두고,
//   /preview/<파일명>  → R2 버킷(portfolio-songs)에서 30초 음원을 꺼내 준다
//   /api/likes         → D1(portfolio-likes)의 노래 카드 하트 수
// wrangler.jsonc의 run_worker_first 때문에 이 두 경로만 이 코드로 들어온다.

const PREVIEW_PREFIX = "/preview/";
const LIKES_PATH = "/api/likes";
const SONG_ID = /^[A-Za-z0-9_-]{1,64}$/; // 유튜브 영상 ID 꼴만 받는다

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith(PREVIEW_PREFIX)) return servePreview(request, env, url);
    if (url.pathname === LIKES_PATH || url.pathname.startsWith(LIKES_PATH + "/")) return serveLikes(request, env, url);
    return env.ASSETS.fetch(request);
  },
};

/* ---------- 하트: GET /api/likes → {id: n}, POST /api/likes/<id> {delta: 1|-1} → {count} ---------- */
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

async function serveLikes(request, env, url) {
  const id = url.pathname.slice(LIKES_PATH.length + 1);

  if (request.method === "GET" && !id) {
    const { results } = await env.LIKES.prepare("SELECT song_id, count FROM likes").all();
    return json(Object.fromEntries(results.map((r) => [r.song_id, r.count])));
  }

  if (request.method === "POST" && id) {
    if (!SONG_ID.test(id)) return json({ error: "bad id" }, 400);
    let delta = 1;
    try { delta = Number((await request.json()).delta); } catch { /* 본문 없으면 +1 */ }
    if (delta !== 1 && delta !== -1) return json({ error: "delta must be 1 or -1" }, 400);
    // 한 문장으로 만들고·더하고·0 아래로는 안 내려가게. RETURNING 으로 결과를 바로 받는다.
    const row = await env.LIKES
      .prepare(
        "INSERT INTO likes (song_id, count) VALUES (?1, MAX(?2, 0)) " +
        "ON CONFLICT(song_id) DO UPDATE SET count = MAX(count + ?2, 0) RETURNING count",
      )
      .bind(id, delta)
      .first();
    return json({ id, count: row ? row.count : 0 });
  }

  return json({ error: "not found" }, request.method === "GET" || request.method === "POST" ? 404 : 405);
}

async function servePreview(request, env, url) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method Not Allowed", { status: 405, headers: { allow: "GET, HEAD" } });
  }
  const key = decodeURIComponent(url.pathname.slice(PREVIEW_PREFIX.length));
  if (!key || key.includes("/")) return new Response("Not Found", { status: 404 });

  // 브라우저의 Range(구간) · If-None-Match 헤더를 그대로 넘기면 R2가 알아서 처리한다.
  const object = await env.SONGS.get(key, { range: request.headers, onlyIf: request.headers });
  if (object === null) return new Response("Not Found", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers); // 업로드 때 넣은 content-type · cache-control
  headers.set("etag", object.httpEtag);
  headers.set("accept-ranges", "bytes");

  // onlyIf 조건에 걸리면(브라우저 캐시가 최신) body 없이 돌아온다 → 304
  if (!object.body) return new Response(null, { status: 304, headers });

  const body = request.method === "HEAD" ? null : object.body;

  // 구간 요청 → 206 Partial Content. range는 {offset,length} 또는 {suffix} 꼴인데,
  // 로컬 R2는 안 쓰는 키도 undefined로 채워 보내므로 "in"이 아니라 값의 타입으로 판정한다.
  const r = object.range || {};
  const partial = request.headers.has("range") &&
    (typeof r.suffix === "number" || typeof r.offset === "number" || typeof r.length === "number");
  if (partial) {
    let start, end;
    if (typeof r.suffix === "number") {
      start = object.size - r.suffix;
      end = object.size - 1;
    } else {
      start = r.offset ?? 0;
      const length = r.length ?? object.size - start;
      end = start + length - 1;
    }
    headers.set("content-range", `bytes ${start}-${end}/${object.size}`);
    headers.set("content-length", String(end - start + 1));
    return new Response(body, { status: 206, headers });
  }

  headers.set("content-length", String(object.size));
  return new Response(body, { status: 200, headers });
}
