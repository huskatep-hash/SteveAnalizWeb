const { Pool } = require('pg');
const pool = new Pool({ 
  connectionString: 'postgresql://steveanalizweb:nnGwRa2kWRUwpm4Iu6ptWuxt4okeWcDe@dpg-d7l0panlk1mc73bgg3qg-a.oregon-postgres.render.com/steveanalizweb', 
  ssl: { rejectUnauthorized: false } 
});

async function reset() {
  console.log('🗑️ Tüm tablolar temizleniyor...');
  await pool.query('DELETE FROM news_posts');
  await pool.query('DELETE FROM blog_posts');
  await pool.query('DELETE FROM education_posts');
  await pool.query('DELETE FROM writers');
  console.log('✅ Temizlik tamam');

  console.log('📰 Haberler ekleniyor...');
  await pool.query(`
    INSERT INTO news_posts (title, slug, summary, content, category, tags, status, read_time, hap_headline, hap_context, hap_impact, hap_quote) VALUES 
    ('TCMB Faizi Sabit Birakti', 'tcmb-faiz-1', 'TCMB politika faizini sabit tuttu.', '<p>TCMB faizi sabit birakti.</p>', 'Makro', ARRAY['TCMB','faiz'], 'published', '3 dk', 'Merkez Bankasi faizi sabit tuttu', 'Enflasyonla mucadelede kararlilik mesaji.', 'Bankacilik hisseleri olumlu etkilenebilir.', 'TCMB temkinli durusunu koruyor.'),
    ('Bitcoin 70.000 Dolari Asti', 'bitcoin-70-bin-1', 'Bitcoin spot ETF talebiyle yukseldi.', '<p>Bitcoin yukseliste.</p>', 'Kripto', ARRAY['Bitcoin','kripto'], 'published', '3 dk', 'Bitcoin 70.000 dolari gordu', 'Spot ETF talebi fiyati yukseltti.', 'Kripto yatirimcilari icin olumlu.', 'Kurumsal yatirimcilar kriptoya giris yapiyor.')
  `);
  console.log('✅ Haberler eklendi');

  console.log('📝 Blog yazilari ekleniyor...');
  await pool.query(`
    INSERT INTO blog_posts (title, slug, summary, content, tags, type, status, author) VALUES 
    ('Borsa Istanbul 2026 Gorusleri', 'bist-2026-1', 'BIST100 endeksi 2026 beklentileri.', '<p>Borsa Istanbul guclu basladi.</p>', ARRAY['borsa','ekonomi'], 'analysis', 'published', 'SteveAnalizAI'),
    ('Dolar Kuru Tahmini', 'dolar-kuru-1', 'Dolar/TL projeksiyonlari.', '<p>Dolar kuru dalgali.</p>', ARRAY['dolar','ekonomi'], 'analysis', 'published', 'SteveAnalizAI')
  `);
  console.log('✅ Blog eklendi');

  console.log('🎓 Egitim ekleniyor...');
  await pool.query(`
    INSERT INTO education_posts (title, slug, summary, content, type, "order") VALUES 
    ('Temel Finans Egitimi', 'temel-finans-1', 'Finansal okuryazarlik.', '<p>Finans temelleri.</p>', 'education', 1),
    ('Ileri Teknik Analiz', 'teknik-analiz-1', 'Teknik analiz araclari.', '<p>Teknik analiz.</p>', 'education', 2)
  `);
  console.log('✅ Egitim eklendi');

  console.log('✍️ Yazarlar ekleniyor...');
  await pool.query(`
    INSERT INTO writers (name, email, bio, status) VALUES 
    ('Ahmet Yilmaz', 'ahmet1@ornek.com', 'Finansal analist.', 'approved'),
    ('Ayse Demir', 'ayse1@ornek.com', 'Ekonomi yorumcusu.', 'approved')
  `);
  console.log('✅ Yazarlar eklendi');

  console.log('\n🎉 TÜM VERİLER BAŞARIYLA YENİDEN YÜKLENDİ!');
  pool.end();
}
reset();
