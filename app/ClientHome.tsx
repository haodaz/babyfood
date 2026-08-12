/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FOOD_CATEGORIES, FoodItem } from '../constants/foods';
import { supabase } from '../lib/supabase';

type RecordData = {
  date: string;
  reaction: 'love' | 'neutral' | 'hate' | '';
  allergy: boolean;
};

type Lang = 'zh' | 'en';

const i18n = {
  zh: {
    title: '宝宝的 100 种辅食初体验',
    progress: '解锁进度',
    allergenTag: '易敏',
    firstTried: '首次尝试',
    reaction: '宝宝的反应',
    love: '😍 喜欢',
    neutral: '😐 一般',
    hate: '😖 拒绝',
    allergyAlert: '⚠️ 疑似过敏反应',
    allergyWarning: '提示：该食材属于常见致敏原 ({allergen})，初次添加请密切观察 3 天。',
    done: '完成记录',
    cancel: '取消打卡 (删除记录)',
    toggleLang: 'English',
    dashboard: '📊 统计'
  },
  en: {
    title: "Baby's First 100 Foods",
    progress: 'Progress',
    allergenTag: 'Allergen',
    firstTried: 'First tried',
    reaction: "Baby's Reaction",
    love: '😍 Love it',
    neutral: '😐 Neutral',
    hate: '😖 Dislike',
    allergyAlert: '⚠️ Suspected Allergy',
    allergyWarning: 'Note: This is a common allergen ({allergen}). Observe closely for 3 days.',
    done: 'Save Record',
    cancel: 'Remove Record',
    toggleLang: '中文',
    dashboard: '📊 Stats'
  }
};

export default function Home() {
  const router = useRouter();
  const [records, setRecords] = useState<Record<number, RecordData>>({});
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lang, setLang] = useState<Lang>('zh');

  // 当弹窗打开时，禁止底部背景滚动
  useEffect(() => {
    if (selectedFood) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedFood]);

  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang') as Lang;
    if (savedLang) setLang(savedLang);

    async function fetchRecords() {
      const { data, error } = await supabase.from('food_records').select('*');
      if (data && !error) {
        const newRecords: Record<number, RecordData> = {};
        data.forEach(row => {
          newRecords[row.food_id] = {
            date: row.date,
            reaction: row.reaction || '',
            allergy: row.allergy || false
          };
        });
        setRecords(newRecords);
      }
      setIsLoaded(true);
    }
    fetchRecords();
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('app_lang', lang);
    }
  }, [lang, isLoaded]);

  const t = i18n[lang];

  const totalFoods = FOOD_CATEGORIES.reduce((acc, cat) => acc + cat.items.length, 0);
  const triedFoodsCount = Object.keys(records).length;
  const progressPercent = (triedFoodsCount / totalFoods) * 100;

  const handleToggleFood = (food: FoodItem) => {
    if (records[food.id]) {
      setSelectedFood(food);
    } else {
      const newData = {
        date: new Date().toISOString().split('T')[0],
        reaction: '' as const,
        allergy: false
      };
      setRecords(prev => ({ ...prev, [food.id]: newData }));
      setSelectedFood(food);
    }
  };

  const handleUpdateRecord = (updates: Partial<RecordData>) => {
    if (!selectedFood) return;
    setRecords(prev => ({
      ...prev,
      [selectedFood.id]: {
        ...prev[selectedFood.id],
        ...updates
      }
    }));
  };

  const closeSheet = () => setSelectedFood(null);

  if (!isLoaded) return null;

  return (
    <>
      <div style={{ padding: 'env(safe-area-inset-top) 16px 40px' }} className="animate-fade-in">
        {/* 头部与进度条 */}
      <header style={{ padding: '16px 0 24px', position: 'sticky', top: 0, backgroundColor: 'var(--bg-color)', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--primary-color)' }}>{t.title}</h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => router.push('/dashboard')}
              style={{ 
                padding: '6px 12px', borderRadius: '16px', border: '1px solid var(--border-color)', 
                backgroundColor: 'white', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                color: 'var(--text-main)'
              }}
            >
              {t.dashboard}
            </button>
            <button 
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              style={{ 
                padding: '6px 12px', borderRadius: '16px', border: '1px solid var(--border-color)', 
                backgroundColor: 'white', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                color: 'var(--text-main)'
              }}
            >
              {t.toggleLang}
            </button>
          </div>
        </div>
        <div style={{ marginTop: '16px', backgroundColor: 'white', borderRadius: '16px', padding: '16px 20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#374151' }}>{t.progress}</span>
          <div style={{ flex: 1, height: '10px', backgroundColor: '#F3F4F6', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progressPercent}%`, backgroundColor: 'var(--primary-color)', transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }} />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary-color)' }}>{triedFoodsCount}/{totalFoods}</span>
        </div>

        {/* 快速导航 */}
        <div style={{ 
          display: 'flex', overflowX: 'auto', gap: '8px', marginTop: '16px', 
          paddingBottom: '8px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
          marginRight: '-40px', paddingRight: '40px' /* 补偿父级 padding，让滚动看起来更自然 */
        }}>
          {FOOD_CATEGORIES.map(cat => (
            <button
              key={`nav-${cat.id}`}
              onClick={() => {
                const el = document.getElementById(cat.id);
                if (el) {
                  const y = el.getBoundingClientRect().top + window.scrollY - 220;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              style={{
                whiteSpace: 'nowrap', padding: '8px 14px', borderRadius: '20px',
                backgroundColor: 'white', border: `1px solid var(--border-color)`,
                fontSize: '13px', fontWeight: 600, color: 'var(--text-main)',
                cursor: 'pointer', flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
            >
              {lang === 'zh' ? cat.titleZh : cat.titleEn}
            </button>
          ))}
        </div>
      </header>

      {/* 分类打卡列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {FOOD_CATEGORIES.map(cat => (
          <div key={cat.id} id={cat.id}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '6px', backgroundColor: cat.color, marginRight: '10px', boxShadow: `0 0 0 2px white, 0 0 0 4px ${cat.color}` }} />
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#374151' }}>
                {lang === 'zh' ? cat.titleZh : cat.titleEn}
              </h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
              {cat.items.map(food => {
                const isChecked = !!records[food.id];
                const displayName = lang === 'zh' ? food.name : food.enName;
                const subName = lang === 'zh' ? food.enName : food.name;

                return (
                  <div 
                    key={food.id}
                    onClick={() => handleToggleFood(food)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 14px',
                      backgroundColor: isChecked ? cat.color : 'white',
                      border: `1.5px solid ${isChecked ? cat.color : 'var(--border-color)'}`,
                      borderRadius: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: isChecked ? 'none' : '0 2px 4px rgba(0,0,0,0.02)',
                      transform: 'scale(1)',
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.96)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.96)'}
                    onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <div style={{ 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '12px', 
                      border: `2px solid ${isChecked ? 'white' : '#D1D5DB'}`,
                      backgroundColor: isChecked ? '#10B981' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px',
                      flexShrink: 0,
                      transition: 'all 0.2s'
                    }}>
                      {isChecked && <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '15px', fontWeight: isChecked ? 700 : 500, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {displayName}
                      </div>
                      <div style={{ fontSize: '11px', color: isChecked ? 'rgba(0,0,0,0.5)' : '#9CA3AF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {subName}
                      </div>
                    </div>
                    
                    {food.allergen && !isChecked && (
                      <div style={{ fontSize: '10px', backgroundColor: '#FEE2E2', color: '#EF4444', padding: '2px 6px', borderRadius: '8px', fontWeight: 700, flexShrink: 0 }}>
                        {t.allergenTag}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      </div>

      {/* 底部详情抽屉 (Bottom Sheet) 移出动画容器，避免 transform 失效 */}
      {selectedFood && (
        <>
          <div 
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40, backdropFilter: 'blur(2px)', transition: 'all 0.3s' }}
            onClick={closeSheet}
          />
          <div 
            style={{
              position: 'fixed',
              bottom: 0, left: 0, right: 0,
              backgroundColor: 'white',
              borderTopLeftRadius: '28px',
              borderTopRightRadius: '28px',
              padding: '24px 24px max(32px, env(safe-area-inset-bottom))',
              zIndex: 50,
              boxShadow: '0 -10px 25px rgba(0,0,0,0.1)',
              animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div style={{ width: '48px', height: '5px', backgroundColor: '#E5E7EB', borderRadius: '3px', margin: '0 auto 24px' }} />
            
            <h3 style={{ fontSize: '24px', fontWeight: 800, textAlign: 'center', marginBottom: '4px', color: '#111827' }}>
              {lang === 'zh' ? selectedFood.name : selectedFood.enName}
            </h3>
            <p style={{ textAlign: 'center', color: '#6B7280', fontSize: '14px', marginBottom: '24px' }}>
              {lang === 'zh' ? selectedFood.enName : selectedFood.name} · {t.firstTried}: <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{records[selectedFood.id]?.date}</span>
            </p>

            {/* 记录反应 */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: '#374151' }}>{t.reaction}</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {(['love', 'neutral', 'hate'] as const).map(reaction => {
                  const isSelected = records[selectedFood.id]?.reaction === reaction;
                  return (
                    <button
                      key={reaction}
                      onClick={() => handleUpdateRecord({ reaction })}
                      style={{
                        flex: 1, padding: '16px 4px', borderRadius: '16px',
                        border: `2px solid ${isSelected ? 'var(--primary-color)' : 'var(--border-color)'}`,
                        backgroundColor: isSelected ? '#FFF3E0' : 'white',
                        color: isSelected ? 'var(--primary-color)' : '#6B7280',
                        fontSize: '15px', fontWeight: 700,
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)', cursor: 'pointer',
                        transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                      }}
                    >
                      {t[reaction]}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 过敏记录 */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', backgroundColor: records[selectedFood.id]?.allergy ? '#FEE2E2' : '#F9FAFB', borderRadius: '16px', border: `2px solid ${records[selectedFood.id]?.allergy ? '#FCA5A5' : 'transparent'}`, transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>⚠️</span>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: records[selectedFood.id]?.allergy ? '#EF4444' : '#374151' }}>
                    {t.allergyAlert}
                  </span>
                </div>
                <input 
                  type="checkbox" 
                  checked={records[selectedFood.id]?.allergy || false}
                  onChange={(e) => handleUpdateRecord({ allergy: e.target.checked })}
                  style={{ width: '24px', height: '24px', accentColor: '#EF4444' }}
                />
              </label>
              {selectedFood.allergen && (
                <p style={{ fontSize: '13px', color: '#EF4444', marginTop: '12px', fontWeight: 500 }}>
                  {t.allergyWarning.replace('{allergen}', lang === 'zh' ? selectedFood.allergen : selectedFood.enAllergen || selectedFood.allergen)}
                </p>
              )}
            </div>

            <button onClick={async () => {
              const record = records[selectedFood.id];
              await supabase.from('food_records').delete().eq('food_id', selectedFood.id);
              await supabase.from('food_records').insert({
                food_id: selectedFood.id,
                date: record.date,
                reaction: record.reaction,
                allergy: record.allergy
              });
              closeSheet();
            }} className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '18px', borderRadius: '16px' }}>{t.done}</button>
            <button 
              onClick={async () => {
                const newRecords = { ...records };
                delete newRecords[selectedFood.id];
                setRecords(newRecords);
                await supabase.from('food_records').delete().eq('food_id', selectedFood.id);
                closeSheet();
              }} 
              style={{ width: '100%', padding: '16px', marginTop: '8px', backgroundColor: 'transparent', border: 'none', color: '#9CA3AF', fontWeight: 600, fontSize: '15px' }}
            >
              {t.cancel}
            </button>
          </div>
        </>
      )}
    </>
  );
}
