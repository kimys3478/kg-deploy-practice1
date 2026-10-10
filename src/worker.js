// Cloudflare Worker. 정적 파일(index.html 등)은 그대로 두고,
// /preview/<파일명> 요청만 R2 버킷(portfolio-songs)에서 꺼내 준다.
// wrangler.jsonc의 run_worker_first 때문에 /preview/* 만 이 코드로 들어온다.

const PREVIEW_PREFIX = "/preview/";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith(PREVIEW_PREFIX)) return servePreview(request, env, url);
    return env.ASSETS.fetch(request);
  },
};

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
