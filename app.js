const icons = {
  moon: '<path d="M20.5 13A8.5 8.5 0 0 1 11 3.5 8.5 8.5 0 1 0 20.5 13Z"/>',
  sun: '<circle cx="12" cy="12" r="3.5"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  file: '<path d="M14 2H5v20h14V7l-5-5Z"/><path d="M14 2v5h5M8 12h8m-8 4h6"/>',
  leaf: '<path d="M20 3C8 2 2 9 6 16c7 5 14-1 14-13Z"/><path d="M4 21 15 10"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',
};
const icon = (name) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || ''}</svg>`;
const arrow = '<span aria-hidden="true">↗</span>';
const escapeHTML = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const mapURL = 'https://www.google.com/maps/search/?api=1&query=Nockebyhovs+B%C3%A5tklubb+Gr%C3%B6nviksv%C3%A4gen+192+Bromma';
const main = document.querySelector('main');
const themeToggle = document.querySelector('.theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const photoDialog = document.querySelector('#photo-dialog');
document.querySelector('.skip-link').addEventListener('click', e => {
  e.preventDefault();
  main.focus({ preventScroll: true });
  main.scrollIntoView({ block: 'start' });
});
let documents = [];
let documentError = false;
let currentView = '';

function updateThemeButton() {
  const dark = document.documentElement.dataset.theme === 'dark';
  themeToggle.innerHTML = icon(dark ? 'sun' : 'moon');
  themeToggle.setAttribute('aria-label', `Byt till ${dark ? 'ljust' : 'mörkt'} läge`);
  themeToggle.setAttribute('aria-pressed', String(dark));
  document.querySelector('meta[name="theme-color"]').content = dark ? '#141b17' : '#f7f8f4';
}
themeToggle.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('nbk-theme', next); } catch { /* Theme still works when storage is unavailable. */ }
  updateThemeButton();
});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  let saved;
  try { saved = localStorage.getItem('nbk-theme'); } catch {}
  if (!saved) { document.documentElement.dataset.theme = e.matches ? 'dark' : 'light'; updateThemeButton(); }
});
updateThemeButton();
document.querySelector('#year').textContent = new Date().getFullYear();

function closeMenu() {
  mobileNav.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Öppna menyn');
}
menuToggle.addEventListener('click', () => {
  const open = mobileNav.hidden;
  mobileNav.hidden = !open;
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Stäng menyn' : 'Öppna menyn');
});
mobileNav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menuToggle.focus(); }
});
matchMedia('(min-width: 761px)').addEventListener('change', e => { if (e.matches) closeMenu(); });

const photos = [
  ['20200910_201942.jpg', 'Kvällsljus över hamnen'],
  ['20200910_132642.jpg', 'Livet längs bryggan'],
  ['20200910_202151.jpg', 'När dagen går mot kväll'],
  ['20200910_132306.jpg', 'En stund vid vattnet'],
  ['IMG_4664.JPG', 'Från vår plats i Bromma'],
  ['20200910_133006.jpg', 'Båtar och bryggor'],
  ['2017-livrboj.jpg', 'Trygghet på bryggan'],
  ['20220806_133221.jpg', 'Vår hamn från ovan'],
];

function homeView() {
  return `<div class="wrap">
    <section class="hero" aria-labelledby="hero-title">
      <p class="hero-location eyebrow"><span class="dot" aria-hidden="true"></span> NOCKEBYHOV, BROMMA <span aria-hidden="true">&nbsp; / &nbsp;</span> 59°19.7′ N &nbsp; 17°54.6′ E</p>
      <div class="hero-intro"><h1 id="hero-title">En plats vid vattnet.<br><em>En paus från allt annat.</em></h1><div class="hero-copy"><p>Välkommen till Nockebyhovs Båtklubb.<br>För båtlivet, gemenskapen och de där<br>stunderna som gärna får ta lite längre tid.</p><a class="text-link" href="#klubben">Lär känna vår klubb ${arrow}</a></div></div>
      <figure class="hero-image"><img src="/assets/photos/20220806_133221.jpg" width="2000" height="946" alt="Nockebyhovs båtklubbs bryggor och båtar, omgivna av vatten och grönska" fetchpriority="high"><figcaption class="image-caption"><div><p class="eyebrow">EN LITEN HAMN. MYCKET ATT TYCKA OM.</p><p>Grönviksvägen 192, Bromma</p></div><span class="compass" aria-hidden="true">↗</span></figcaption></figure>
      <nav class="quick-links" aria-label="Snabbval"><a class="quick-link" href="#medlem"><div><h2>En plats för din båt</h2><p>Medlemskap & båtplats</p></div><span class="arrow" aria-hidden="true">↗</span></a><a class="quick-link" href="#dokument"><div><h2>Bra att ha till hands</h2><p>Dokument, regler & intyg</p></div><span class="arrow" aria-hidden="true">↗</span></a><a class="quick-link" href="#kontakt"><div><h2>Vi finns här</h2><p>Kontakt & hitta hit</p></div><span class="arrow" aria-hidden="true">↗</span></a></nav>
    </section>
    <section id="aktuellt" class="section section-split" aria-labelledby="news-title"><div class="section-heading"><p class="eyebrow">FRÅN KLUBBEN</p><h2 id="news-title">Livet kring<br>bryggan.</h2><p>Hälsningar, påminnelser och sådant som är bra att känna till.</p><a class="text-link" href="/assets/documents/arsplanering.pdf" target="_blank" rel="noopener noreferrer">Se klubbens årsplanering ${arrow}</a></div>
      <div class="news-list"><article class="news-item"><p class="eyebrow"><span class="status-dot" aria-hidden="true"></span> VIKTIG PÅMINNELSE</p><h3>Har du lämnat ditt båtbottenintyg?</h3><p>Lämna in intyget om båtbottenfärg och meddela klubben om du har bytt båt. Blanketten går att ladda ner och skriva ut.</p><a class="text-link" href="/assets/documents/intyg-om-batbottenfarg-for-utskrift.pdf" target="_blank" rel="noopener noreferrer">Hämta intyget ${arrow}</a></article>
      <article class="news-item"><p class="eyebrow">SOMMARHÄLSNING 2026</p><h3>Vi ses på bryggan.</h3><p>Klubbens sommarhälsning: kom ner för en grillkväll, ett dopp eller en kopp kaffe i kvällssolen. Bänken runt hörnet till vänster är ett fint tips för morgon- och förmiddagssol.</p></article>
      <article class="news-item"><p class="eyebrow">TRYGGHET I HAMNEN</p><h3>Kamerabevakning på plats</h3><p>Hamnen har övervakningskameror med hög upplösning. Vid inbrott eller skadegörelse kan inspelningar lämnas till polisen.</p><a class="text-link" href="/assets/documents/kamerabevakning.pdf" target="_blank" rel="noopener noreferrer">Om kamerabevakningen ${arrow}</a></article></div>
    </section>
  </div>
  <section id="klubben" class="section club-section" aria-labelledby="club-title"><div class="wrap club-grid"><img class="club-image" src="/assets/photos/20200910_132306.jpg" alt="Båtliv vid Nockebyhovs Båtklubb" loading="lazy" width="900" height="1000"><div class="club-copy"><p class="eyebrow muted">NOCKEBYHOVS BÅTKLUBB</p><h2 id="club-title">Nära staden.<br><em>Ännu närmare sjön.</em></h2><p>En brygga att komma tillbaka till. En plats för ett morgondopp, en kopp kaffe och samtal som fortsätter tills solen går ner.</p><p>Du hittar oss på Grönviksvägen 192 i Bromma. Vill du ha din båt här? Välkommen att skicka in en ansökan.</p><div class="club-facts"><div><strong>Grönviksvägen 192</strong><span>Bromma, Stockholm</span></div><div><strong>59°19.7′ N · 17°54.6′ E</strong><span>Här ligger vår hamn</span></div></div><a class="text-link" href="#medlem">Ansök om båtplats ${arrow}</a></div></div></section>
  <div class="wrap"><section class="environment" aria-labelledby="environment-title"><div><p class="eyebrow">OMTANKE OM VÅRT VATTEN</p><h2 id="environment-title">Ett finare båtliv<br><em>börjar under ytan.</em></h2></div><div class="environment-copy"><p>För att få en ny båtplats ska båten vara utan biocidhaltig bottenfärg och inte ha en tvåtaktsmotor med förgasare.</p><ul><li>Biocidfri bottenfärg eller en omålad båtbotten.</li><li>Intyg om båtbottenfärg lämnas till klubben.</li><li>Uppdatera dina uppgifter när du byter båt.</li></ul><a class="text-link" href="#dokument?filter=Milj%C3%B6">Läs mer i våra miljödokument ${arrow}</a></div></section>
  <section class="section" aria-labelledby="gallery-title"><div class="gallery-heading"><div><p class="eyebrow">SMÅ ÖGONBLICK FRÅN HAMNEN</p><h2 id="gallery-title">Här vill man stanna.</h2></div><div class="gallery-buttons"><button class="icon-button gallery-prev" aria-label="Föregående bilder">←</button><button class="icon-button gallery-next" aria-label="Nästa bilder">→</button></div></div><div class="gallery">${photos.map(([file, title], i) => `<figure><button class="photo-button" type="button" data-photo="${file}" data-caption="${title}" aria-label="Visa större bild: ${title}"><img src="/assets/photos/${file}" alt="${title}" loading="lazy" width="600" height="450"></button><figcaption><span>${title}</span><span>${String(i + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}</span></figcaption></figure>`).join('')}</div></section>
  <section class="join-banner"><div><p class="eyebrow">VÄLKOMMEN TILL NBK</p><h2>Ska vi ses på bryggan?</h2></div><a class="button" href="#medlem">Ansök om båtplats ${arrow}</a></section></div>`;
}

function pageIntro(label, eyebrow, title, description) {
  return `<section class="page-intro"><p class="breadcrumb"><a href="#hem">Startsida</a><span aria-hidden="true">/</span><span>${label}</span></p><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="intro-description">${description}</p></section>`;
}

function documentView() {
  const filters = ['Alla', 'Medlemskap', 'Hamn & säkerhet', 'Miljö', 'Klubben'];
  return `<div class="wrap">${pageIntro('Dokument', 'ALLT SAMLAT PÅ ETT STÄLLE', 'Bra att ha <em>till hands.</em>', 'Regler, blanketter och praktisk information för livet i klubben. Här hittar du alla dokument från NBK:s webbplats.')}<section aria-label="Dokumentarkiv"><div class="document-toolbar"><div class="filters" role="group" aria-label="Filtrera dokument">${filters.map((f, i) => `<button class="filter-button" type="button" data-filter="${escapeHTML(f)}" aria-pressed="${i === 0}">${escapeHTML(f)}</button>`).join('')}</div><label class="search-box"><span class="sr-only">Sök dokument</span>${icon('search')}<input type="search" id="document-search" placeholder="Sök bland dokumenten…" aria-label="Sök dokument"></label></div><p class="document-count" role="status" aria-live="polite"></p><div class="document-grid"></div></section><aside class="document-note">${icon('file')}<div><strong>Dags för båtbottenintyget?</strong><p>Ladda ner blanketten, skriv ut och fyll i den. <a href="/assets/documents/intyg-om-batbottenfarg-for-utskrift.pdf" target="_blank" rel="noopener noreferrer"><u>Hämta intyget här ↗</u></a></p></div></aside></div>`;
}

function setupDocuments(params) {
  let filter = params.get('filter') || 'Alla';
  if (!['Alla', 'Medlemskap', 'Hamn & säkerhet', 'Miljö', 'Klubben'].includes(filter)) filter = 'Alla';
  const search = document.querySelector('#document-search');
  const grid = document.querySelector('.document-grid');
  const normalize = s => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('sv');
  const update = () => {
    const query = normalize(search.value.trim());
    const matches = documents.filter(d => (filter === 'Alla' || d.category === filter) && normalize(d.title + ' ' + d.category).includes(query));
    document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === filter)));
    document.querySelector('.document-count').textContent = `${matches.length} av ${documents.length} dokument`;
    grid.innerHTML = documentError ? '<p class="no-results">Dokumentlistan kunde inte hämtas. <a href="https://nockebyhovsbatklubb.se/Dokument.html"><u>Öppna klubbens befintliga dokumentarkiv ↗</u></a></p>' : matches.length ? matches.map(d => `<a class="document-row" href="/${d.path}" target="_blank" rel="noopener noreferrer" aria-label="Öppna ${escapeHTML(d.title)}, ${d.type}, i ny flik"><span class="file-icon">${icon('file')}</span><span><span class="document-name">${escapeHTML(d.title)}</span><span class="document-meta">${escapeHTML(d.category)} &nbsp;·&nbsp; ${d.type} &nbsp;·&nbsp; ${formatSize(d.bytes)}</span></span><span class="arrow" aria-hidden="true">↗</span></a>`).join('') : '<p class="no-results">Inga dokument matchar din sökning. Prova ett annat sökord eller välj Alla.</p>';
  };
  document.querySelectorAll('[data-filter]').forEach(b => b.addEventListener('click', () => {
    filter = b.dataset.filter;
    history.replaceState(null, '', filter === 'Alla' ? '#dokument' : '#dokument?filter=' + encodeURIComponent(filter));
    update();
  }));
  search.addEventListener('input', update);
  update();
}

function formatSize(bytes) {
  return bytes < 1e6 ? `${Math.round(bytes / 1024)} kB` : `${(bytes / 1048576).toLocaleString('sv-SE', { maximumFractionDigits: 1 })} MB`;
}

function field(label, name, { type = 'text', required = true, full = false, placeholder = '', autocomplete = '', hint = '' } = {}) {
  const id = 'field-' + name;
  return `<div class="field ${full ? 'full' : ''}"><label for="${id}">${label}${required ? ' <span class="required">*</span>' : ''}</label><input id="${id}" name="${label}" type="${type}" ${required ? 'required' : ''} ${placeholder ? `placeholder="${placeholder}"` : ''} ${autocomplete ? `autocomplete="${autocomplete}"` : ''} maxlength="${type === 'email' ? 254 : 250}" ${hint ? `aria-describedby="hint-${name}"` : ''}>${hint ? `<small id="hint-${name}">${hint}</small>` : ''}</div>`;
}

function mailFormEnd(type) {
  return `<p class="form-note">Uppgifterna används för ditt ärende. Läs <a href="/assets/documents/gdpr-policy.pdf" target="_blank" rel="noopener noreferrer">klubbens dataskyddspolicy ↗</a>.</p><button class="button" type="submit">Förbered ${type === 'member' ? 'ansökan' : 'meddelande'} ${arrow}</button><p class="form-note" style="margin-top:14px">Nästa steg öppnar ett utkast i ditt e-postprogram. Du granskar och skickar det själv till klubben.</p><div class="form-status" role="status" hidden></div>`;
}

function memberView() {
  return `<div class="wrap">${pageIntro('Medlem & ansökan', 'EN PLATS FÖR DIG OCH DIN BÅT', 'Vi ses <em>på bryggan.</em>', 'Ansök om båtplats eller uppdatera dina medlemsuppgifter. Fyll i uppgifterna nedan, så förbereder vi ett e-postutkast till klubben.')}<div class="form-layout"><aside class="side-panel"><p class="eyebrow">INNAN DU ANSÖKER</p><h2>Lite att tänka på.</h2><p>Nya båtplatser erbjuds till båtar med biocidfri bottenfärg eller utan bottenfärg. Båten får inte ha en tvåtaktsmotor med förgasare.</p><div class="info-note"><strong>Har du redan en plats?</strong><p>Använd samma formulär för att uppdatera registret. Fyll gärna i ditt båtplatsnummer och berätta om du har bytt båt.</p></div><a class="text-link" href="/assets/documents/avgifter-nbk.pdf" target="_blank" rel="noopener noreferrer">Se klubbens avgifter ${arrow}</a><br><a class="text-link" href="/assets/documents/batplatsavtal.pdf" target="_blank" rel="noopener noreferrer">Läs båtplatsavtalet ${arrow}</a><br><a class="text-link" href="/assets/documents/intyg-om-batbottenfarg-for-utskrift.pdf" target="_blank" rel="noopener noreferrer">Hämta båtbottenintyget ${arrow}</a><img class="side-photo" src="/assets/photos/20220806_133221.jpg" alt="Båtar vid klubbens brygga" loading="lazy"></aside>
  <form id="member-form"><p class="form-note">Fält markerade med * är obligatoriska.</p><fieldset class="form-section"><legend><span>01</span> Ditt ärende</legend><label class="field full" for="application-purpose"><span>Vad vill du göra? *</span><select id="application-purpose" name="Ärende" required><option value="Ansökan om båtplats">Ansöka om båtplats</option><option value="Uppdatering av medlemsuppgifter">Uppdatera mina medlemsuppgifter</option></select></label></fieldset>
    <fieldset class="form-section"><legend><span>02</span> Dina uppgifter</legend><div class="form-grid">${field('Namn', 'name', { full: true, autocomplete: 'name', placeholder: 'För- och efternamn' })}${field('Adress', 'address', { full: true, autocomplete: 'street-address', placeholder: 'Gata och nummer' })}${field('Postadress', 'postal', { full: true, autocomplete: 'postal-code', placeholder: 'Postnummer och ort' })}${field('Mobiltelefon', 'mobile', { type: 'tel', autocomplete: 'tel', placeholder: '070-000 00 00' })}${field('E-post', 'email', { type: 'email', autocomplete: 'email', placeholder: 'namn@exempel.se' })}${field('Telefon', 'phone', { type: 'tel', required: false, autocomplete: 'tel-national' })}</div></fieldset>
    <fieldset class="form-section"><legend><span>03</span> Din båt</legend><div class="form-grid"><label class="field full" for="boat-type"><span>Farkost *</span><select id="boat-type" name="Farkost" required><option value="">Välj båttyp</option><option>Motorbåt</option><option>Segelbåt</option><option>Roddbåt</option></select></label>${field('Båtmodell', 'model', { full: true, placeholder: 'Till exempel Flipper eller Buster' })}${field('Motor: typ, effekt och fabrikat', 'engine', { full: true, placeholder: 'Till exempel fyrtakt, 60 hk, Yamaha' })}${field('Båtbottenfärg', 'paint', { full: true, placeholder: 'Ange biocidfri färg eller omålad båtbotten', hint: 'Bottenfärgen måste vara biocidfri, eller båten utan bottenfärg.' })}${field('Längd × bredd i cm', 'size', { placeholder: 'Till exempel 600 × 230', full: true })}${field('Båtplatsnummer', 'berth', { required: false, placeholder: 'Om du redan har en plats', full: true })}<label class="field full" for="member-message"><span>Meddelande & önskemål</span><textarea id="member-message" name="Meddelande och önskemål" maxlength="3000" placeholder="Berätta gärna mer…"></textarea></label></div></fieldset><label class="checkbox-field"><input type="checkbox" required name="Miljövillkor bekräftade" value="Ja"><span>Jag bekräftar att båtbotten är biocidfri eller omålad och att båten inte har en tvåtaktsmotor med förgasare. *</span></label>${mailFormEnd('member')}</form></div></div>`;
}

function contactView() {
  return `<div class="wrap">${pageIntro('Kontakt', 'DU ÄR VÄLKOMMEN ATT HÖRA AV DIG', 'Vi finns <em>här.</em>', 'En fråga om klubben, båtplatser eller livet i hamnen? Skriv till oss eller kontakta ordföranden direkt.')}<div class="form-layout"><aside class="side-panel"><p class="eyebrow">KONTAKTA NBK</p><h2>Enklast är att fråga.</h2><div class="contact-detail"><span>E-post</span><a href="mailto:info@nockebyhovsbatklubb.se">info@nockebyhovsbatklubb.se</a></div><div class="contact-detail"><span>Ordförande</span><a href="tel:+46706002556">070-600 25 56</a></div><div class="contact-detail"><span>Besöksadress</span><a href="${mapURL}" target="_blank" rel="noopener noreferrer">Grönviksvägen 192<br>Bromma, Stockholm ↗</a></div><div class="contact-detail"><span>Berlin Elektriska AB</span><a href="tel:+468379122">08-37 91 22</a></div><img class="side-photo" src="/assets/photos/20200910_132642.jpg" alt="Utsikt från Nockebyhovs båtklubb" loading="lazy"></aside><form id="contact-form"><fieldset class="form-section"><legend>Skriv till oss</legend><p class="form-note">Fält markerade med * är obligatoriska.</p><div class="form-grid">${field('Namn', 'contact-name', { autocomplete: 'name', placeholder: 'För- och efternamn' })}${field('Telefon', 'contact-phone', { type: 'tel', required: false, autocomplete: 'tel' })}${field('E-post', 'contact-email', { type: 'email', autocomplete: 'email', full: true, placeholder: 'namn@exempel.se' })}${field('Ärende', 'subject', { full: true, placeholder: 'Vad gäller din fråga?' })}<label class="field full" for="contact-message"><span>Meddelande *</span><textarea id="contact-message" name="Meddelande" required maxlength="3000" placeholder="Skriv ditt meddelande här…"></textarea></label></div></fieldset>${mailFormEnd('contact')}<p class="form-note" style="margin-top:25px">Kjell Berlin sköter informationen på webbplatsen. Synpunkter är välkomna till klubbens e-postadress. Kontakt: <a href="mailto:info@berlin-elektriska.se">info@berlin-elektriska.se</a>.</p></form></div>
  <section class="emergency-grid" aria-label="Vid skada eller en nödsituation"><div><p class="eyebrow muted">VID NÖD</p><h3>Akut hjälp</h3><p>Vid en akut nödsituation, ring nödnumret.</p><a href="tel:112">112 ↗</a></div><div><p class="eyebrow muted">SKADA & STÖLD</p><h3>Gör en polisanmälan</h3><p>Anmäl skada och stöld till ditt försäkringsbolag. Kontakta polisen för en anmälan.</p><a href="tel:11414">114 14 ↗</a></div><div><p class="eyebrow muted">INFORMERA KLUBBEN</p><h3>Meddela styrelsen</h3><p>Berätta om skadan eller stölden via kontaktformuläret ovan, eller ring ordföranden.</p><a href="tel:+46706002556">070-600 25 56 ↗</a></div></section>
  <section class="map-image" aria-labelledby="find-title"><img src="/assets/photos/kartanockeby.jpg" alt="Klubbens karta över Nockebyhov och hamnens läge" loading="lazy"><div><p class="eyebrow muted">HITTA TILL VÅR HAMN</p><h2 id="find-title">Vägen till vattnet.</h2><p>Grönviksvägen 192, Bromma<br>59°19.7′ N · 17°54.6′ E</p><a class="text-link" href="${mapURL}" target="_blank" rel="noopener noreferrer">Öppna vägbeskrivning ${arrow}</a></div></section></div>`;
}

function setupForm(type) {
  const form = document.querySelector(type === 'member' ? '#member-form' : '#contact-form');
  const status = form.querySelector('.form-status');
  form.addEventListener('input', () => { status.hidden = true; status.replaceChildren(); });
  form.addEventListener('change', () => { status.hidden = true; status.replaceChildren(); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const subject = type === 'member' ? data.get('Ärende') : data.get('Ärende').trim();
    const body = Array.from(data, ([key, value]) => `${key}: ${String(value).trim()}`).join('\r\n\r\n');
    const mailto = `mailto:info@nockebyhovsbatklubb.se?subject=${encodeURIComponent('NBK — ' + subject)}&body=${encodeURIComponent(body)}`;
    status.innerHTML = `<strong>Ditt utkast är klart.</strong><p>Öppna utkastet, kontrollera uppgifterna och skicka från ditt e-postprogram. Ingenting har skickats ännu.</p><p style="margin-top:12px"><a class="button" href="${escapeHTML(mailto)}">Öppna e-postutkast ${arrow}</a></p><p style="margin-top:12px">Om du saknar ett e-postprogram kan du <button class="copy-message" type="button" style="background:none;padding:0;text-decoration:underline">kopiera texten</button> och mejla den till info@nockebyhovsbatklubb.se.</p>`;
    status.hidden = false;
    status.querySelector('.copy-message').addEventListener('click', async e => {
      try { await navigator.clipboard.writeText(`Till: info@nockebyhovsbatklubb.se\nÄmne: NBK — ${subject}\n\n${body}`); e.target.textContent = 'Texten är kopierad'; }
      catch { const text = document.createElement('textarea'); text.value = `Till: info@nockebyhovsbatklubb.se\nÄmne: NBK — ${subject}\n\n${body}`; text.readOnly = true; text.setAttribute('aria-label', 'E-postutkast att kopiera'); status.append(text); text.focus(); text.select(); }
    });
    status.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

function setupGallery() {
  const gallery = document.querySelector('.gallery');
  document.querySelector('.gallery-prev').addEventListener('click', () => gallery.scrollBy({ left: -gallery.clientWidth * .8, behavior: 'smooth' }));
  document.querySelector('.gallery-next').addEventListener('click', () => gallery.scrollBy({ left: gallery.clientWidth * .8, behavior: 'smooth' }));
  document.querySelectorAll('[data-photo]').forEach(button => button.addEventListener('click', () => {
    photoDialog.querySelector('img').src = '/assets/photos/' + button.dataset.photo;
    photoDialog.querySelector('img').alt = button.dataset.caption;
    photoDialog.querySelector('p').textContent = button.dataset.caption;
    photoDialog.showModal();
  }));
}
photoDialog.querySelector('.close-photo').addEventListener('click', () => photoDialog.close());
photoDialog.addEventListener('click', e => { if (e.target === photoDialog) photoDialog.close(); });
photoDialog.addEventListener('close', () => { photoDialog.querySelector('img').removeAttribute('src'); });

function route(initial = false) {
  const legacy = { '/kontakt.html': 'kontakt', '/Dokument.html': 'dokument', '/medlem.html': 'medlem' };
  if (!location.hash && legacy[location.pathname]) { history.replaceState(null, '', '/#' + legacy[location.pathname]); }
  const [hash, query = ''] = location.hash.slice(1).split('?');
  const requested = hash || 'hem';
  const home = ['hem', 'klubben', 'aktuellt', 'innehall'].includes(requested);
  const view = home ? 'hem' : requested;
  const params = new URLSearchParams(query);
  closeMenu();
  if (view !== currentView || view === 'dokument') {
    currentView = view;
    if (view === 'hem') { main.innerHTML = homeView(); setupGallery(); }
    else if (view === 'dokument') { main.innerHTML = documentView(); setupDocuments(params); }
    else if (view === 'medlem') { main.innerHTML = memberView(); setupForm('member'); }
    else if (view === 'kontakt') { main.innerHTML = contactView(); setupForm('contact'); }
    else { main.innerHTML = '<section class="wrap error-page"><p class="eyebrow">SIDAN FINNS INTE</p><h1>Vi hittar inte <em>den här platsen.</em></h1><p>Följ med tillbaka till bryggan.</p><a class="button" href="#hem" style="margin-top:25px">Till startsidan ↗</a></section>'; }
    if (!initial) main.focus({ preventScroll: true });
  }
  document.title = ({ hem: 'Nockebyhovs Båtklubb — En plats vid vattnet', dokument: 'Dokument — Nockebyhovs Båtklubb', medlem: 'Medlem & ansökan — Nockebyhovs Båtklubb', kontakt: 'Kontakt — Nockebyhovs Båtklubb' })[view] || 'Sidan finns inte — Nockebyhovs Båtklubb';
  document.querySelectorAll('.header a[href^="#"]').forEach(a => {
    if (a.getAttribute('href') === '#' + requested) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  requestAnimationFrame(() => {
    const section = home && ['klubben', 'aktuellt', 'innehall'].includes(requested) ? document.getElementById(requested) : null;
    if (section) section.scrollIntoView({ behavior: initial ? 'instant' : 'smooth', block: 'start' });
    else window.scrollTo({ top: 0, behavior: 'instant' });
  });
}

try {
  const response = await fetch('/assets/documents.json');
  if (!response.ok) throw new Error('Document index unavailable');
  documents = await response.json();
} catch { documentError = true; }
window.addEventListener('hashchange', () => route());
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if (link && !link.classList.contains('skip-link') && link.getAttribute('href') === location.hash) {
    e.preventDefault();
    route();
  }
});
route(true);
