# Fateful Moment

Karar simülasyonu uygulaması "Fateful Moment"in React Native (Expo) ile yapılmış arayüz klonu. Backend yok, uygulama dummy verilerle çalışıyor.

**Akış:** Giriş / kayıt → senaryo listesi → briefing → giriş videosu → 15 saniyelik ilk karar turu → her seçeneğin videosu → Decision DNA. Auth ekranları dikey, ana akış yatay.

## Ekran kayıtları

**Android**

https://github.com/user-attachments/assets/e7c9e332-27df-4021-ad13-dde83ba69022

## APK

Son sürüm: [Releases](https://github.com/zamazincode/fateful-moment/releases)

## Kurulum

Gereksinimler: Node, [Bun](https://bun.sh), Android için Android Studio SDK'sı, iOS için Xcode (macOS).

```bash
bun install
bunx expo run:android   # ya da: bunx expo run:ios
```

Uygulama native modüller kullandığı için (video, ses, gezinme çubuğu) Expo Go yerine development build ile çalışıyor. `android/` ve `ios/` klasörleri `app.json`'dan üretiliyor, repoda yok.

```bash
bunx jest            # testler
bunx tsc --noEmit    # tip kontrolü
bunx expo lint       # lint
```

Kayıt olmadan denemek için açılış ekranındaki Apple / Google butonları demo kullanıcıyla oturum açıyor.

## Teknolojiler

Expo SDK 57, Expo Router, TypeScript, expo-video, expo-audio, expo-secure-store, expo-file-system, react-native-svg, Zod, Jest + React Native Testing Library.

## AI araçları ve yaklaşım

**Kullanılan araçlar**

- **Claude Code (Opus)**: Bileşenler, ekranlar, testler ve genel akış için kullanıldı.
- **Figma MCP**: Style guide'daki renk, tipografi ve spacing token'larını `src/theme/`'e çekmek için kullanıldı.
- **Expo plugin, skills ve docs MCP**: Expo her SDK'da API değiştirdiği için kod SDK 57'nin kendi dokümanına göre yazıldı, modelin hafızasına göre değil.
- **codebase-memory-mcp**: Kod tabanında hızlı arama için.

**Süreci nasıl yönettim**

- **Tasarım ekran ekran:** Figma MCP kotası style guide'dan sonra bittiği için her ekranın görüntüsünü tek tek verdim. Renkler ve ölçüler görsellerden piksel ölçümüyle alınıp tema token'larına eşlendi. Tema sabit tutuldu, yeni token eklenmedi.
- **Akışı ben tarif ettim:** Görüntüler simülasyon akışını anlatmadığı için orijinal uygulamayı inceleyip akışı yazılı olarak verdim. Belirsiz noktalarda (metin hataları, bilinmeyen davranışlar) AI koda geçmeden soru sordu.
- **Kalıcı bağlam:** Kurallar (tema, asset, test, commit) AI'ın hafızasında tutuldu, böylece her yeni oturum aynı kurallarla devam etti. Her mimari karar gerekçesiyle birlikte bir karar günlüğüne yazıldı. Bu README o günlükten özetlendi.
- **Test:** Önemli her bileşen, ekran ve servis için test yazıldı (`__tests__/`, 290+ test).
- Commit'leri ben attım, cihaz testlerini fiziksel bir Android telefonda ben yaptım. AI her işi tip kontrolü, lint ve testler geçmeden bitmiş saymadı. Yapılan her değişiklik sonrası kodu inceledim ve düzenlenmesi gereken yerleri düzelttirip onayladım.

## Önemli kararlar

- **Korumalı route grupları:** `(auth)` ve `(app)` grupları kök layout'ta `Stack.Protected` ile oturuma bağlı. Yön de grup bazında: `(auth)` dikey, `(app)` yatay (Expo Router `orientation`).
- **Yerel hesaplar:** Kayıt olunan hesaplar `expo-secure-store`'da (Keychain / Keystore). Şifre saklanmıyor, SHA-256 hash'i saklanıyor. Servis katmanı ekranlardan ayrı, gerçek bir API'ye geçmek için bir dosyayı değiştirmek yeterli.
- **Simülasyon saf bir reducer:** Akış (`briefing → video → karar turu → … → DNA`) `src/lib/simulation.ts`'de; zamanlayıcı, video ve navigasyondan bağımsız test ediliyor. Simülasyon tek route'ta, adımlar geri tuşu geçmişine girmiyor.
- **Veri ayrı, ekranlar değişmeden kalıyor:** Senaryo metinleri ve medyası ayrı tanımlı. Decision DNA şimdilik demo veri gösteriyor; ileride seçimlerin bir AI analizine gönderilip DNA'nın oradan gelmesini istediğimizde, ekran değişmeden yalnızca veri kaynağı değişecek. Radar grafiği dinamik olarak verilere göre değişebilir şekilde geliştirildi.
- **Küçük assetler:** Görseller WebP'ye çevrildi (senaryo görselleri 2.0 MB → 254 KB, avatarlar 17 MB → ~220 KB).
- **Deneyim:** Müzik listede ve briefing'de çalıyor. Simülasyon boyunca susuyor, bitince yalnızca önceden açıksa geri geliyor. Habtics ile kullanıcı deneyimi arttırılması hedeflendi ve ayarlara kapatma seçeneği eklendi.

## Notlar

- Decision DNA içeriği demo veri; kullanıcının seçimlerinden henüz hesaplanmıyor.
- Şimdilik yalnızca bir senaryonun (Irak Savaşı) görsel ve videoları var; altı senaryonun hepsi bu medyayı kullanıyor.
- Settings sayfasının tasarımı yoktu; uygulamanın mevcut görsel diliyle kuruldu.
- Şifre sıfırlama gerçek e-posta göndermiyor, yalnızca onay ekranını gösteriyor.
- Apple cihazım olmadığından uygulama iOS ortamında test edilemedi.
- Müzikler [Pixabay](https://pixabay.com)'den: "Doomed Romance" (Geoff Harvey) ve "There Must Be A Way Out Of This" (UniqueCreativeAudio).
