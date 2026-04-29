const { Pool } = require('pg');
const pool = new Pool({ 
  connectionString: 'postgresql://steveanalizweb:nnGwRa2kWRUwpm4Iu6ptWuxt4okeWcDe@dpg-d7l0panlk1mc73bgg3qg-a.oregon-postgres.render.com/steveanalizweb', 
  ssl: { rejectUnauthorized: false } 
});

async function seed() {
  // Blog yazilari ekle
  const blogs = [
    { title: 'Borsa Istanbul 2026 Gorusleri', slug: 'bist-2026-' + Date.now(), summary: 'BIST100 endeksi icin 2026 yili beklentileri ve sektorel analiz.', content: '<p>Borsa Istanbul 2026 yilina guclu basladi.</p>', tags: '{borsa,ekonomi}', type: 'analysis', status: 'published', author: 'SteveAnalizAI' },
    { title: 'Dolar Kuru Tahmini', slug: 'dolar-kuru-' + Date.now(), summary: 'Dolar/TL kuru icin kisa ve orta vadeli projeksiyonlar.', content: '<p>Dolar kuru dalgali seyrediyor.</p>', tags: '{dolar,ekonomi}', type: 'analysis', status: 'published', author: 'SteveAnalizAI' }
  ];

  for (const b of blogs) {
    await pool.query(
      'INSERT INTO blog_posts (title, slug, summary, content, tags, type, status, author) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
      [b.title, b.slug, b.summary, b.content, b.tags, b.type, b.status, b.author]
    );
    console.log('Blog eklendi:', b.title);
  }

  // Egitim icerigi ekle
  const educations = [
    { title: 'Temel Finans Egitimi', slug: 'temel-finans-' + Date.now(), summary: 'Finansal okuryazarlik temelleri.', content: '<p>Finans egitimi icerigi.</p>', type: 'education', order: 1 },
    { title: 'Ileri Teknik Analiz', slug: 'teknik-analiz-' + Date.now(), summary: 'Teknik analiz araclari ve stratejileri.', content: '<p>Teknik analiz detaylari.</p>', type: 'education', order: 2 }
  ];

  for (const e of educations) {
    await pool.query(
      'INSERT INTO education_posts (title, slug, summary, content, type, "order") VALUES ($1,$2,$3,$4,$5,$6)',
      [e.title, e.slug, e.summary, e.content, e.type, e.order]
    );
    console.log('Egitim eklendi:', e.title);
  }

  // Yazar ekle
  const writers = [
    { name: 'Ahmet Yilmaz', email: 'ahmet@ornek.com', bio: 'Finansal analist, 10 yil deneyim.', status: 'approved' },
    { name: 'Ayse Demir', email: 'ayse@ornek.com', bio: 'Ekonomi yorumcusu ve blog yazari.', status: 'approved' }
  ];

  for (const w of writers) {
    await pool.query(
      'INSERT INTO writers (name, email, bio, status) VALUES ($1,$2,$3,$4)',
      [w.name, w.email, w.bio, w.status]
    );
    console.log('Yazar eklendi:', w.name);
  }

  console.log('Tum seed islemleri tamamlandi!');
  pool.end();
}
seed();
