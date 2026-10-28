# Ürün ekleme rehberi — OtoTurbo.com.tr

Yeni ürün için \`data/products.json\` dosyasına bir nesne ekleyin. Fiyat alanı eklemeyin; sitede fiyat gösterilmez.

\`\`\`json
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
    "metaDescription": "Renault Clio 5 1.0 TCe sıfır turbo ürün bilgileri ve uyumluluk desteği.",
    "keywords": ["renault clio sıfır turbo", "1.0 tce turbo", "16319700012 turbo"],
    "seoContent": "Ürüne özel kapsamlı SEO açıklaması.\n\nTeknik özellikleri, uyumluluğu ve satın alma öncesi kontrolleri yazın.",
    "compatibility": ["Yalnızca parça numarası doğrulanırsa uyumludur"],
    "visible": true
  }
]
\`\`\`

Alanlar:
- \`slug\`: benzersiz ürün URL'si; küçük harf ve tire kullanın.
- \`title\`: ürün adı/başlığı.
- \`vehicleBrand\`, \`vehicleModel\`, \`engine\`: araç ve motor bilgileri.
- \`turboBrand\`, \`turboCode\`: turbo üreticisi ve parça numarası.
- \`image\`: görsel dosya adı; görseli depo kök dizinine ekleyin.
- \`shortDescription\`: katalogdaki kısa metin.
- \`description\`: ürün detay açıklaması.
- \`seoTitle\`, \`metaDescription\`, \`keywords\`: SEO alanları.
- \`seoContent\`: ürün detay sayfasında açılır alanda gösterilir; kullanıcıdan gizlenen anahtar kelime metni olarak kullanmayın.
- \`compatibility\`: doğruladığınız uyumlu araç/motor bilgileri.
- \`visible\`: \`false\` olursa ürün sayfası oluşturulmaz.

GitHub'a gönderdiğinizde Actions, ürün detay HTML sayfasını ve sitemap kaydını otomatik üretir. Görseli de aynı değişiklikle ekleyin.
