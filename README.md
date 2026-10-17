# Atölye Kesim

Mobilya ustası için telefondan çalışan tasarım ve kesim uygulaması. Tek bir HTML dosyası; kurulum gerektirmez.

## Ne yapar

1. **Ne?** Gardırop, vestiyer, kahve köşesi, çocuk dolabı veya mutfak (I / L / U plan).
2. **Ölçü** En ve boy (mutfakta duvar uzunlukları, tezgah yüksekliği, cihazlar).
3. **Öneri** Girilen ölçüye göre 3 hazır düzen; her birinde kapak, çekmece, plaka sayısı ve uyarılar.
4. **Düzenle** Satranç tahtası gibi ızgara: her sütun ayrı renk ve harf, satırlar numaralı (B2 gibi). Hücreye dokununca ölçüleri ve ayarları açılır.
5. **Kesim** Parça listesi (bant bilgisiyle), plaka yerleşimi, hırdavat listesi (kulp / çekbas, menteşe tipi, ray, minifix…), kesimhaneye ve hırdavatçıya kopyalanacak metin.

Duvardaki kolon ve tavandaki kiriş Ölçü adımında girilir; kolonun önü boş bırakılır, kirişin altına giren dolap 1 cm montaj payıyla kısaltılır, mutfakta sığmayan cihaz başka duvara taşınır.

Ergonomi kuralları "Usta notları" olarak gösterilir: askı boşluğu, raf aralığı, kapak genişliği (60 cm üstü otomatik çift kapak), kapak boyu (220 cm üstü tavan dolabı), tezgah 85–95 cm, menteşe sayısı, raf sehimi.

## Varsayılanlar

- Gövde: Suntalam 18 mm, plaka 2800 × 2100 mm
- Arkalık: 3 mm duralit, 8 mm ya da gövdeyle aynı 18 mm (içten geçme); türe göre önerilen seçim gelir, Düzenle ekranından değiştirilir
- Testere payı 4 mm, kenar temizleme 10 mm, kapak boşluğu 3 mm

Projeler ve fiyatlar tarayıcının yerel depolamasında (localStorage) tutulur; yalnızca o telefonda görünür.

## Çalıştırma

`index.html` dosyasını tarayıcıda açmak yeterli. GitHub Pages açılırsa (Settings → Pages → Branch: `main`, klasör `/`) telefondan adresle kullanılabilir ve ana ekrana eklenebilir.
