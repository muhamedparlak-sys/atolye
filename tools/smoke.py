# Playwright telefon ekranı duman testi: python3 tools/smoke.py  (önce tools/build.sh)
import asyncio,os,re
from playwright.async_api import async_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VER=re.search(r'const APPVER="([^"]+)"',open(ROOT+"/src/atolye.html").read()).group(1)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader","--enable-unsafe-swiftshader"]);errs=[]
        pg=await b.new_page(viewport={"width":390,"height":800},device_scale_factor=2);pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.add_init_script(f"localStorage.setItem('atolye2_seen','\"{VER}\"')")   # Yenilikler penceresi açılmasın
        await pg.goto("file://"+ROOT+"/index.html")
        await pg.click('[data-type="gardirop"]');await pg.evaluate('S.step="olcu";render()');await pg.evaluate('S.mods=variants()[0].mods;S.step="duzen";render()')
        await pg.screenshot(path="/tmp/smoke-duzen.png")
        await pg.evaluate('S.step="sonuc";render()');await pg.screenshot(path="/tmp/smoke-sonuc.png")
        await pg.evaluate('S.view="hazir";render()');await pg.wait_for_timeout(2500);await pg.screenshot(path="/tmp/smoke-hazir.png")
        await pg.evaluate('S.view="liste";render()');await pg.screenshot(path="/tmp/smoke-liste.png")
        print("hatalar:",errs or "yok");await b.close()
asyncio.run(main())
