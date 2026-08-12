'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { FOOD_CATEGORIES } from '../../constants/foods';

type RecordData = {
  date: string;
  reaction: 'love' | 'neutral' | 'hate' | '';
  allergy: boolean;
};

type Lang = 'zh' | 'en';

const i18n = {
  zh: {
    title: '统计面板',
    totalProgress: '总进度',
    categoryProgress: '各分类进度',
    reactions: '宝宝的反应',
    allergies: '过敏记录',
    normal: '正常 (无过敏)',
    allergy: '疑似过敏',
    love: '😍 喜欢',
    neutral: '😐 一般',
    hate: '😖 拒绝',
    noData: '暂无记录',
    totalTried: '已尝试'
  },
  en: {
    title: 'Dashboard',
    totalProgress: 'Total Progress',
    categoryProgress: 'Category Progress',
    reactions: 'Baby\'s Reactions',
    allergies: 'Allergy Records',
    normal: 'Normal (No allergy)',
    allergy: 'Suspected Allergy',
    love: '😍 Love',
    neutral: '😐 Neutral',
    hate: '😖 Dislike',
    noData: 'No records yet',
    totalTried: 'Total Tried'
  }
};

export default function Dashboard() {
  const router = useRouter();
  const [records, setRecords] = useState<Record<number, RecordData>>({});
  const [lang, setLang] = useState<Lang>('zh');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('food_records');
    const savedLang = localStorage.getItem('app_lang') as Lang;
    if (saved) setRecords(JSON.parse(saved));
    if (savedLang) setLang(savedLang);
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return null;

  const t = i18n[lang];
  const recordsArr = Object.values(records);
  const triedCount = recordsArr.length;
  
  // Calculate reactions
  const reactions = { love: 0, neutral: 0, hate: 0, unknown: 0 };
  let allergiesCount = 0;
  
  recordsArr.forEach(r => {
    if (r.reaction === 'love') reactions.love++;
    else if (r.reaction === 'neutral') reactions.neutral++;
    else if (r.reaction === 'hate') reactions.hate++;
    else reactions.unknown++;
    
    if (r.allergy) allergiesCount++;
  });

  return (
    <div style={{ padding: 'env(safe-area-inset-top) 20px 40px', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }} className="animate-fade-in">
      <header style={{ display: 'flex', alignItems: 'center', padding: '16px 0 24px', position: 'sticky', top: 0, backgroundColor: 'var(--bg-color)', zIndex: 10 }}>
        <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '20px', backgroundColor: 'white', border: '1px solid var(--border-color)', cursor: 'pointer', marginRight: '16px' }}>
          <ChevronLeft size={24} color="var(--text-main)" />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)' }}>{t.title}</h1>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Allergy Stats */}
        <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#374151' }}>{t.allergies}</h2>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1, backgroundColor: '#F9FAFB', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#10B981' }}>{triedCount - allergiesCount}</div>
              <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px', fontWeight: 600 }}>{t.normal}</div>
            </div>
            <div style={{ flex: 1, backgroundColor: '#FEE2E2', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#EF4444' }}>{allergiesCount}</div>
              <div style={{ fontSize: '13px', color: '#EF4444', marginTop: '4px', fontWeight: 600 }}>{t.allergy}</div>
            </div>
          </div>
        </div>

        {/* Reaction Stats */}
        <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '24px', color: '#374151' }}>{t.reactions}</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '140px', gap: '16px', paddingBottom: '8px' }}>
            {/* Love */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#F59E0B' }}>{reactions.love}</div>
              <div style={{ width: '100%', backgroundColor: '#FEF3C7', borderRadius: '8px 8px 0 0', height: `${Math.max(5, (reactions.love / (triedCount || 1)) * 100)}%`, transition: 'height 0.5s ease-out' }} />
              <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>😍</div>
            </div>
            {/* Neutral */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#6B7280' }}>{reactions.neutral}</div>
              <div style={{ width: '100%', backgroundColor: '#F3F4F6', borderRadius: '8px 8px 0 0', height: `${Math.max(5, (reactions.neutral / (triedCount || 1)) * 100)}%`, transition: 'height 0.5s ease-out' }} />
              <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>😐</div>
            </div>
            {/* Hate */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#EF4444' }}>{reactions.hate}</div>
              <div style={{ width: '100%', backgroundColor: '#FEE2E2', borderRadius: '8px 8px 0 0', height: `${Math.max(5, (reactions.hate / (triedCount || 1)) * 100)}%`, transition: 'height 0.5s ease-out' }} />
              <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>😖</div>
            </div>
          </div>
        </div>

        {/* Category Progress */}
        <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '24px', color: '#374151' }}>{t.categoryProgress}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {FOOD_CATEGORIES.map(cat => {
              const catTotal = cat.items.length;
              const catTried = cat.items.filter(f => records[f.id]).length;
              const percent = (catTried / catTotal) * 100;
              
              return (
                <div key={cat.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', fontWeight: 600 }}>
                    <span style={{ display: 'flex', alignItems: 'center', color: '#374151' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '6px', backgroundColor: cat.color, marginRight: '10px' }} />
                      {lang === 'zh' ? cat.titleZh : cat.titleEn}
                    </span>
                    <span style={{ color: '#9CA3AF' }}>{catTried} / {catTotal}</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#F3F4F6', borderRadius: '4px', overflow: 'hidden' }}>
                    {/* fallback color in case cat.color is too light (like #FEE2E2) -> use a slightly darker version for the bar fill, but since we use tailwind-like colors, we might just use primary or a derived color. Let's use primary color for the fill. */}
                    <div style={{ height: '100%', width: `${percent}%`, backgroundColor: 'var(--primary-color)', transition: 'width 0.6s ease-out' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
