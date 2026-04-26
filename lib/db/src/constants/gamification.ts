// XP Ödülleri
export const XP_REWARDS = {
  daily_login: 10,
  read_article: 20,
  complete_quiz: 50,
  quiz_perfect: 100,
  share_article: 30,
  comment: 15,
  bookmark: 5,
  streak_7: 200,
  streak_30: 1000,
  streak_100: 5000,
  complete_lesson: 100,
  invite_friend: 100,
} as const;

export type XpAction = keyof typeof XP_REWARDS;

// 10 Seviye
export const LEVELS = [
  { level: 1, name: "Yeni Başlayan", minXP: 0,      icon: "🌱" },
  { level: 2, name: "Meraklı",       minXP: 500,    icon: "🌿" },
  { level: 3, name: "Öğrenci",       minXP: 1500,   icon: "📚" },
  { level: 4, name: "Araştırmacı",   minXP: 3000,   icon: "🔍" },
  { level: 5, name: "Analist",       minXP: 6000,   icon: "📊" },
  { level: 6, name: "Uzman",         minXP: 12000,  icon: "🎯" },
  { level: 7, name: "Yatırım Ustası",minXP: 25000,  icon: "👑" },
  { level: 8, name: "Piyasa Lideri", minXP: 50000,  icon: "🏆" },
  { level: 9, name: "Finans Dehası", minXP: 100000, icon: "💎" },
  { level: 10,name: "Steve Efsanesi",minXP: 200000, icon: "🚀" },
] as const;

export function getLevelFromXP(xp: number) {
  return [...LEVELS].reverse().find(l => xp >= l.minXP) ?? LEVELS[0];
}

export function getNextLevel(currentLevel: number) {
  return LEVELS.find(l => l.level === currentLevel + 1) ?? null;
}

export function getXPProgress(xp: number) {
  const current = getLevelFromXP(xp);
  const next = getNextLevel(current.level);
  if (!next) return { current, next: null, progress: 100, xpNeeded: 0 };
  const xpInLevel = xp - current.minXP;
  const xpRequired = next.minXP - current.minXP;
  return {
    current,
    next,
    progress: Math.floor((xpInLevel / xpRequired) * 100),
    xpNeeded: next.minXP - xp,
  };
}

// Rozetler
export const BADGES = {
  ilk_adim:     { id: "ilk_adim",     name: "İlk Adım",      desc: "İlk makaleyi oku",       icon: "📖", category: "okuma" },
  okur_yazar:   { id: "okur_yazar",   name: "Okur Yazar",     desc: "10 makale oku",          icon: "📚", category: "okuma" },
  ilk_test:     { id: "ilk_test",     name: "İlk Test",       desc: "İlk quizi tamamla",      icon: "📝", category: "quiz"  },
  mukemmel:     { id: "mukemmel",     name: "Mükemmel",       desc: "Quizde %100 başar",      icon: "💯", category: "quiz"  },
  haftalik:     { id: "haftalik",     name: "Haftalık",       desc: "7 gün ardışık giriş",    icon: "🔥", category: "streak"},
  aylik:        { id: "aylik",        name: "Aylık",          desc: "30 gün ardışık giriş",   icon: "🔥", category: "streak"},
  paylasan:     { id: "paylasan",     name: "Paylaşan",       desc: "İlk makale paylaşımı",   icon: "📢", category: "sosyal"},
  erken_kus:    { id: "erken_kus",    name: "Erken Kuş",      desc: "İlk 1000 kullanıcı",     icon: "🐦", category: "özel"  },
  kurucu:       { id: "kurucu",       name: "Kurucu Üye",     desc: "Beta döneminde katıl",   icon: "⭐", category: "özel"  },
  yazar:        { id: "yazar",        name: "Yazar",          desc: "İlk konuk yazısı",       icon: "✍️", category: "özel" },
} as const;

export type BadgeId = keyof typeof BADGES;

// Günlük görevler
export const DAILY_QUESTS = [
  { id: "read",      title: "Günün Haberi",  desc: "Bugünkü hap haberi oku",    xp: XP_REWARDS.read_article  },
  { id: "quiz",      title: "Bilgi Testi",   desc: "Finans quizi çöz",          xp: XP_REWARDS.complete_quiz },
  { id: "share",     title: "Paylaş & Kazan",desc: "Bir makale paylaş",         xp: XP_REWARDS.share_article },
  { id: "login",     title: "Günlük Giriş",  desc: "Bugün giriş yap",           xp: XP_REWARDS.daily_login   },
] as const;

export const ALL_QUESTS_BONUS = 100;

// SPK Uyumlu Disclaimer
export const LEGAL_DISCLAIMER = "Steve Analiz, SPK lisanslı bir yatırım danışmanı değildir. Sunulan tüm veriler yalnızca bilgilendirme ve eğitim amaçlıdır. Yatırım kararı vermeden önce lisanslı bir aracı kuruma başvurunuz.";
