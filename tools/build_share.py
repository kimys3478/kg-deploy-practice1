# 리포의 페이지 파일(index.html · styles.css · data.js · script.js · assets/)을
# 메일로 보내기 좋은 HTML 파일 하나(dist/김윤선_포트폴리오.html)로 묶어요.
# 사용법: 리포 맨 위 폴더에서  python tools/build_share.py
import base64, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

def uri(p):
    mime = {".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp"}[os.path.splitext(p)[1]]
    return f"data:{mime};base64," + base64.b64encode(open(p, "rb").read()).decode()

assets = [f"assets/{f}" for f in os.listdir("assets") if f != "lab-tool.jpg"]
files = {n: open(n, encoding="utf-8").read() for n in ("index.html", "styles.css", "data.js", "script.js")}
files["data.js"] = files["data.js"].replace("const yt = (id) => ({ cover: `assets/yt-${id}.jpg`,", "const yt = (id) => ({ cover: window.__A[`assets/yt-${id}.jpg`],")
for a in assets:
    u = uri(a)
    for n in files: files[n] = files[n].replace(f'"{a}"', f'"{u}"')
amap = "window.__A={" + ",".join(f'"{a}":"{uri(a)}"' for a in assets if "yt-" in a) + "};"
h = files["index.html"]
h = h.replace('<link rel="stylesheet" href="styles.css">', f"<style>\n{files['styles.css']}\n</style>")
h = h.replace('<script src="data.js"></script>', f"<script>{amap}\n{files['data.js']}</script>")
h = h.replace('<script src="script.js"></script>', f"<script>{files['script.js']}</script>")
os.makedirs("dist", exist_ok=True)
out = os.path.join("dist", "김윤선_포트폴리오.html")
open(out, "w", encoding="utf-8").write(h)
print(out, len(h) // 1024, "KB")
