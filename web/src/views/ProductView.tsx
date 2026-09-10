import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Layers, 
  AlertTriangle, 
  Star, 
  BarChart, 
  Package,
  Search,
  Filter
} from 'lucide-react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { AnalyticsPayload } from '../types/analytics';
import { FilterState } from '../components/FilterBar';

interface ProductViewProps {
  data: AnalyticsPayload;
  filters: FilterState;
}

export const ProductView: React.FC<ProductViewProps> = ({ data, filters }) => {
  const { categoryMetrics, topProducts, returnReasons } = data;
  const [selectedCategory, setSelectedCategory] = useState<string>(filters.category !== 'all' ? filters.category : 'all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
    return `$${val.toFixed(2)}`;
  };

  const filteredProducts = topProducts.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="content-area">
      {/* Category Deep Dive Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {categoryMetrics.map((c) => {
          const isSelected = selectedCategory === c.category;
          return (
            <div 
              key={c.category}
              className={`glass-card ${isSelected ? 'active' : ''}`}
              style={{
                padding: '20px',
                cursor: 'pointer',
                borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)',
                background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)'
              }}
              onClick={() => setSelectedCategory(isSelected ? 'all' : c.category)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{c.category}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-primary)' }}>{c.share}% Share</span>
              </div>

              <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '10px', color: '#fff' }}>
                {formatCurrency(c.revenue)}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                <span>{c.orders.toLocaleString()} orders</span>
                <span>Avg Price: ${c.avgPrice.toFixed(0)}</span>
              </div>

              <div style={{ marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>
                  Top Subcategories:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {c.subcategories.slice(0, 3).map((sub) => (
                    <span 
                      key={sub.name} 
                      style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-secondary)' }}
                    >
                      {sub.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Return Reasons & Root Cause Analysis */}
      <div className="charts-grid-equal">
        <div className="glass-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Return Root Cause Analysis (27% Return Rate)</h2>
              <p className="card-subtitle">Primary reasons for customer merchandise returns</p>
            </div>
            <AlertTriangle size={18} color="#fb7185" />
          </div>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart 
                data={returnReasons} 
                layout="vertical"
                margin={{ top: 10, right: 20, left: 140, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" stroke="#6b7280" fontSize={11} />
                <YAxis type="category" dataKey="reason" stroke="#e2e8f0" fontSize={11} width={135} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const r = payload[0].payload;
                      return (
                        <div className="custom-tooltip">
                          <div className="tooltip-title">{r.reason}</div>
                          <div className="tooltip-row">
                            <span>Occurrences:</span>
                            <span>{r.count.toLocaleString()}</span>
                          </div>
                          <div className="tooltip-row">
                            <span>Return Share:</span>
                            <span>{r.percentage}%</span>
                          </div>
                          <div className="tooltip-row">
                            <span>Reversed Revenue:</span>
                            <span style={{ color: '#fb7185' }}>{formatCurrency(r.lostRevenue)}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" fill="#f43f5e" radius={[0, 6, 6, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            {returnReasons.map((r, i) => (
              <div key={r.reason} style={{ flex: 1, background: 'rgba(244, 63, 94, 0.08)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{r.reason}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fb7185', marginTop: '2px' }}>{r.percentage}%</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{formatCurrency(r.lostRevenue)} loss</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quality & Rating Correlation Insights */}
        <div className="glass-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Category Quality & Satisfaction Matrix</h2>
              <p className="card-subtitle">Comparing return frequency against customer review scores</p>
            </div>
            <Star size={18} color="#f59e0b" />
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Revenue</th>
                  <th>Avg Price</th>
                  <th>Return Rate</th>
                  <th>Avg Rating</th>
                  <th>Health Status</th>
                </tr>
              </thead>
              <tbody>
                {categoryMetrics.map((c) => (
                  <tr key={c.category}>
                    <td style={{ fontWeight: 600 }}>{c.category}</td>
                    <td>{formatCurrency(c.revenue)}</td>
                    <td>${c.avgPrice.toFixed(0)}</td>
                    <td>
                      <span className="status-pill status-returned" style={{ fontSize: '0.75rem' }}>
                        {c.returnRate}%
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={12} fill="#f59e0b" color="#f59e0b" /> {c.avgRating.toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <span className="status-pill status-delivered" style={{ fontSize: '0.72rem' }}>
                        Healthy Margin
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '20px', background: 'rgba(16,185,129,0.08)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399', marginBottom: '2px' }}>
              📊 Key Analyst Takeaway:
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Return rates are remarkably uniform across all 5 departments (~27.0%), which indicates the return friction is driven primarily by catalog photography accuracy and delivery packaging rather than isolated defective items in one category.
            </div>
          </div>
        </div>
      </div>

      {/* Top 50 Products Data Grid */}
      <div className="glass-card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 className="card-title">Top Revenue-Generating Catalog Items</h2>
            <p className="card-subtitle">
              Ranked merchandise leaders sorted by aggregate gross sales
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: 'rgba(31, 41, 55, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 12px 6px 32px',
                  color: '#fff',
                  fontSize: '0.82rem',
                  outline: 'none',
                  width: '220px'
                }}
              />
            </div>

            {selectedCategory !== 'all' && (
              <button 
                className="btn btn-outline" 
                onClick={() => setSelectedCategory('all')} 
                style={{ padding: '6px 10px', fontSize: '0.75rem' }}
              >
                Clear Category ({selectedCategory})
              </button>
            )}
          </div>
        </div>

        <div className="table-container" style={{ maxHeight: '420px', overflowY: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Rank</th>
                <th>Product Description</th>
                <th>Category</th>
                <th>Units Sold</th>
                <th>Gross Revenue</th>
                <th>Avg Unit Price</th>
                <th>Avg Rating</th>
                <th>Return Rate</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.rank + p.product}>
                  <td style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>#{p.rank}</td>
                  <td style={{ fontWeight: 600, maxWidth: '360px', color: '#fff' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={p.product}>
                      {p.product}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '4px' }}>
                      {p.category}
                    </span>
                  </td>
                  <td>{p.unitsSold.toLocaleString()} units</td>
                  <td style={{ fontWeight: 700, color: '#10b981' }}>{formatCurrency(p.revenue)}</td>
                  <td>${p.avgPrice.toFixed(0)}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <Star size={12} fill="#f59e0b" color="#f59e0b" /> {p.avgRating.toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <span className="status-pill status-returned" style={{ fontSize: '0.72rem' }}>
                      {p.returnRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
