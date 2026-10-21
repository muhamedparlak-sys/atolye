#!/bin/sh
# src/atolye.html (artifact gövdesi, TEK KAYNAK) -> index.html (GitHub Pages) + 3d.html
set -e
cd "$(dirname "$0")/.."
{
  printf '<!doctype html>\n<html lang="tr">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<meta name="theme-color" content="#2747A6">\n'
  printf '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font-size:14px}img{max-width:100%%}[hidden]{display:none!important}</style>\n'
  sed -n '1,/^<\/style>$/p' src/atolye.html
  printf '</head>\n<body>\n'
  sed -n '/^<\/style>$/,$p' src/atolye.html | tail -n +2
  printf '</body>\n</html>\n'
} > index.html
python3 -c "
import re;s=open('index.html').read();open('/tmp/atolye-app.js','w').write(re.findall(r'<script>(.*)</script>',s,re.S)[0])"
node --check /tmp/atolye-app.js
node -e '
const els={};const mk=()=>({innerHTML:"",value:"",textContent:"",addEventListener(){},scrollIntoView(){},remove(){},setAttribute(){},className:""});
global.document={querySelector:s=>els[s]||(els[s]=mk()),querySelectorAll:()=>[],addEventListener(){},createElement:()=>mk(),body:{appendChild(){}},getElementById:()=>null,head:{appendChild(){}},documentElement:{}};
global.window={scrollTo(){}};global.getComputedStyle=()=>({getPropertyValue:()=>""});global.localStorage={getItem(){return null},setItem(){}};
eval(require("fs").readFileSync("/tmp/atolye-app.js","utf8")+";require(\"fs\").writeFileSync(\"3d.html\",linkPageHTML())");'
echo "index.html + 3d.html yazıldı"
