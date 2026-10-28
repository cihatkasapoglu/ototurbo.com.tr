import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const ROOT=path.dirname(fileURLToPath(import.meta.url));
const OUT=path.join(ROOT,"dist");
const BASE="https://ototurbo.com.tr";
const ASSETS=["ototurbo.png","ototurbo-com-tr.JFIF","borgwarner.jpg","garrett.png","jrone.png","marelli.png","nissens.png","nrf.png","pierburg.png","supsan.png","valeo.png"];
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const slug=v=>String(v||"").toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ı/g,"i").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const read=f=>JSON.parse(fs.readFileSync(path.join(ROOT,f),"utf8"));
const put=(f,s)=>{fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,s,"utf8")};
const url=p=>BASE+(p.startsWith("/")?p:"/"+p);
fs.rmSync(OUT,{recursive:true,force:true});
fs.mkdirSync(OUT,{recursive:true});
for(const f of ["index.html","styles.css","app.js"])fs.copyFileSync(path.join(ROOT,f),path.join(OUT,f));
fs.mkdirSync(path.join(OUT,"data"),{recursive:true});
for(const f of ["products.json","vehicle-brands.json","blog.json"])fs.copyFileSync(path.join(ROOT,"data",f),path.join(OUT,"data",f));
fs.mkdirSync(path.join(OUT,"assets"),{recursive:true});
for(const f of ASSETS){const src=path.join(ROOT,f);if(fs.existsSync(src))fs.copyFileSync(src,path.join(OUT,"assets",f));}
if(fs.existsSync(path.join(ROOT,"CNAME")))fs.copyFileSync(path.join(ROOT,"CNAME"),path.join(OUT,"CNAME"));else put(path.join(OUT,"CNAME"),"ototurbo.com.tr\n");
const products=read("data/products.json").filter(p=>p&&p.slug&&p.title&&p.visible!==false);
const brands=read("data/vehicle-brands.json");
const blog=read("data/blog.json");
const seen=new Set();
for(const p of products){p.slug=slug(p.slug);if(!p.slug||seen.has(p.slug))throw new Error("Ürün slug hatalı veya yinelenmiş: "+p.title);seen.add(p.slug);if(p.image){const img=path.basename(p.image);for(const src of [path.join(ROOT,img),path.join(ROOT,"assets",img),path.join(ROOT,"images",img)])if(fs.existsSync(src)){fs.copyFileSync(src,path.join(OUT,"assets",img));break;}}}
const optimizeFiles=[...new Set([...ASSETS,...products.map(p=>p.image?path.basename(p.image):"").filter(Boolean)])];
let optimizedCount=0;
for(const f of optimizeFiles){
 const target=path.join(OUT,"assets",f);
 if(!fs.existsSync(target))continue;
 const ext=path.extname(f),base=path.basename(f,ext);
 const temp=path.join(OUT,"assets",base+".optimized"+ext);
 const geometry=f==="ototurbo.png"?"650x280>":f==="ototurbo-com-tr.JFIF"?"1800x850>":"600x350>";
 try{
  execFileSync("convert",[target,"-auto-orient","-resize",geometry,"-strip","-quality","84",temp],{stdio:"ignore"});
  if(fs.existsSync(temp)){fs.renameSync(temp,target);optimizedCount++;}
 }catch(error){
  if(fs.existsSync(temp))fs.unlinkSync(temp);
  console.warn("Görsel otomatik optimize edilemedi; kaynak dosya olduğu gibi kopyalandı: "+f);
 }
}
console.log("Yayın için boyutlandırılan/sıkıştırılan görsel sayısı: "+optimizedCount);
const records=[{path:"/",freq:"weekly",priority:"1.0"}];
const allBrands=[...new Set([...brands,...products.map(p=>p.vehicleBrand).filter(Boolean)])];
const brandCards=allBrands.map(b=>'<button class="brand-card" data-brand="'+esc(b)+'" type="button"><strong>'+esc(b)+'</strong><small>'+products.filter(p=>(p.vehicleBrand||"").toLocaleLowerCase("tr-TR")===b.toLocaleLowerCase("tr-TR")).length+' ürün ↗</small></button>').join("");
const productCards=products.map(p=>{const route="/urun/"+p.slug+"/";const image=p.image?'<img src="/assets/'+esc(path.basename(p.image))+'" alt="'+esc(p.imageAlt||p.title)+'" loading="lazy">':"";return '<article class="product-card"><a class="product-image'+(image?"":" no-img")+'" href="'+route+'">'+image+'<span class="product-badge">Sıfır ürün</span></a><div class="product-info"><span class="product-make">'+esc([p.vehicleBrand,p.vehicleModel].filter(Boolean).join(" "))+'</span><h3><a href="'+route+'">'+esc(p.title)+'</a></h3><p>'+esc(p.shortDescription||"Ürün bilgileri için detay sayfasını inceleyin.")+'</p><a class="product-link" href="'+route+'"><span>Ürün detaylarını incele</span><span>→</span></a></div></article>';}).join("");
const blogCards=blog.map((p,i)=>'<article class="blog-card"><span class="blog-number">REHBER / '+String(i+1).padStart(2,"0")+'</span><h3><a href="/blog/'+slug(p.slug)+'/">'+esc(p.title)+'</a></h3><p>'+esc(p.description)+'</p><a class="text-link" href="/blog/'+slug(p.slug)+'/">Yazıyı oku →</a></article>').join("");
let home=fs.readFileSync(path.join(ROOT,"index.html"),"utf8");
home=home.replace("<!-- BRAND_CARDS -->",brandCards).replace("<!-- PRODUCT_CARDS -->",productCards).replace("<!-- BLOG_CARDS -->",blogCards);
home=home.replace('id="catalogCount">Katalog yükleniyor...', 'id="catalogCount">'+products.length+' ürün listeleniyor');
home=home.replace('id="productGrid" class="product-grid">','id="productGrid" class="product-grid"'+(products.length?"":" hidden")+'>');
home=home.replace('id="emptyCatalog" class="empty-state" hidden','id="emptyCatalog" class="empty-state"'+(products.length?" hidden":""));
put(path.join(OUT,"index.html"),home);
function header(){return '<header class="site-header"><div class="container header-inner"><a class="brand-logo" href="/"><img src="/assets/ototurbo.png" alt="OtoTurbo.com.tr" width="184" height="65"></a><nav class="main-nav"><a href="/#katalog">Turbo kataloğu</a><a href="/#markalar">Araç markaları</a><a href="/#blog">Blog</a><a href="/#sss">SSS</a></nav><div class="header-actions"><a class="btn btn-wa" href="https://wa.me/905537383806">WhatsApp</a><a class="btn btn-outline" href="tel:+905537383806">0553 738 38 06</a></div></div></header>'}
function footer(){return '<footer class="footer"><div class="container footer-grid"><div><a href="/"><img src="/assets/ototurbo.png" alt="OtoTurbo.com.tr" width="160"></a><p>Serhat Mah. 1126. Cad. No: 14<br>Yenimahalle / Ankara</p><a href="tel:+905537383806">0553 738 38 06</a></div><div><h3>Site</h3><a href="/#katalog">Turbo kataloğu</a><a href="/#blog">Blog</a><a href="/#sss">SSS</a></div><div><h3>Sipariş bilgileri</h3><a href="/teslimat.html">Teslimat ve kargo</a><a href="/iade-degisim.html">İade ve değişim</a><a href="/mesafeli-satis.html">Mesafeli satış</a><a href="/iletisim.html">İletişim</a></div><div><h3>Yasal</h3><a href="/kvkk.html">KVKK</a><a href="/gizlilik.html">Gizlilik</a><a href="/cerez-politikasi.html">Çerez politikası</a></div></div><div class="footer-bottom"><div class="container">© '+new Date().getFullYear()+' OtoTurbo.com.tr. Fiyat bilgisi için telefon veya WhatsApp.</div></div></footer><a class="floating-wa" href="https://wa.me/905537383806" aria-label="WhatsApp">WA</a>'}
function shell(title,description,route,body,schema){return '<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(title)+'</title><meta name="description" content="'+esc(description)+'"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"><link rel="canonical" href="'+esc(url(route))+'"><link rel="icon" href="/assets/ototurbo.png"><link rel="stylesheet" href="/styles.css"><meta property="og:type" content="website"><meta property="og:title" content="'+esc(title)+'"><meta property="og:description" content="'+esc(description)+'"><meta property="og:url" content="'+esc(url(route))+'">'+(schema?'<script type="application/ld+json">'+JSON.stringify(schema).replace(/</g,"\\\\u003c")+'</script>':"")+'</head><body>'+header()+body+footer()+'</body></html>'}
for(const p of products){
 const route="/urun/"+p.slug+"/";
 const desc=p.metaDescription||p.shortDescription||p.title+" için sıfır turbo ürün bilgileri ve uyumluluk desteği.";
 const image=p.image?url("/assets/"+path.basename(p.image)):null;
 const compat=Array.isArray(p.compatibility)?p.compatibility:[];
 const specs=[["Araç markası",p.vehicleBrand],["Araç modeli",p.vehicleModel],["Motor bilgisi",p.engine],["Turbo markası",p.turboBrand],["Turbo numarası",p.turboCode]].filter(x=>x[1]).map(x=>'<div class="spec-item"><span>'+esc(x[0])+'</span><strong>'+esc(x[1])+'</strong></div>').join("");
 const seo=p.seoContent?'<details><summary>Detaylı ürün açıklaması ve SEO rehberi</summary>'+String(p.seoContent).split(/\n\s*\n/).map(s=>'<p>'+esc(s)+'</p>').join("")+'</details>':"";
 const body='<section class="detail-hero"><div class="container"><p class="breadcrumbs"><a href="/">Ana sayfa</a> / <a href="/#katalog">Turbo kataloğu</a> / '+esc(p.title)+'</p><p class="eyebrow">SIFIR TURBO KATALOĞU</p><h1>'+esc(p.title)+'</h1><p class="detail-lead">'+esc(p.shortDescription||desc)+'</p></div></section><section class="container detail-main"><div class="product-detail-layout"><div class="detail-product-image'+(image?"":" no-image")+'">'+(image?'<img src="/assets/'+esc(path.basename(p.image))+'" alt="'+esc(p.imageAlt||p.title)+'" width="800" height="800">':"")+'</div><div><p class="eyebrow">'+esc([p.vehicleBrand,p.vehicleModel].filter(Boolean).join(" · "))+'</p><h2>'+esc(p.title)+'</h2><p class="detail-lead">'+esc(p.description||desc)+'</p><div class="detail-specs">'+specs+'</div><div class="detail-contact"><a class="btn btn-wa" href="https://wa.me/905537383806?text='+encodeURIComponent("Merhaba, "+p.title+" ürünü hakkında bilgi almak istiyorum.")+'">WhatsApp ile ürün sor</a><a class="btn btn-outline" href="tel:+905537383806">0553 738 38 06</a></div><p class="catalog-note">Sitede fiyat bilgisi yayımlanmamaktadır. Sipariş öncesi parça numarası ve uyumluluğu teyit ediniz.</p></div></div><div class="detail-copy"><h2>Ürün hakkında</h2><p>'+esc(p.description||desc)+'</p>'+(compat.length?'<h2>Araç uyumluluğu</h2><ul>'+compat.map(c=>'<li>'+esc(c)+'</li>').join("")+'</ul>':"")+seo+'<h2>Montaj öncesi kontrol</h2><p>Turbo değişiminden önce arızanın temel nedeni, yağ besleme hattı, hava filtresi, intercooler ve ilgili bağlantılar kontrol edilmelidir. Montaj uzman servis tarafından yapılmalıdır.</p><div class="notice-box">Görseller ve teknik bilgiler bilgilendirme amaçlıdır. Motor kodu ve turbo referansı doğrulanmadan montaj yapmayınız.</div><a class="text-link" href="/#katalog">Turbo kataloğuna dön →</a></div></section>';
 const schema={"@context":"https://schema.org","@graph":[{"@type":"WebPage","url":url(route),"name":p.seoTitle||p.title,"description":desc,"inLanguage":"tr-TR"},{"@type":"Product","name":p.title,"description":desc,"category":"Otomotiv yedek parça > Turboşarj","url":url(route),...(image?{image:[image]}:{}),...(p.turboBrand?{brand:{"@type":"Brand","name":p.turboBrand}}:{}),...(p.turboCode?{sku:p.turboCode}:{})}]};
 put(path.join(OUT,"urun",p.slug,"index.html"),shell(p.seoTitle||p.title,desc,route,body,schema));
 records.push({path:route,priority:"0.85",freq:"monthly"});
}
for(const post of blog){
 const route="/blog/"+slug(post.slug)+"/";
 const sections=post.sections||[];
 const toc=sections.map((s,i)=>'<li><a href="#section-'+(i+1)+'">'+esc(s.heading)+'</a></li>').join("");
 const content=sections.map((s,i)=>'<section id="section-'+(i+1)+'"><h2>'+esc(s.heading)+'</h2><p>'+esc(s.body)+'</p></section>').join("");
 const body='<section class="detail-hero"><div class="container"><p class="breadcrumbs"><a href="/">Ana sayfa</a> / <a href="/#blog">Blog</a> / '+esc(post.title)+'</p><p class="eyebrow">OTO TURBO REHBERİ</p><h1>'+esc(post.title)+'</h1><p class="detail-lead">'+esc(post.description)+'</p></div></section><section class="container detail-main"><article class="article-body"><p class="muted">Yayın tarihi: '+esc(post.date||"2026-10-28")+'</p><div class="article-contents"><strong>Bu yazıda</strong><ul>'+toc+'</ul></div>'+content+'<div class="notice-box">Bu içerik genel bilgilendirme amaçlıdır; kesin arıza ve uyumluluk tespiti için uzman kontrolü gerekir.</div><a class="btn btn-wa" href="https://wa.me/905537383806">WhatsApp üzerinden destek alın</a></article></section>';
 const schema={"@context":"https://schema.org","@type":"Article","headline":post.title,"description":post.description,"datePublished":post.date||"2026-10-28","dateModified":post.date||"2026-10-28","inLanguage":"tr-TR","mainEntityOfPage":url(route),"author":{"@type":"Organization","name":"OtoTurbo.com.tr"}};
 put(path.join(OUT,"blog",slug(post.slug),"index.html"),shell(post.title+" | OtoTurbo Blog",post.description,route,body,schema));
 records.push({path:route,priority:"0.7",freq:"monthly"});
}
const legal=[
 {slug:"teslimat",title:"Teslimat ve Kargo Bilgileri",content:"Stokta bulunan ürünler aynı gün kargoya verilir. Depoda veya tedarikçide bulunan ve temin edilmesi gereken ürünler en geç 3 iş günü içinde kargoya verilir. Bu süre kargoya teslim süresidir; taşıyıcının teslimat süresi ayrıca değişebilir. Sipariş öncesinde stok ve tedarik durumunu 0553 738 38 06 numarasından teyit edin."},
 {slug:"iade-degisim",title:"İade ve Değişim Koşulları",bullets:["Ürün kullanılmamış, montaj yapılmamış ve tekrar satışa uygun durumda olmalıdır.","Ürünün orijinal ambalajı, aksesuarları ve varsa garanti belgeleri eksiksiz olmalıdır.","Ürün üzerinde darbe, kırık, çizik, yağlanma, bağlantı izi veya montaj izi bulunmamalıdır.","Turbo numarası, araç uyumluluğu ve ürün tipi kontrol edilmeden montaj yapılmamalıdır.","Montajı yapılmış veya kullanılmış ürünlerde iade ve değişim talepleri teknik inceleme sonucuna göre değerlendirilir.","Özel sipariş, araç bilgisine göre temin edilen veya müşteri talebine göre hazırlanan ürünlerde süreç yürürlükteki mevzuat kapsamında ayrıca değerlendirilir."],content:"Bu koşullar tüketicilerin yürürlükteki mevzuattan doğan emredici haklarını sınırlandırmaz. İade veya değişim talebinden önce 0553 738 38 06 numarasından iletişime geçin."},
 {slug:"kvkk",title:"KVKK Aydınlatma Metni",content:"Telefon veya WhatsApp üzerinden iletişim kurmanız halinde ad-soyad, telefon, adres, sipariş ve talep bilgileri ile tarafınızca paylaşılan araç/ürün bilgileri talebinizi yanıtlamak ve sipariş süreçlerini yürütmek için işlenebilir. Gereken asgari bilgiler lojistik sağlayıcıları veya yetkili kurumlarla paylaşılabilir. Veri sorumlusunun tam yasal unvanı, başvuru iletişim kanalı, saklama süreleri ve gerçek veri işleme süreçleri yayından önce işletme bilgilerine göre tamamlanmalıdır. KVKK kapsamındaki yasal haklarınız saklıdır."},
 {slug:"gizlilik",title:"Gizlilik Politikası",content:"Telefon ve WhatsApp üzerinden paylaştığınız bilgiler ürün uyumluluğu, sorularınız ve sipariş süreçleri için kullanılabilir. WhatsApp ve Google Haritalar gibi dış hizmetlere geçtiğinizde ilgili platformların gizlilik koşulları geçerli olabilir. İşletmede analiz, reklam veya başka üçüncü taraf servisler kullanılırsa bu metin yayından önce buna göre güncellenmelidir."},
 {slug:"cerez-politikasi",title:"Çerez Politikası",content:"Bu statik site sürümünde katalog arama ve filtreleme için reklam veya analiz çerezleri eklenmemiştir. WhatsApp ve Google Haritalar gibi dış bağlantıları açtığınızda ilgili platformların çerez politikaları uygulanabilir. İleride analiz veya reklam hizmeti eklenirse gerekli bilgilendirme ve izin düzenlemeleri yayın öncesi yapılandırılmalıdır."},
 {slug:"mesafeli-satis",title:"Mesafeli Satış Bilgilendirmesi",content:"Bu sürüm ürün tanıtımı ve telefon/WhatsApp üzerinden bilgi alma amacıyla hazırlanmıştır; sepet ve çevrimiçi ödeme özelliği bulunmamaktadır. Sipariş öncesinde ürünün tanımı, satış bedeli, teslimat ve ödeme koşulları alıcıya ayrıca bildirilmelidir. Mesafeli satış gerçekleştiğinde yürürlükteki mevzuatın gerektirdiği ön bilgilendirme ve sözleşme koşulları tüketiciye sunulmalıdır."},
 {slug:"iletisim",title:"İletişim",content:"Telefon: 0553 738 38 06. WhatsApp üzerinden aynı numaradan iletişim kurabilirsiniz. Adres: Serhat Mah. 1126. Cad. No: 14, Yenimahalle / Ankara. Ürün uyumluluğu için araç markası, model yılı, motor kodu ve eski turbonun referans numarasını paylaşmanız faydalı olur."}
];
for(const item of legal){
 const route="/"+item.slug+"/";
 const flatRoute="/"+item.slug+".html";
 const content=(item.bullets?'<ul>'+item.bullets.map(t=>'<li>'+esc(t)+'</li>').join("")+'</ul>':"")+'<p>'+esc(item.content)+'</p>';
 const body='<section class="detail-hero"><div class="container"><p class="breadcrumbs"><a href="/">Ana sayfa</a> / '+esc(item.title)+'</p><p class="eyebrow">OTOTURBO.COM.TR</p><h1>'+esc(item.title)+'</h1></div></section><section class="container detail-main"><article class="legal-content">'+content+'<div class="notice-box">Bu bilgilendirme sayfası işletmenin gerçek satış ve veri işleme süreçlerine göre yayından önce kontrol edilmelidir. Tüketicilerin yasal hakları saklıdır.</div><a class="text-link" href="/">Ana sayfaya dön →</a></article></section>';
 const description=item.title+" hakkında OtoTurbo.com.tr bilgilendirmesi.";
 put(path.join(OUT,item.slug,"index.html"),shell(item.title+" | OtoTurbo.com.tr",description,flatRoute,body,null));
 put(path.join(OUT,item.slug+".html"),shell(item.title+" | OtoTurbo.com.tr",description,flatRoute,body,null));
 records.push({path:flatRoute,priority:"0.3",freq:"yearly"});
}
const now=new Date().toISOString().slice(0,10);
put(path.join(OUT,"robots.txt"),"User-agent: *\nAllow: /\n\nSitemap: "+BASE+"/sitemap.xml\n");
put(path.join(OUT,"sitemap.xml"),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+records.map(r=>'<url><loc>'+esc(url(r.path))+'</loc><lastmod>'+now+'</lastmod><changefreq>'+r.freq+'</changefreq><priority>'+r.priority+'</priority></url>').join("\n")+'\n</urlset>\n');
const fallbackBody='<section class="container not-found"><h1>Sayfa bulunamadı</h1><p>İlgili sayfa için yönlendirme kontrol ediliyor.</p><a class="btn btn-wa" href="/">Ana sayfaya dön</a></section><script>const aliases={"/kvkk/":"/kvkk.html","/kvkk":"/kvkk.html","/gizlilik/":"/gizlilik.html","/gizlilik":"/gizlilik.html","/cerez-politikasi/":"/cerez-politikasi.html","/cerez-politikasi":"/cerez-politikasi.html","/teslimat/":"/teslimat.html","/teslimat":"/teslimat.html","/iade-degisim/":"/iade-degisim.html","/iade-degisim":"/iade-degisim.html","/mesafeli-satis/":"/mesafeli-satis.html","/mesafeli-satis":"/mesafeli-satis.html","/iletisim/":"/iletisim.html","/iletisim":"/iletisim.html"};if(aliases[location.pathname])location.replace(aliases[location.pathname]);</script>';
put(path.join(OUT,"404.html"),shell("Sayfa bulunamadı | OtoTurbo.com.tr","Aradığınız sayfa bulunamadı.","/404.html",fallbackBody,null));
console.log("Build tamamlandı: "+products.length+" ürün, "+blog.length+" blog, "+legal.length+" bilgilendirme sayfası; sitemap "+records.length+" URL.");
const missing=ASSETS.filter(f=>!fs.existsSync(path.join(OUT,"assets",f)));
if(missing.length)console.warn("Eksik görseller: "+missing.join(", "));
