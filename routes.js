export const pages = [
  { key: 'hem', path: '/', label: 'Start', title: 'Nockebyhovs Båtklubb', description: 'Välkommen till Nockebyhovs Båtklubb i Bromma. Ansök om båtplats, hitta klubbens dokument och kontakta oss på Grönviksvägen 192.' },
  { key: 'klubben', path: '/klubben/', label: 'Klubben', title: 'Klubben — Nockebyhovs Båtklubb', description: 'Lär känna Nockebyhovs Båtklubb, vår hamn i Bromma och klubbens arbete för ett finare båtliv.' },
  { key: 'aktuellt', path: '/aktuellt/', label: 'Aktuellt', title: 'Aktuellt — Nockebyhovs Båtklubb', description: 'Nyheter, påminnelser och årsplanering från Nockebyhovs Båtklubb.' },
  { key: 'dokument', path: '/dokument/', label: 'Dokument', title: 'Dokument — Nockebyhovs Båtklubb', description: 'Klubbens regler, avgifter, intyg och blanketter samlade i ett sökbart dokumentarkiv.' },
  { key: 'medlem', path: '/medlem/', label: 'Medlem & ansökan', title: 'Medlem & ansökan — Nockebyhovs Båtklubb', description: 'Ansök om båtplats hos Nockebyhovs Båtklubb eller uppdatera dina medlems- och båtuppgifter.' },
  { key: 'kontakt', path: '/kontakt/', label: 'Kontakt', title: 'Kontakt — Nockebyhovs Båtklubb', description: 'Kontakta Nockebyhovs Båtklubb och hitta till hamnen på Grönviksvägen 192 i Bromma.' },
];

export const legacyPaths = {
  '/kontakt.html': '/kontakt/',
  '/Dokument.html': '/dokument/',
  '/dokument.html': '/dokument/',
  '/medlem.html': '/medlem/',
};

export function findPage(pathname) {
  const path = legacyPaths[pathname] || pathname.replace(/index\.html$/, '');
  return pages.find(page => page.path === (path.endsWith('/') ? path : path + '/'));
}
