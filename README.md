# Nockebyhovs Båtklubb

Minimalistisk, responsiv webbplats på svenska med ljust och mörkt läge. Byggd med HTML, CSS och JavaScript utan externa beroenden.

## Kör lokalt

Kräver Node.js 20 eller senare. Ingen installation av paket behövs.

```sh
npm run dev
```

Öppna http://localhost:4173. Valfri port: `PORT=4174 npm run dev`.

```sh
npm run check
npm run build
npm run check:pages
npm start
```

`dist/` kan publiceras hos valfri statisk webbhost. Varje sida har en egen HTML-fil och adress: `/`, `/klubben/`, `/aktuellt/`, `/dokument/`, `/medlem/` och `/kontakt/`. Alla sex sidor finns i huvudmenyn. Gamla `.html`-adresser och tidigare `#`-länkar leder vidare till motsvarande nya sida. Dokumentfilter använder vanliga frågeparametrar, exempelvis `/dokument/?filter=Milj%C3%B6`.

## Innehåll

Information, kontaktuppgifter, formulärfält, 20 dokument (19 dokument från dokumentarkivet samt årsplaneringen) och 10 bilder hämtades från https://nockebyhovsbatklubb.se/ den 18 november 2026. Dokumentens ursprungsadresser finns i `assets/documents.json`. Alla filer ligger lokalt så att dokument och bilder fungerar utan den gamla webbplatsen.

Sommarhälsningen är märkt **2026** enligt källan. Ingen ny information om avgifter, lediga platser eller nya händelser har hittats på. Avgifter, styrelse och regler bevaras i originaldokumenten. Bilder tillhör ursprungliga rättighetshavare. Webbansvarig: Kjell Berlin, enligt originalwebbplatsen.

Vimpeln bygger på den tillhandahållna filen `Wave 12 – Fine ripple.svg`. Originalet finns i `assets/vimpel-original.svg`. Ljus variant behåller originalets färger; mörk variant har vit vimpel med svarta bokstäver. Bakgrunden är transparent och sidhuvudet centrerar logotypen oberoende av navigationens bredd.

## Formulär

Kontakt och medlemsansökan valideras i webbläsaren och förbereder ett e-postutkast till `info@nockebyhovsbatklubb.se`. Besökaren öppnar och skickar utkastet själv. Ett alternativ kopierar texten för webbaserad e-post. Webbplatsen påstår aldrig att något har skickats. Uppgifter lagras inte i localStorage eller på en server. Formuläret kräver inga hemligheter eller tredjepartstjänster. Automatisk leverans direkt från webbplatsen kräver separat backend och en bekräftad e-posttjänst.

## Tillgänglighet

Semantiska sektioner, tangentbordsnavigation, synlig fokusmarkering, länk för att hoppa till innehållet, skärmläsaretiketter, dialog för bilder och stöd för minskad rörelse. Menyn och färgtemaknappen ligger under vimpeln på både stor och liten skärm. Färgtemat följer systemet tills användaren väljer själv och sparas sedan lokalt.
