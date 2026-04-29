const { Pool } = require('pg');
const pool = new Pool({ 
  connectionString: 'postgresql://steveanalizweb:nnGwRa2kWRUwpm4Iu6ptWuxt4okeWcDe@dpg-d7l0panlk1mc73bgg3qg-a.oregon-postgres.render.com/steveanalizweb', 
  ssl: { rejectUnauthorized: false } 
});

async function fix() {
  // Mevcut haberleri sil
  await pool.query('DELETE FROM news_posts');
  console.log('Eski haberler silindi.');

  // Doğru formatta yeniden ekle (hap_numbers artık JSONB dizisi olarak)
  const news = [
    { 
      title: 'TCMB Faizi Sabit Birakti', 
      slug: 'tcmb-faiz-' + Date.now(), 
      summary: 'TCMB politika faizini sabit tuttu.', 
      content: '<p>TCMB faizi sabit birakti.</p>', 
      category: 'Makro', 
      tags: '{TCMB,faiz}', 
      status: 'published', 
      readTime: '3 dk', 
      hapHeadline: 'Merkez Bankasi faizi sabit tuttu', 
      hapContext: 'TCMB enflasyonla mucadelede kararli.', 
      hapImpact: 'Kisa vadede bankacilik hisseleri olumlu etkilenebilir.', 
      hapQuote: 'TCMB temkinli durusunu koruyor.', 
      hapNumbers: JSON.stringify([{label:'Faiz',value:'%45',change:'neutral'}])
    },
    { 
      title: 'Bitcoin 70.000 Dolari Asti', 
      slug: 'bitcoin-70-bin-' + Date.now(), 
      summary: 'Bitcoin spot ETF talebiyle yukseldi.', 
      content: '<p>Bitcoin yukseliste.</p>', 
      category: 'Kripto', 
      tags: '{Bitcoin,kripto}', 
      status: 'published', 
      readTime: '3 dk', 
      hapHeadline: 'Bitcoin 70.000 dolari gordu', 
      hapContext: 'Spot ETF talebi Bitcoin fiyatini yukseltti.', 
      hapImpact: 'Kripto yatirimcilari icin olumlu.', 
      hapQuote: 'Kurumsal yatirimcilar kriptoya giris yapiyor.', 
      hapNumbers: JSON.stringify([{label:'BTC',value:'$70.200',change:'up'}])
    }
  ];

  for (const n of news) {
    await pool.query(
      `INSERT INTO news_posts (title, slug, summary, content, category, tags, status, read_time, hap_headline, hap_context, hap_impact, hap_quote, hap_numbers) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
      [n.title, n.slug, n.summary, n.content, n.category, n.tags, n.status, n.readTime, n.hapHeadline, n.hapContext, n.hapImpact, n.hapQuote, n.hapNumbers]
    );
    console.log('Eklendi:', n.title);
  }
  console.log('Fix tamamlandi. Haberler yeniden yüklendi.');
  pool.end();
}
fix();
