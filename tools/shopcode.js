// Atölye'den gelen "ATOLYE-MAGAZA:..." yayın kodunu shop/config.json'a yazar: node tools/shopcode.js 'ATOLYE-MAGAZA:1...'
const fs=require("fs"),path=require("path"),zlib=require("zlib");
let s=(process.argv[2]||"").trim().replace(/^ATOLYE-MAGAZA:/,"");if(!s){console.error("kod yok");process.exit(1)}
const v=s[0],b=Buffer.from(s.slice(1).replace(/-/g,"+").replace(/_/g,"/"),"base64");
const d=JSON.parse((v==="1"?zlib.inflateRawSync(b):b).toString("utf8"));
fs.writeFileSync(path.join(__dirname,"../shop/config.json"),JSON.stringify(d,null,1));
console.log("shop/config.json yazıldı:",d.c&&d.c.n,"· WhatsApp",d.c&&d.c.wa,"· sunta",d.set&&d.set.mats&&d.set.mats.sunta&&d.set.mats.sunta.price);
