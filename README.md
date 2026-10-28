# OtoTurbo.com.tr — GitHub Pages sitesi

Beyaz temalı, mobil uyumlu sıfır turbo kataloğu. Ürün ve blog detayları statik HTML olarak üretilir; sitemap ve robots.txt derleme sırasında hazırlanır.

## Önemli dosyalar

- index.html: ana sayfa tasarımı ve SEO başlıkları.
- styles.css: masaüstü ve mobil tasarım.
- app.js: katalog arama, marka filtreleri ve kayan logo şeridi.
- data/products.json: yeni ürünleri ekleyeceğiniz katalog dosyası.
- data/vehicle-brands.json: araç markaları.
- data/blog.json: blog yazıları.
- build.mjs: ürün, blog ve bilgilendirme sayfalarını ve sitemap'i üretir.
- .github/workflows/deploy.yml: GitHub Pages otomatik dağıtımı.
- PRODUCT_EKLEME_REHBERI.md: ürün ekleme örneği.

## Siteyi yayınlama

1. GitHub deposunun Settings → Pages bölümünde Source olarak GitHub Actions seçili olmalı.
2. Ana dala gönderilen her değişiklikten sonra Actions siteyi derler ve dist klasörünü yayınlar.
3. Alan adı için mevcut CNAME korunur. DNS kayıtları alan adı sağlayıcınızda GitHub Pages yönergelerine göre yapılandırılmalıdır.
4. Yayından sonra https://ototurbo.com.tr/robots.txt ve https://ototurbo.com.tr/sitemap.xml adreslerini kontrol edin.
5. Google Search Console'da alan adını doğrulayın ve sitemap.xml dosyasını gönderin. Site haritası indekslenme garantisi sağlamaz.

## Yeni ürün ekleme

data/products.json içine yeni bir ürün nesnesi ekleyin; fotoğraf dosyasını depo kök dizinine veya assets/ ya da images/ klasörüne aynı commit içinde yükleyin. Değişiklikleri main dalına gönderin. Her ürün için ayrı ürün sayfası, canonical etiketi, Product yapılandırılmış verisi ve sitemap kaydı oluşturulur. Fiyat alanı yoktur.

## Görseller

Mevcut depo görselleri isimleri değiştirilmeden kullanılır: ototurbo.png, ototurbo-com-tr.JFIF, borgwarner.jpg, garrett.png, jrone.png, marelli.png, nissens.png, nrf.png, pierburg.png, supsan.png ve valeo.png. Derleme bu dosyaları dist/assets içerisine kopyalar; tarayıcıda CSS ile boyutlandırılır.

## SEO ve yasal metin notları

Ürün sayfaları ayrı HTML olarak üretildiği için yalnızca JavaScript ile oluşturulan kartlara bağımlı değildir. Google tarama ve indeksleme kararını kendisi verir; üst sıralama garanti edilemez. Gizlenmiş anahtar kelime metni kullanmayın; uzun SEO açıklaması ürün sayfasında açılır içerik olarak gösterilir.

KVKK, gizlilik ve satış bilgilendirme sayfaları başlangıç taslağıdır. İşletmenin tam yasal unvanı, veri sorumlusu bilgileri ve gerçek süreçleri yayın öncesi tamamlanmalı ve kontrol edilmelidir.
