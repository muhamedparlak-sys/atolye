// Node'da uygulama mantığını DOM'suz çalıştırma: node tools/harness.js 'JS kodu'
// Örnek: node tools/harness.js 'S.type="gardirop";Object.assign(S.inp,{W:200,H:240,D:58,obs:[]});S.mods=variants()[0].mods;R=computeAll(S.mods);console.log(pack(R.parts,"sunta").sheets.length)'
const fs=require("fs"),path=require("path");
const src=fs.readFileSync(path.join(__dirname,"../src/atolye.html"),"utf8");const js=src.match(/<script>([\s\S]*)<\/script>/)[1];
const els={};const mk=()=>({innerHTML:"",value:"",textContent:"",addEventListener(){},scrollIntoView(){},remove(){},setAttribute(){},className:""});
global.document={querySelector:s=>els[s]||(els[s]=mk()),querySelectorAll:()=>[],addEventListener(){},createElement:()=>mk(),body:{appendChild(){}},getElementById:()=>null,head:{appendChild(){}},documentElement:{}};
global.window={scrollTo(){}};global.getComputedStyle=()=>({getPropertyValue:()=>""});global.localStorage={getItem(){return null},setItem(){}};
eval(js+"\n"+(process.argv[2]||""));
