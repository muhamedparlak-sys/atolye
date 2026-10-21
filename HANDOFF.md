# Atölye — yeni oturum devir notu (21 Ekim 2026)

Bu dosya, uzayan oturumdaki işi yeni bir oturumda kaldığı yerden sürdürmek için yazıldı. Önce bunu okuyun.

## Ürün
- **Atölye:** Telefon öncelikli, tek dosyalık mobilya tasarım ve kesim uygulaması (Türkçe arayüz).
- **Kullanıcı:** Suntalamı ebatlamada (fasoncu) kestiren marangoz.
- **Yayın:**
  - GitHub Pages: https://muhamedparlak-sys.github.io/atolye/ (repo `muhamedparlak-sys/atolye`, dal `main`).
  - Claude artifact: https://claude.ai/artifact/RmZN63J87JccuCsi2HEU8t (sürüm 38; 2026.10.21d henüz yayınlanmadı — yalnız GitHub Pages güncel). Yeni oturumda güncellemek için önce `Artifact read`, sonra aynı `url` ile publish.
- **Kayıtlı veriler** tarayıcı localStorage'ında durur; sürüm güncellemesi bunları silmez:
  - `atolye2_cur`, `atolye2_set`, `atolye2_projeler`, `atolye2_liste`, `atolye2_hizli`, `atolye2_foto`, `atolye2_seen`, `atolye2_hazir`
  - Yeni alan eklerken eski kayıtla birleştirin, örneğin `Object.assign(varsayılan, kayıtlı)`. `SET.mats` bu şekilde birleştiriliyor.

## Dosyalar ve iş akışı
- `src/atolye.html` — **tek kaynak** (artifact gövdesi: `<style>…</style>` + HTML + tek `<script>`). Bütün değişiklikler burada yapılır.
- `tools/build.sh` — `index.html` (Pages) ve `3d.html` (3D paylaşım bağlantı sayfası) üretir; JS söz dizimini denetler.
- `tools/harness.js` — Uygulama mantığını Node'da DOM'suz çalıştırır, örneğin `node tools/harness.js 'S.type="gardirop";…;console.log(…)'`.
- `tools/smoke.py` — Playwright ile 390 px telefon ekranında duman testi. Yenilikler penceresini kapatmak için `atolye2_seen=APPVER` ayarlar. Chromium hazır kurulu; `playwright install` yapmayın.
- Her özellikten sonra sırasıyla:
  1. Yenilikleri yazın: `NEWS` dizisinin başına madde ekleyin ve `APPVER`'i artırın (ör. `"2026.10.21c"` → `"2026.10.22"`). Gerekirse `GUIDE`'a da ekleyin.
  2. `README.md` içindeki "Yenilikler" bölümünü güncelleyin.
  3. `sh tools/build.sh` ve `python3 tools/smoke.py` çalıştırın.
  4. Artifact'i publish edin.
  5. Commit + push.
- Commit mesajının sonuna oturumun verdiği attribution satırları eklenir.
- **Düzenleme yöntemi:** Önceki oturumda Python ile tam metin değiştirme kullanıldı: her parçanın dosyada tam bir kez geçtiğini assert ile doğrulayıp değiştirmek. Dosya ~500 KB; bütününü okumayın, `grep -n` ile ilgili fonksiyona gidin.
- **Lisans:** GPL kod kopyalanmaz (ör. opcut). Yöntemler bağımsız olarak yazılır.

## Kod haritası (fonksiyon adları; `grep -n "^function ad"` ile bulunur)
- **Durum:**
  - `S` — proje: `type`, `inp`, `mods`, `step`, `view`, `tac`, `colors`, `artik`…
  - `SET` — atölye ayarları: `mats`, `t`, `kerf`, `trim`, `grain`, `drawerMin`, `joint`, `car`…
  - `FL` — serbest kesim listesi.
  - `HZ` — hazır modeller.
  - `R=computeAll(S.mods)` — `parts` (her parçada `key`, `id`, `name`, `a`/`b`, `a0`/`b0`, `qty`, `mat`, `bl`/`bs`, `mods`) ve `geo`.
- **Malzemeler:**
  - `DEFAULT_SET.mats`: `sunta`, `kapak`, `arka8`, `arka3`, `kontra18`, `sukontra18`, `masif18`, `mdf18`.
  - `MAT_ORDER`, `GRAINY(k)`; `matsUsed(parts)`.
- **Modül modeli:**
  - `mkMod`; `m.cols[].bands[]` — `B(kind,h,{door,join,shelves,n})`, kind ∈ raf/nis/aski/cekmece.
  - `c.dsplit` — kapak bölme yükseklikleri.
  - `m.role` ∈ govde/tavan/asma/alt/ust; `m.mount`, `m.baza`.
- **Akış:**
  - `variants()` (tür başına `…Variants`) → `renderOneri` → `renderDuzen` (`editorHTML`, `cellEditorHTML`) → `renderSonuc` (sekmeler: parça, plaka, etiket, delik, hırdavat, teklif, gönder) → `renderMontaj` → `render3D`.
- **Kesim:**
  - `pack(parts,mat,opt)`: giyotin + şerit + sıralı doldurma + SVC; `opt.deep` 15 sn.
  - Yardımcılar: `sheetUse`, `sheetSVG`, `cutDoc`, `cutText`, `cutCSV`.
  - Levha azaltma: `saverTips`, `whatifCalc`.
  - Artıktan kesim: `S.artik`. Artıktan ürün: `artikCalc`, `ARTIK`.
- **Uyarılar:** `advise(mods,R)` → `add(lvl,txt,why)`; `notesSheet`. Raf sehimi artık hesapla (aşağıda "Raf sehimi"); diğer kurallar metin:
  - Tabla 160 cm'den uzun → bilgi.
  - Askı borusu 90 cm'den uzun → orta taşıyıcı.
  - Köşe rafı → çıta önerisi.
  - Satırları bulmak için `grep -n sehim`.
- **Raf sehimi ve destek (2026.10.21d):**
  - `RAFMAT` (E, kdef), `RAFYUK` (kg/m), `USEYUK` (eşya → yük), `RAFDES` (on/arka/dikme/konsol/kalin), `rafSag(o)` → `{d0,d1,lim,st}`, `autoSup`, `yukOf`, `rafList`.
  - Bant alanları: `b.sup` (elle seçilen destek; `{}` = destek yok), `b.yuk`, `b.rmat`. Geometri `BG.sag`, `BG.sup`, `BG.supAuto`, `BG.st` (raf kalınlığı), `BG.dep`.
  - `S.agir` (ağır yük): `b.sup` yoksa ve raf bel veriyorsa `autoSup` uygulanır; `bazaN()` 2 olur; geniş gövdeye "Baza ara desteği".
  - Arayüz: `rafPanelHTML` (göz düzenleyici), `rafSheet` (Düzen → Raflar); işleyiciler `data-sup/yuk/rmat/supauto/rafauto/agir`.
- **Baza:** `floorOf().bazaN` 1|2 (yoksa `S.agir?2:1`), `data-bazan`.
- **Kulpsuz:** `S.opener="gola"`, `S.golaMat` sunta|alu, `golaMod(m)` (alt ve ≤110 cm yer dolapları), `GOLA_H` 30, `GOLA_UST` 20; `CG.gola={L,U,sw}`; `openerHTML/openerSheet`.
- **Elle düzeltilmiş kesim listesi:** `S.partOv[p.key]={a,b,qty,name,del}`, `S.extraParts=[{id,name,a,b,qty,mat,bl,bs}]`; `computeAll` sonunda yalnız `mods===S.mods&&!NOOV` iken uygulanır. `R.delParts`, `R.ovOrphans`, `p.ov` (tasarım değeri), `p.extra`. Arayüz: `partRows`, `partSheet`, `partEditNote`; `data-pedit/padd/psave/preset/pdel/prestore/povclear/porph`.
- **Hırdavat ve fiyat:** `hardware(mods,R)`, `hwCost`, `CATALOG` (fiyat kütüphanesi aileleri `#` ile), `quote()` (`m.extra` modülleri teklif dışı).
- **Delik planı:** `drillPlan`; birleşimler `JOINTS` (konfirmat/minifix/vida).
- **Kapaklar:** `doorSplit`, `doorSplitHTML`, `colFronts`, `frontScan`, `alignFronts`, `equalizeDoors`, `frontHTML`, `frontSheet`.
- **Taç:** `TAC`, `tacOf`, `applyTac`, `tacSheet`. Gardırobun 235 cm üstü için `S.inp.top` ∈ dolap/tek/bos.
- **Mutfak:** `ancFree`, `cookMod`, `makeTall`, `kindHTML`, `planSVG`, `wallSVG`.
- **3D:**
  - `load3D` (three r128 cdnjs + OrbitControls jsdelivr).
  - `show3D(el,boxes,{upTo,fit,far,cam,dims})` — kutularda `x0..z1`, `col`, `step`, `ex`, `kind`, `rz`.
  - `sceneBoxes`, `link3D`, `share3D`, GLB dışa aktarma.
- **Hazır modeller (divan, ev yatak, yer yatağı, karyola, kitaplık, öğrenme kulesi):**
  - Divan (2026.10.21e): `o.m==="divan"`, parametreler `dvT` (sandik|cekmece|lata), `dvH`, `dvB`, `dvHB`, `dvC`, `dvK`; levhaya sığmayan büyük panel `big()` ile ikiye bölünür. Ana ekrandaki kart `data-hzgo="divan"`.
  - `hzBuild(o)` → `{parts(st=adım), hw, steps, prep, notes, G(3D kutular), size}`.
  - `hzDraw` (2D, G'den), `renderHazir`, `hz3Show`, `hzShots` (kılavuz için adım resimleri), `hzDoc` (üretim kılavuzu).
  - `MATADV` (malzeme karşılaştırması), `HZJ` (birleşim).
- **Çocuk odası planı:** `roomPlans`, `rmSVG`, `rmParts`, `roomHTML`.
- **Arabama sığsın:** `CARS`, `carOf`, `carFitPart`, `carSplit`, `carHTML`, `carPickHTML`.
- **Serbest liste ("Ölçüden levha planı"):**
  - `renderListe`, `flRowHTML`, `flParts`, `flResultsHTML`.
  - Satır ekleme, silme ve düzenleme burada zaten var: `data-fladd`, `data-fldel`, `data-flm`…
  - Projeden aktarma: `data-flimp`.
- **Diğer:**
  - Fotoğrafla ölçü: `FM`, `fmH`, `renderFoto`.
  - Müşteri klasörleri: `folders`, `projSave`, `renderProj`.

## YAPILDI (2026.10.21d)
- Raf sehimi + destek elemanları, ağır yük, baza sayısı, kesim listesi düzeltme, kulpsuz L-U kanal (ayrıntı yukarıda, kod haritasında).

## SIRADAKİ İŞLER (önceki not; 1 ve 2 tamamlandı)
1. **Raf bel vermesi (sehim) ve destek elemanı.** Kullanıcı rafların sehim yapmasından endişeli; malzemeye göre destek eklenmesini istiyor.
   - Malzeme başına sehim hesabı: elastisite modülü E (yaklaşık değerler, kaynakla doğrulanmalı):

     | Malzeme | E (N/mm²) |
     |---|---|
     | Sunta / suntalam | ~2500–3500 |
     | MDF | ~3000 |
     | Huş kontrplak | ~7000+ |
     | Masif (çam) | ~8000+ |

   - Raf yükü: kitap ~ 25–30 kg/m, giysi daha az. Basit mesnetli kiriş formülü: δ = 5wL⁴/(384EI). Kabul sınırı ~L/200 ya da sagulator benzeri ~0.02 in/ft.
   - Sonuca göre öneriler:
     - Ön kenara "raf ön çıtası" (ör. 18×40 mm, raf altına tutkal + vida).
     - Arkadan arkalığa vidalı çıta.
     - Ortada dikme ya da raf altına metal L / gizli raf taşıyıcı.
     - Daha kalın raf (25 mm / çift kat).
   - Seçilen destek parçası kesim listesine, hırdavata, delik planına ve 3D'ye girmeli. Düzen'de rafa dokununca "Bu raf X mm sarkar" uyarısı ve "Destek ekle" seçenekleri görünmeli.
   - Mevcut 80 cm kuralı malzemeye ve yüke bağlanmalı.
2. **Proje kesim listesinde ekleme, çıkarma, ölçü değiştirme.**
   - Bugün proje parçaları `computeAll`'dan türetiliyor ve elle düzeltilemiyor (yalnız "Projeden aktar" ile serbest listeye kopyalanabiliyor).
   - Önerilen tasarım:
     - `S.partOv` = `{[p.key]: {a,b,qty,del,name,bl,bs}}` — ölçü, adet veya silme üzerine yazma.
     - `S.extraParts` = el ile eklenen satırlar.
     - `computeAll` sonunda uygulanır. Böylece kesim planı, etiket, CSV, PDF ve teklif hepsi aynı listeyi kullanır.
   - Arayüz: Kesim → Parça sekmesinde her satırda düzenle/sil, altta "+ Parça ekle". Değiştirilmiş satır işaretli olmalı ve "Tasarıma göre sıfırla" seçeneği bulunmalı.
   - Tasarım değişince geçersiz kalan üzerine yazmalar için uyarı gösterilmeli.
3. **Sonra (kullanıcının daha önceki isteği):**
   - Fotoğraftan model çıkarma (görüntü tanıma servisi gerekir).
   - Gardırop/mutfak modüllerini "arabaya sığsın" için otomatik bölme (şimdilik yalnız öneri metni var).

## Yanıt üslubu
Kullanıcıya Türkçe, kısa ve sade yazın. Kullanıcı uygulamayı sahadaki usta ve "sade vatandaş" için istiyor: görsel, adım adım, anlaşılır olmalı.

## Kredi notu
- Artifact'i yeni bir oturumda güncellemek, yayından önce ~500 KB dosyanın tamamını okumayı gerektirir; en pahalı adım budur. Kullanıcıya önerildi: günlük deneme GitHub Pages'ten, artifact yalnız büyük sürümlerde.
- Kullanıcının sıradaki fikri: suntalamdan, düz kesimli (ebatlamada eğimli kesim yok), sıcak görünümlü bebek/çocuk ürünleri — anne yanı beşik, dönüşen karyola, Montessori masa + sandalye, oyuncak dolabı. "Hazır modeller" altyapısına (HZM + hzBuild) eklenecek; EN 1130 / EN 716 güvenlik ölçüleri gömülecek.
