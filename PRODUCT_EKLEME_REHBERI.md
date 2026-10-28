# Ürün ekleme rehberi — OtoTurbo.com.tr

Yeni bir ürün eklemek için data/products.json dosyasına bir nesne ekleyin. Sitede fiyat alanı bulunmaz.

Örnek ürün:

    [
      {
        "slug": "renault-clio-5-1-0-tce-sifir-turbo-16319700012",
        "title": "renault clio 5 1.0 tce sıfır turbo 16319700012",
        "vehicleBrand": "Renault",
        "vehicleModel": "Clio 5",
        "engine": "1.0 TCe H4D",
        "turboBrand": "Garrett",
        "turboCode": "16319700012",
        "image": "renault-clio-turbo.jpg",
        "imageAlt": "Renault Clio 5 1.0 TCe sıfır turbo",
        "shortDescription": "Renault Clio 5 1.0 TCe için sıfır turbo ürün bilgileri.",
        "description": "Ürünün teknik açıklamasını buraya yazın.",
        "seoTitle": "renault clio 5 1.0 tce sıfır turbo | ototurbo.com.tr",
        "metaDescription": "Renault Clio 5 1.0 TCe sıfır turbo ve uyumluluk bilgileri.",
        "keywords": ["renault clio sıfır turbo", "1.0 tce turbo", "16319700012 turbo"],
        "seoContent": "Ürüne özel kapsamlı SEO açıklaması.\n\nTeknik özellikleri, uyumluluğu ve satın alma öncesi kontrolleri yazın.",
        "compatibility": ["Uyumluluğu parça numarası doğrulandıktan sonra teyit edin"],
        "visible": true
      }
    ]

Alanların anlamı:

- slug: benzersiz ürün URL'si; küçük harf ve tire kullanın.
- title: ürün başlığı.
- vehicleBrand, vehicleModel, engine: araç ve motor bilgileri.
- turboBrand, turboCode: turbo markası ve parça/referans numarası.
- image: fotoğrafın dosya adı. Fotoğrafı depo kök dizinine veya assets/ ya da images/ klasörüne ekleyin.
- shortDescription: katalog kartındaki kısa açıklama.
- description: ürün detay sayfasındaki açıklama.
- seoTitle, metaDescription, keywords: SEO alanları.
- seoContent: ürün detay sayfasında açılır alanda görünen uzun açıklama. Google için kullanıcıdan saklanan anahtar kelime metni yazmayın.
- compatibility: kontrol ettiğiniz araç ve motor uyumlulukları.
- visible: false yapılırsa ürün sayfası üretilmez.

Ürünü ve görseli GitHub'a gönderdiğinizde Actions iş akışı ayrı HTML ürün sayfası ve sitemap kaydı oluşturur. Ürün URL'si urun/ürün-slug/ biçimindedir.
