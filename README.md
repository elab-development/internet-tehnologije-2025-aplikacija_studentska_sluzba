# Studentska Služba FON: Aplikacija za elektronsko podnošenje i obradu zahteva studenata

## Opis projekta

Studentska Služba FON je web aplikacija razvijena u Next.js framework-u sa MySQL bazom podataka, namenjena studentima i zaposlenima Fakulteta organizacionih nauka. Aplikacija omogućava elektronsko podnošenje zahteva prema studentskoj službi, praćenje statusa obrade i generisanje PDF dokumenata.

## Preduslovi za instalaciju

Preporučena minimalna konfiguracija: CPU 1.5GHz, 4GB RAM, 2GB slobodnog prostora na disku.

Potreban softver:
- Docker Desktop (verzija 4.0 ili novija)
- Git
- Web browser (Chrome, Firefox, Edge)
- Internet konekcija (potrebna za eksterne API-je)

## Instalacija

1. Klonirajte repozitorijum:
bash
git clone https://github.com/VAS_USERNAME/internet-tehnologije-2025-aplikacija_studentska_sluzba.git
cd internet-tehnologije-2025-aplikacija_studentska_sluzba


2. Napravite .env fajl u root folderu i dodajte:
env
DATABASE_URL=mysql://root:password@db:3306/studentska_sluzba
JWT_SECRET=vas_tajni_kljuc


3. Pokrenite aplikaciju:
bash
docker-compose up --build


4. Sačekajte da se u terminalu pojavi poruka ✓ Ready in Xs, a zatim u novom terminalu pokrenite seed baze:
bash
docker-compose exec app npm run db:seed


5. Otvorite browser i idite na http://localhost:3000

Za zaustavljanje aplikacije koristite:
bash
docker-compose down


## Način upotrebe

Nakon pokretanja aplikacije, dostupni su sledeći test nalozi:

| Uloga | Email | Lozinka |
|-------|-------|---------|
| Student | student@student.fon.bg.ac.rs | student123 |
| Osoblje | staff@fon.bg.ac.rs | staff123 |
| Admin | admin@fon.bg.ac.rs | admin123 |


### Osnovni tok korišćenja:

*Kao student:*
- Prijavite se sa studentskim nalogom
- Kliknite "Podnesi novi zahtev" i izaberite tip zahteva
- Pratite status zahteva na svojoj stranici
- Kada je zahtev odobren, generišite PDF dokument klikom na "Generiši i preuzmi PDF"

*Kao osoblje:*
- Prijavite se sa nalogom osoblja
- Pregledajte pristigle zahteve studenata
- Promenite status zahteva (odobrite, odbijte ili označite kao završen)
- Dodajte napomenu ako je potrebno

*Kao admin:*
- Prijavite se sa admin nalogom
- Na dashboard-u vidite statistike sistema i grafike
- Pregledajte sve zahteve i pristupite API dokumentaciji

### Pokretanje testova:
bash
docker-compose exec app npm run test


### API dokumentacija:
Swagger dokumentacija je dostupna na http://localhost:3000/api-docs nakon pokretanja aplikacije.

## Tehnologije korišćene u projektu

- *Next.js 16* — fullstack React framework sa App Router-om
- *TypeScript* — tipiziran JavaScript
- *Drizzle ORM* — ORM za rad sa MySQL bazom
- *MySQL 8.0* — relaciona baza podataka
- *Tailwind CSS* — CSS framework za stilizovanje
- *Docker* — kontejnerizacija aplikacije i baze
- *pdf-lib* — generisanje PDF dokumenata
- *Chart.js* — vizualizacija podataka kroz grafike
- *Vitest* — automatizovani testovi
- *GitHub Actions* — CI/CD pipeline
- *Swagger* — API dokumentacija

### Eksterni API-ji:
- *Nager.Date API* — dohvata državne praznike za Srbiju (prikazuje se na početnoj stranici)
- *goqr.me API* — generiše QR kodove za verifikaciju dokumenata

## Struktura projekta

src/
├── app/
│   ├── (admin)/admin/          — admin dashboard
│   ├── (public)/               — početna stranica
│   ├── (staff)/staff/          — stranica za osoblje
│   ├── (student)/student/      — stranica za studente
│   ├── api/
│   │   ├── auth/               — prijava, registracija, odjava
│   │   ├── documents/generate/ — generisanje PDF-a
│   │   ├── holidays/           — eksterni API za praznike
│   │   ├── qrcode/             — eksterni API za QR kodove
│   │   ├── requests/           — CRUD operacije nad zahtevima
│   │   ├── request-types/      — tipovi zahteva
│   │   └── stats/              — statistike za dashboard
│   ├── login/                  — stranica za prijavu
│   └── register/               — stranica za registraciju
├── components/                 — React komponente (widgeti, forme)
├── db/                         — šema baze, konekcija, seed
└── lib/                        — pomoćne funkcije (security, swagger)


## Git strategija

Koristili smo sledeću strategiju grananja:
- main — stabilna verzija aplikacije
- develop — integraciona grana za testiranje pre merge-a u main
- feature/swagger-security — grana za Swagger, bezbednost, testove i CI/CD
- feature/external-apis — grana za eksterne API-je, vizualizaciju i README
- feature/homepage-docs — grana za početnu stranicu, PDF generisanje i admin dashboard

Svaka feature grana se po završetku merge-uje u develop, a develop u main.

## Bezbednost

Aplikacija je zaštićena od sledećih napada:
- *Rate Limiting* — ograničava broj zahteva na 100 po IP adresi u 15 minuta (zaštita od brute force napada)
- *XSS zaštita* — sanitizacija korisničkog unosa, uklanjanje HTML tagova
- *CORS* — pristup API-ju dozvoljen samo sa odobrenih domena
- *Security Headers* — zaštita od clickjacking-a i MIME type sniffing-a


## Autori

- Milica Bijanić 2022/0339
- Marija Domanović 2022/0165
- Dejana Veskov 2022/0327

Studenti Fakulteta organizacionih nauka, Univerzitet u Beogradu.
