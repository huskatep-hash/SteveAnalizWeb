const { Pool } = require('pg');
const pool = new Pool({ 
  connectionString: 'postgresql://steveanalizweb:nnGwRa2kWRUwpm4Iu6ptWuxt4okeWcDe@dpg-d7l0panlk1mc73bgg3qg-a.oregon-postgres.render.com/steveanalizweb', 
  ssl: { rejectUnauthorized: false } 
});

async function finalSeed() {
  console.log('🗑️  Tüm tablolar temizleniyor...');
  await pool.query('DELETE FROM news_posts');
  await pool.query('DELETE FROM blog_posts');
  await pool.query('DELETE FROM education_posts');
  await pool.query('DELETE FROM writers');

  console.log('📰 Haberler ekleniyor...');
  await pool.query(`
    INSERT INTO news_posts (title, slug, summary, content, category, tags, status, read_time, hap_headline, hap_context, hap_impact, hap_quote)
    VALUES 
    ('TCMB Faizi Sabit Bıraktı', 'tcmb-faiz-1', 'TCMB politika faizini sabit tuttu.', '<p>TCMB faizi sabit bıraktı.</p>', 'Makro', ARRAY['TCMB','faiz'], 'published', '3 dk', 'Merkez Bankası Faizi Sabit Tuttu', 'Enflasyonla mücadelede kararlılık mesajı.', 'Kısa vadede bankacılık hisseleri olumlu etkilenebilir.', 'TCMB temkinli duruşunu koruyor.'),
    ('Bitcoin 70.000 Doları Aştı', 'bitcoin-70-bin-1', 'Bitcoin spot ETF talebiyle yükseldi.', '<p>Bitcoin yükselişte.</p>', 'Kripto', ARRAY['Bitcoin','kripto'], 'published', '3 dk', 'Bitcoin 70.000 Doları Gördü', 'Spot ETF talebi fiyatı yükseltti.', 'Kripto yatırımcıları için olumlu.', 'Kurumsal yatırımcılar kriptoya giriş yapıyor.')
  `);

  console.log('📝 Blog yazıları ekleniyor...');
  await pool.query(`
    INSERT INTO blog_posts (title, slug, summary, content, tags, type, status, author)
    VALUES 
    ('Borsa İstanbul 2026 Görüşleri', 'bist-2026-1', 'BIST100 endeksi için 2026 beklentileri ve sektörel analiz.', '<p>Borsa İstanbul 2026 yılına güçlü başladı.</p>', ARRAY['borsa','ekonomi'], 'analysis', 'published', 'SteveAnalizAI'),
    ('Dolar Kuru Tahmini', 'dolar-kuru-1', 'Dolar/TL kuru için kısa ve orta vadeli projeksiyonlar.', '<p>Dolar kuru dalgalı seyrediyor.</p>', ARRAY['dolar','ekonomi'], 'analysis', 'published', 'SteveAnalizAI')
  `);

  console.log('🎓 Eğitim içerikleri ekleniyor...');
  await pool.query(`
    INSERT INTO education_posts (title, slug, summary, content, type, "order")
    VALUES 
    ('Temel Finans Eğitimi', 'temel-finans-1', 'Finansal okuryazarlığın temelleri.', '<p>Finans eğitimi içeriği.</p>', 'education', 1),
    ('İleri Teknik Analiz', 'teknik-analiz-1', 'Teknik analiz araçları ve stratejileri.', '<p>Teknik analiz detayları.</p>', 'education', 2)
  `);

  console.log('✍️  Yazarlar ekleniyor...');
  await pool.query(`
    INSERT INTO writers (name, email, bio, status)
    VALUES 
    ('Ahmet Yılmaz', 'ahmet@ornek.com', 'Finansal analist, 10 yıl deneyim.', 'approved'),
    ('Ayşe Demir', 'ayse@ornek.com', 'Ekonomi yorumcusu ve blog yazarı.', 'approved')
    ON CONFLICT (email) DO NOTHING
  `);

  console.log('\n🎉 TÜM İÇERİKLER BAŞARIYLA YÜKLENDİ!');
  console.log('✅ Haberler, blog, eğitim ve yazarlar hazır.');
  pool.end();
}
finalSeed();
