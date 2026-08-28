# Composer Portfolio

Ulvin Najafov'un eserleri, kayıtları ve notaları için hazırlanmış Next.js portfolyosu. Görsel yön; koyu editoryal yüzeyler, pirinç ve bordo vurgular, GSAP destekli kaydırma hareketleri ve React Three Fiber ile gerçek zamanlı bir rezonans sahnesi kullanır.

## Teknoloji

- Next.js 16 App Router, React 19 ve TypeScript
- Tailwind CSS 4
- GSAP ve ScrollTrigger
- Three.js, React Three Fiber ve Drei
- Zod ile sunucu tarafı doğrulama
- Resend ile iletişim ve bülten e-postaları
- Vercel Analytics ve Speed Insights
- npm workspaces tabanlı Better-T-Stack düzeni

## Medya mimarisi

- Görseller ve PDF notalar: repository içindeki `public/images` ve `public/scores`
- Ses kayıtları: public Backblaze B2 bucket
- Bucket tabanı: `https://f003.backblazeb2.com/file/composer-portfolio`

Sesler public URL ile salt okunur sunulduğu için uygulamanın B2 API anahtarına ihtiyacı yoktur. Yükleme, silme veya private bucket erişimi eklenecekse bu işlemler yalnızca sunucu tarafında ve ayrı B2 kimlik bilgileriyle uygulanmalıdır.

`scripts/ensure-public-link.mjs`, geliştirme ve derleme öncesinde kökteki `public` klasörünü `apps/web/public` konumuna bağlar. Windows'ta junction, diğer sistemlerde symlink kullanılır.

## Yerel geliştirme

Gereksinimler: güncel Node.js 22 LTS ve npm 11.

```bash
npm install
npm run dev
```

Uygulama varsayılan olarak [http://localhost:3000](http://localhost:3000) adresinde açılır.

## Ortam değişkenleri

`apps/web/.env.local` oluşturun. Örnek değerler `apps/web/.env.example` dosyasındadır.

```dotenv
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Portfolio <onboarding@resend.dev>
RESEND_TO_EMAIL=hello@example.com
CONTACT_EMAIL=hello@example.com
```

`RESEND_TO_EMAIL` tanımlanmazsa iletişim formu `CONTACT_EMAIL` değerini kullanır. Bu değerler olmadan proje yine derlenir, ancak formlar kontrollü biçimde `503` döndürür ve e-posta göndermez.

## Komutlar

```bash
npm run check-types
npm run lint
npm run build
npm audit
```

Vercel CLI ile önizleme veya üretim dağıtımı:

```bash
npm run deploy
npm run deploy:prod
```

Vercel CLI proje bağımlılığı değildir. Dağıtım komutları güncel CLI'ı `npx` üzerinden çağırır.

## Proje yapısı

```text
apps/web/                 Next.js uygulaması
  src/app/                Sayfalar ve API route handler'ları
  src/components/         Arayüz, hareket ve 3D bileşenleri
  src/lib/                Eser verisi ve yardımcılar
packages/config/          Paylaşılan TypeScript ayarları
packages/env/             Doğrulanmış ortam değişkenleri
public/images/            Yerel görseller
public/scores/            Yerel PDF notalar
scripts/                  Workspace yardımcıları
```

## Güvenlik

İletişim uçları aynı kaynak kontrolü, sıkı Zod şemaları, gövde boyutu sınırı, honeypot ve oran sınırlama uygular. HTTP güvenlik başlıkları Next.js yapılandırmasında merkezi olarak tanımlanır. Yerel inceleme kapsamı ve kalan riskler `SECURITY_REVIEW.md` içindedir.

## Dağıtım

Repository Vercel'e bağlandığında kökteki `vercel.json`, `apps/web` servisini ve workspace kurulum komutunu seçer. Üretim öncesinde Resend değişkenlerini Vercel proje ayarlarına ekleyin, alan adını Resend'de doğrulayın ve formları gerçek alıcıyla test edin.

Bu proje özeldir ve açık kaynak lisansı altında dağıtılmaz.
