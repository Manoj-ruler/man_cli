// Stage 4.5 Phase A (research/paper/STAGE4_5_INTEGRITY_REPORT.md): fresh existence + bibliographic check of every cited reference against primary
// records (Crossref by DOI, arXiv API by id, Semantic Scholar by exact title; DBLP was dropped because it serves a bot check). Writes refs_audit.json.
const fs = require('fs'), path = require('path');
const BIB = path.join(__dirname, '..', 'acl_latex', 'references.bib');
const TEX = path.join(__dirname, '..', 'acl_latex', 'content.tex');
const bib = fs.readFileSync(BIB, 'utf8');
const cited = new Set([...fs.readFileSync(TEX, 'utf8').matchAll(/\\cite[a-z]*\{([^}]*)\}/g)].flatMap(m => m[1].split(',').map(s => s.trim())));
// extra arXiv ids named only in source comments
const ARX = { 'lin-etal-2018-nl2bash': '1802.08979', agarwal2021nlc2cmd: '2103.02523', wang2020minilm: '2002.10957', guo2017calibration: '1706.04599', geifman2017selective: '1705.08500', geifman2019aurc: '1805.08206', traub2024overcoming: '2407.01032', hendrycks2017baseline: '1610.02136', zhou2023docprompting: '2207.05987', somov2025texttosql: '2501.09527' };
const entries = [];
for (const m of bib.matchAll(/@(\w+)\{([^,]+),([\s\S]*?)\n\}/g)) {
  const f = {}; for (const x of m[3].matchAll(/(\w+)\s*=\s*\{((?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*)\}/g)) f[x[1].toLowerCase()] = x[2];
  entries.push({ type: m[1], key: m[2].trim(), ...f });
}
const clean = s => (s || '').replace(/\\["'`^~]\{?(\w)\}?/g, '$1').replace(/[{}\\]/g, '').replace(/\s+/g, ' ').trim();
const norm = s => clean(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const surnames = a => clean(a).split(/\s+and\s+/).map(x => norm(x.includes(',') ? x.split(',')[0] : x.split(' ').slice(-1)[0]));
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function get(url, asText) {
  for (let i = 0; i < 3; i++) {
    try { const r = await fetch(url, { headers: { 'User-Agent': 'termassist-integrity-check/1.0 (mailto:research@example.invalid)' } }); if (r.ok) { const t = await r.text(); if (asText) return t; try { return JSON.parse(t); } catch { return null; } } if (r.status === 404) return { __status: 404 }; } catch (e) {}
    await sleep(1500 * (i + 1));
  }
  return null;
}
(async () => {
  const out = [];
  for (const e of entries.filter(e => cited.has(e.key))) {
    const rec = { key: e.key, bib: { title: clean(e.title), authors: surnames(e.author), year: e.year, venue: clean(e.booktitle || e.journal || ''), volume: e.volume, pages: e.pages, doi: e.doi }, sources: [] };
    if (e.doi) {
      const url = 'https://api.crossref.org/works/' + encodeURIComponent(e.doi);
      const j = await get(url); const m = j && j.message;
      rec.sources.push(m ? { src: 'crossref', url, title: (m.title || [])[0], authors: (m.author || []).map(a => norm(a.family || a.name || '')), year: ((m.issued || {})['date-parts'] || [[null]])[0][0], venue: (m['container-title'] || [])[0], volume: m.volume, pages: m.page } : { src: 'crossref', url, error: j && j.__status ? 'HTTP 404' : 'unavailable' });
    }
    const ax = e.eprint || ARX[e.key];
    if (ax) {
      const url = 'http://export.arxiv.org/api/query?id_list=' + ax;
      const x = await get(url, true);
      const ent = x && typeof x === 'string' && x.split('<entry>')[1];
      if (ent) rec.sources.push({ src: 'arxiv', url: 'https://arxiv.org/abs/' + ax, title: (ent.match(/<title>([\s\S]*?)<\/title>/) || [])[1]?.replace(/\s+/g, ' ').trim(), authors: [...ent.matchAll(/<name>([^<]+)<\/name>/g)].map(a => norm(a[1].trim().split(' ').slice(-1)[0])), year: (ent.match(/<published>(\d{4})/) || [])[1], comment: (ent.match(/<arxiv:comment[^>]*>([\s\S]*?)<\/arxiv:comment>/) || [])[1]?.replace(/\s+/g, ' ').trim(), journal_ref: (ent.match(/<arxiv:journal_ref[^>]*>([\s\S]*?)<\/arxiv:journal_ref>/) || [])[1]?.trim() });
      else rec.sources.push({ src: 'arxiv', url: 'https://arxiv.org/abs/' + ax, error: 'unavailable' });
      await sleep(3100);
    }
    {
      const url = 'https://api.semanticscholar.org/graph/v1/paper/search/match?fields=title,authors,year,venue,externalIds,publicationVenue&query=' + encodeURIComponent(clean(e.title));
      const j = await get(url); const best = j && j.data && j.data[0];
      if (best && norm(best.title) === norm(e.title)) rec.sources.push({ src: 's2', url: 'https://www.semanticscholar.org/paper/' + best.paperId, title: best.title, authors: (best.authors || []).map(a => norm(a.name.split(' ').slice(-1)[0])), year: best.year, venue: best.venue, doi: (best.externalIds || {}).DOI, s2_status: 'S2_VERIFIED' });
      else rec.sources.push({ src: 's2', url, error: best ? 'closest match has a different title: ' + best.title : (j && j.__status === 404 ? 'S2_NOT_FOUND' : 'API_UNAVAILABLE') });
      await sleep(3500);
    }
    // comparisons
    const ok = rec.sources.filter(s => !s.error);
    rec.checks = ok.map(s => ({ src: s.src, title_match: norm(s.title) === norm(e.title), authors_match: s.authors && s.authors.length ? JSON.stringify(s.authors) === JSON.stringify(rec.bib.authors) : null, author_count: s.authors ? `${s.authors.length} vs bib ${rec.bib.authors.length}` : null, year_match: s.year ? String(s.year) === String(e.year) : null }));
    rec.exists = ok.length > 0;
    out.push(rec);
    process.stdout.write(`${rec.exists ? 'FOUND' : 'NOT-FOUND'} ${e.key} ${rec.checks.map(c => `${c.src}:t${+c.title_match}a${c.authors_match === null ? '-' : +c.authors_match}y${c.year_match === null ? '-' : +c.year_match}`).join(' ')}\n`);
  }
  fs.writeFileSync(path.join(__dirname, 'refs_audit.json'), JSON.stringify({ checked_at: new Date().toISOString(), n: out.length, refs: out }, null, 2));
})();
