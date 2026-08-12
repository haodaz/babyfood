/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FOOD_CATEGORIES, FoodItem, FoodCategory } from '../constants/foods';
import { supabase } from '../lib/supabase';

type RecordData = {
  date: string;
  reaction: 'love' | 'neutral' | 'hate' | '';
  allergy: boolean;
};

type Lang = 'zh' | 'en';

const i18n = {
  zh: {
    title: '百家饭',
    subtitle: '吃了百家饭，一生无忧愁',
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
    dashboard: '📊 统计',
    searchPlaceholder: '搜索食材...',
    addFood: '+ 新增食物',
    addFoodTitle: '新增自定义食材',
    foodNameZh: '中文名称',
    foodNameEn: '英文名称 (选填)',
    isAllergen: '是否为常见致敏原？',
    submit: '确定添加',
    cancelAdd: '取消'
  },
  en: {
    title: "Hundred Family Meals",
    subtitle: "Eat a hundred family meals, live a life without worry",
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
    dashboard: '📊 Stats',
    searchPlaceholder: 'Search foods...',
    addFood: '+ Add Food',
    addFoodTitle: 'Add Custom Food',
    foodNameZh: 'Name (Chinese)',
    foodNameEn: 'Name (English)',
    isAllergen: 'Is this a common allergen?',
    submit: 'Add',
    cancelAdd: 'Cancel'
  }
};

export default function Home() {
  const router = useRouter();
  const [records, setRecords] = useState<Record<string, RecordData>>({});
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lang, setLang] = useState<Lang>('zh');
  
  // 新功能状态
  const [searchQuery, setSearchQuery] = useState('');
  const [customFoods, setCustomFoods] = useState<FoodItem[]>([]);
  const [addingToCategory, setAddingToCategory] = useState<string | null>(null);
  
  const [newFoodZh, setNewFoodZh] = useState('');
  const [newFoodEn, setNewFoodEn] = useState('');
  const [newFoodAllergen, setNewFoodAllergen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 当弹窗打开时，禁止底部背景滚动
  useEffect(() => {
    if (selectedFood || addingToCategory) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedFood, addingToCategory]);

  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang') as Lang;
    if (savedLang) setLang(savedLang);

    async function fetchData() {
      // 获取打卡记录
      const { data: recordsData, error: recordsError } = await supabase.from('food_records').select('*');
      if (recordsData && !recordsError) {
        const newRecords: Record<string, RecordData> = {};
        recordsData.forEach(row => {
          newRecords[row.food_id] = {
            date: row.date,
            reaction: row.reaction || '',
            allergy: row.allergy || false
          };
        });
        setRecords(newRecords);
      }
      
      // 获取自定义食物
      const { data: customData, error: customError } = await supabase.from('custom_foods').select('*');
      if (customData && !customError) {
        const mapped: FoodItem[] = customData.map(row => ({
          id: row.id,
          name: row.name,
          enName: row.en_name,
          allergen: row.allergen,
          enAllergen: row.en_allergen,
          // 增加一个隐藏字段用来分类合并
          _categoryId: row.category_id
        } as any));
        setCustomFoods(mapped);
      }
      
      setIsLoaded(true);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('app_lang', lang);
    }
  }, [lang, isLoaded]);

  const t = i18n[lang];

  // 融合默认数据与自定义数据
  const mergedCategories = useMemo(() => {
    return FOOD_CATEGORIES.map(cat => {
      const categoryCustoms = customFoods.filter((f: any) => f._categoryId === cat.id);
      return {
        ...cat,
        items: [...cat.items, ...categoryCustoms]
      };
    });
  }, [customFoods]);

  // 搜索过滤
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return mergedCategories;
    const q = searchQuery.toLowerCase();
    
    return mergedCategories.map(cat => ({
      ...cat,
      items: cat.items.filter(f => 
        f.name.toLowerCase().includes(q) || 
        f.enName.toLowerCase().includes(q)
      )
    })).filter(cat => cat.items.length > 0);
  }, [mergedCategories, searchQuery]);

  const totalFoods = mergedCategories.reduce((acc, cat) => acc + cat.items.length, 0);
  const triedFoodsCount = Object.keys(records).length;
  const progressPercent = totalFoods === 0 ? 0 : (triedFoodsCount / totalFoods) * 100;

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
  
  const closeAddFood = () => {
    setAddingToCategory(null);
    setNewFoodZh('');
    setNewFoodEn('');
    setNewFoodAllergen(false);
  };

  const handleAddCustomFood = async () => {
    if (!newFoodZh.trim() || !addingToCategory) return;
    setIsSubmitting(true);
    
    const newFood = {
      category_id: addingToCategory,
      name: newFoodZh.trim(),
      en_name: newFoodEn.trim() || newFoodZh.trim(),
      allergen: newFoodAllergen ? (lang === 'zh' ? '自定义' : 'Custom') : null,
      en_allergen: newFoodAllergen ? 'Custom' : null,
    };
    
    const { data, error } = await supabase.from('custom_foods').insert([newFood]).select();
    
    if (data && !error) {
      const added = data[0];
      setCustomFoods(prev => [...prev, {
        id: added.id,
        name: added.name,
        enName: added.en_name,
        allergen: added.allergen,
        enAllergen: added.en_allergen,
        _categoryId: added.category_id
      } as any]);
    }
    
    setIsSubmitting(false);
    closeAddFood();
  };

  if (!isLoaded) return null;

  return (
    <>
      <div style={{ padding: 'env(safe-area-inset-top) 16px 40px' }} className="animate-fade-in">
        <header style={{ padding: '16px 0 16px', position: 'sticky', top: 0, backgroundColor: 'var(--bg-color)', zIndex: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '4px' }}>{t.title}</h1>
              <p style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500, letterSpacing: '0.5px' }}>{t.subtitle}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', paddingTop: '4px' }}>
              <button onClick={() => router.push('/dashboard')} style={{ padding: '6px 12px', borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'white', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-main)' }}>{t.dashboard}</button>
              <button onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')} style={{ padding: '6px 12px', borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'white', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-main)' }}>{t.toggleLang}</button>
            </div>
          </div>
          
          <div style={{ marginTop: '16px', backgroundColor: 'white', borderRadius: '16px', padding: '16px 20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#374151' }}>{t.progress}</span>
            <div style={{ flex: 1, height: '10px', backgroundColor: '#F3F4F6', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progressPercent}%`, backgroundColor: 'var(--primary-color)', transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary-color)' }}>{triedFoodsCount}/{totalFoods}</span>
          </div>

          <div style={{ marginTop: '16px' }}>
            <input 
              type="text" 
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '15px', backgroundColor: 'white', outline: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
            />
          </div>

          <div style={{ display: 'flex', overflowX: 'auto', gap: '8px', marginTop: '16px', paddingBottom: '8px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', marginRight: '-40px', paddingRight: '40px' }}>
            {FOOD_CATEGORIES.map(cat => (
              <button
                key={`nav-${cat.id}`}
                onClick={() => {
                  const el = document.getElementById(cat.id);
                  if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - 250;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                style={{ whiteSpace: 'nowrap', padding: '8px 14px', borderRadius: '20px', backgroundColor: 'white', border: `1px solid var(--border-color)`, fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer', flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
              >
                {lang === 'zh' ? cat.titleZh : cat.titleEn}
              </button>
            ))}
          </div>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {filteredCategories.map(cat => (
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
                      style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', backgroundColor: isChecked ? cat.color : 'white', border: `1.5px solid ${isChecked ? cat.color : 'var(--border-color)'}`, borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: isChecked ? 'none' : '0 2px 4px rgba(0,0,0,0.02)' }}
                    >
                      <div style={{ width: '24px', height: '24px', borderRadius: '12px', border: `2px solid ${isChecked ? 'white' : '#D1D5DB'}`, backgroundColor: isChecked ? '#10B981' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', flexShrink: 0 }}>
                        {isChecked && <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '15px', fontWeight: isChecked ? 700 : 500, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</div>
                        <div style={{ fontSize: '11px', color: isChecked ? 'rgba(0,0,0,0.5)' : '#9CA3AF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subName}</div>
                      </div>
                      
                      {food.allergen && !isChecked && (
                        <div style={{ fontSize: '10px', backgroundColor: '#FEE2E2', color: '#EF4444', padding: '2px 6px', borderRadius: '8px', fontWeight: 700, flexShrink: 0 }}>{t.allergenTag}</div>
                      )}
                    </div>
                  )
                })}
                
                {/* 新增食物按钮 */}
                {!searchQuery && (
                  <button 
                    onClick={() => setAddingToCategory(cat.id)}
                    style={{ padding: '12px 14px', backgroundColor: 'transparent', border: '1.5px dashed #D1D5DB', borderRadius: '16px', color: '#6B7280', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {t.addFood}
                  </button>
                )}
              </div>
            </div>
          ))}
          {filteredCategories.length === 0 && (
            <div style={{ textAlign: 'center', color: '#9CA3AF', marginTop: '40px' }}>无匹配食材</div>
          )}
        </div>
      </div>

      {/* 底部详情抽屉 */}
      {selectedFood && (
        <>
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40, backdropFilter: 'blur(2px)' }} onClick={closeSheet} />
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', borderTopLeftRadius: '28px', borderTopRightRadius: '28px', padding: '24px 24px max(32px, env(safe-area-inset-bottom))', zIndex: 50, boxShadow: '0 -10px 25px rgba(0,0,0,0.1)', animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={{ width: '48px', height: '5px', backgroundColor: '#E5E7EB', borderRadius: '3px', margin: '0 auto 24px' }} />
            <h3 style={{ fontSize: '24px', fontWeight: 800, textAlign: 'center', marginBottom: '4px', color: '#111827' }}>{lang === 'zh' ? selectedFood.name : selectedFood.enName}</h3>
            <p style={{ textAlign: 'center', color: '#6B7280', fontSize: '14px', marginBottom: '24px' }}>
              {lang === 'zh' ? selectedFood.enName : selectedFood.name} · {t.firstTried}: <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{records[selectedFood.id]?.date}</span>
            </p>
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: '#374151' }}>{t.reaction}</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {(['love', 'neutral', 'hate'] as const).map(reaction => {
                  const isSelected = records[selectedFood.id]?.reaction === reaction;
                  return (
                    <button key={reaction} onClick={() => handleUpdateRecord({ reaction })} style={{ flex: 1, padding: '16px 4px', borderRadius: '16px', border: `2px solid ${isSelected ? 'var(--primary-color)' : 'var(--border-color)'}`, backgroundColor: isSelected ? '#FFF3E0' : 'white', color: isSelected ? 'var(--primary-color)' : '#6B7280', fontSize: '15px', fontWeight: 700, transition: 'all 0.2s', transform: isSelected ? 'scale(1.02)' : 'scale(1)' }}>
                      {t[reaction]}
                    </button>
                  )
                })}
              </div>
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', backgroundColor: records[selectedFood.id]?.allergy ? '#FEE2E2' : '#F9FAFB', borderRadius: '16px', border: `2px solid ${records[selectedFood.id]?.allergy ? '#FCA5A5' : 'transparent'}`, transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>⚠️</span>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: records[selectedFood.id]?.allergy ? '#EF4444' : '#374151' }}>{t.allergyAlert}</span>
                </div>
                <input type="checkbox" checked={records[selectedFood.id]?.allergy || false} onChange={(e) => handleUpdateRecord({ allergy: e.target.checked })} style={{ width: '24px', height: '24px', accentColor: '#EF4444' }} />
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
              await supabase.from('food_records').insert({ food_id: selectedFood.id, date: record.date, reaction: record.reaction, allergy: record.allergy });
              closeSheet();
            }} className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '18px', borderRadius: '16px' }}>{t.done}</button>
            <button onClick={async () => {
              const newRecords = { ...records };
              delete newRecords[selectedFood.id];
              setRecords(newRecords);
              await supabase.from('food_records').delete().eq('food_id', selectedFood.id);
              closeSheet();
            }} style={{ width: '100%', padding: '16px', marginTop: '8px', backgroundColor: 'transparent', border: 'none', color: '#9CA3AF', fontWeight: 600, fontSize: '15px' }}>{t.cancel}</button>
          </div>
        </>
      )}

      {/* 新增食物抽屉 */}
      {addingToCategory && (
        <>
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40, backdropFilter: 'blur(2px)' }} onClick={closeAddFood} />
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', borderTopLeftRadius: '28px', borderTopRightRadius: '28px', padding: '24px 24px max(32px, env(safe-area-inset-bottom))', zIndex: 50, boxShadow: '0 -10px 25px rgba(0,0,0,0.1)', animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={{ width: '48px', height: '5px', backgroundColor: '#E5E7EB', borderRadius: '3px', margin: '0 auto 24px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 700, textAlign: 'center', marginBottom: '24px', color: '#111827' }}>{t.addFoodTitle}</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <input type="text" placeholder={t.foodNameZh} value={newFoodZh} onChange={e => setNewFoodZh(e.target.value)} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '16px', outline: 'none' }} />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <input type="text" placeholder={t.foodNameEn} value={newFoodEn} onChange={e => setNewFoodEn(e.target.value)} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '16px', outline: 'none' }} />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '12px', marginBottom: '32px' }}>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#374151' }}>{t.isAllergen}</span>
              <input type="checkbox" checked={newFoodAllergen} onChange={e => setNewFoodAllergen(e.target.checked)} style={{ width: '20px', height: '20px', accentColor: '#EF4444' }} />
            </label>

            <button onClick={handleAddCustomFood} disabled={!newFoodZh.trim() || isSubmitting} className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '18px', borderRadius: '16px', opacity: (!newFoodZh.trim() || isSubmitting) ? 0.5 : 1 }}>{t.submit}</button>
            <button onClick={closeAddFood} style={{ width: '100%', padding: '16px', marginTop: '8px', backgroundColor: 'transparent', border: 'none', color: '#9CA3AF', fontWeight: 600, fontSize: '15px' }}>{t.cancelAdd}</button>
          </div>
        </>
      )}
    </>
  );
}
