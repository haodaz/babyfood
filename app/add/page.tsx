'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddFoodPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 表单状态
  const [formData, setFormData] = useState({
    foodName: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    reaction: 'neutral',
    allergy: 'no',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: 调用 Supabase API 提交数据
    // 模拟网络请求
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setIsSubmitting(false);
    // 返回主页
    router.push('/');
  };

  return (
    <div style={{ padding: 'env(safe-area-inset-top) 20px 40px' }} className="animate-fade-in">
      <header className="nav-header">
        <Link href="/" className="back-btn">
          <ChevronLeft size={24} color="var(--text-main)" />
        </Link>
        <div className="nav-title">添加辅食记录</div>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
          
          <div className="form-group">
            <label className="form-label" htmlFor="foodName">食材名称 *</label>
            <input 
              type="text" 
              id="foodName" 
              name="foodName" 
              className="form-input" 
              placeholder="例如：米粉、苹果泥、胡萝卜" 
              required
              value={formData.foodName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label className="form-label" htmlFor="date">日期 *</label>
              <input 
                type="date" 
                id="date" 
                name="date" 
                className="form-input" 
                required
                value={formData.date}
                onChange={handleChange}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="form-label" htmlFor="amount">食用量 (克/毫升)</label>
              <input 
                type="number" 
                id="amount" 
                name="amount" 
                className="form-input" 
                placeholder="选填"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>
          </div>
          
        </div>

        <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
          
          <div className="form-group">
            <label className="form-label">宝宝的反应</label>
            <div className="radio-group">
              <label className="radio-label-wrapper">
                <input type="radio" name="reaction" value="love" checked={formData.reaction === 'love'} onChange={handleChange} />
                <div className="radio-box">
                  <span className="emoji">😍</span>
                  <span>很喜欢</span>
                </div>
              </label>
              <label className="radio-label-wrapper">
                <input type="radio" name="reaction" value="neutral" checked={formData.reaction === 'neutral'} onChange={handleChange} />
                <div className="radio-box">
                  <span className="emoji">😐</span>
                  <span>一般</span>
                </div>
              </label>
              <label className="radio-label-wrapper">
                <input type="radio" name="reaction" value="hate" checked={formData.reaction === 'hate'} onChange={handleChange} />
                <div className="radio-box">
                  <span className="emoji">😖</span>
                  <span>抗拒</span>
                </div>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">是否有过敏反应？</label>
            <div className="radio-group">
              <label className="radio-label-wrapper">
                <input type="radio" name="allergy" value="no" checked={formData.allergy === 'no'} onChange={handleChange} />
                <div className="radio-box">
                  <span className="emoji">✅</span>
                  <span>无异常</span>
                </div>
              </label>
              <label className="radio-label-wrapper">
                <input type="radio" name="allergy" value="yes" checked={formData.allergy === 'yes'} onChange={handleChange} />
                <div className="radio-box" style={{ borderColor: formData.allergy === 'yes' ? '#EF4444' : '', color: formData.allergy === 'yes' ? '#EF4444' : '', backgroundColor: formData.allergy === 'yes' ? '#FEE2E2' : '' }}>
                  <span className="emoji">⚠️</span>
                  <span>有过敏</span>
                </div>
              </label>
            </div>
          </div>
          
        </div>

        <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="notes">备注日志</label>
            <textarea 
              id="notes" 
              name="notes" 
              className="form-textarea" 
              placeholder="记录一下宝宝今天的表现吧，比如：第一次吃苹果，表情很可爱..."
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%', padding: '16px', fontSize: '18px' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? '保存中...' : '保存记录'}
        </button>
      </form>
    </div>
  );
}
