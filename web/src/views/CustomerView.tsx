import React, { useState } from 'react';
import { 
  Users, 
  Crown, 
  Heart, 
  Compass, 
  Clock, 
  UserX, 
  PieChart as PieIcon, 
  Sparkles,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { AnalyticsPayload, RfmSegment } from '../types/analytics';

interface CustomerViewProps {
  data: AnalyticsPayload;
}

const SEGMENT_ICONS: Record<string, React.ReactNode> = {
  'Champions': <Crown size={18} color="#10b981" />,
  'Loyal Customers': <Heart size={18} color="#3b82f6" />,
  'Potential Loyalists': <Compass size={18} color="#8b5cf6" />,
  'Regular Customers': <Clock size={18} color="#f59e0b" />,
  'Lost Customers': <UserX size={18} color="#ef4444" />
};

export const CustomerView: React.FC<CustomerViewProps> = ({ data }) => {
  const { rfmSegments, demographics, summary } = data;
  const [activeSegment, setActiveSegment] = useState<string>('Champions');

  const selectedSegmentData = rfmSegments.find(s => s.segment === activeSegment) || rfmSegments[0];

  return (
    <div className="content-area">
      {/* RFM Model Summary Row */}
      <div className="charts-grid-2">
        {/* RFM Model Explanation & Active Segment Detail */}
        <div className="glass-card" style={{ borderColor: selectedSegmentData.color }}>
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)' }}>
                {SEGMENT_ICONS[selectedSegmentData.segment] || <Users size={18} />}
              </div>
              <div>
                <h2 className="card-title" style={{ color: selectedSegmentData.color }}>
                  Segment: {selectedSegmentData.segment}
                </h2>
                <p className="card-subtitle">
                  {selectedSegmentData.count.toLocaleString()} Customers ({selectedSegmentData.percentage}% of Base)
                </p>
              </div>
            </div>
            <span className="status-pill" style={{ background: `${selectedSegmentData.color}25`, color: selectedSegmentData.color, border: `1px solid ${selectedSegmentData.color}50` }}>
              RFM Profile
            </span>
          </div>

          <p style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.6, marginBottom: '20px' }}>
            {selectedSegmentData.description}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                Avg Recency
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                {selectedSegmentData.avgRecencyDays} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>days</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Since last order</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                Avg Frequency
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                {selectedSegmentData.avgFrequency} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>orders</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Lifetime transactions</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                Avg Monetary Value
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
                ${selectedSegmentData.avgMonetary.toFixed(0)}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Historical spend</div>
            </div>
          </div>

          <div style={{ background: `${selectedSegmentData.color}15`, border: `1px solid ${selectedSegmentData.color}40`, padding: '14px 18px', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: selectedSegmentData.color, marginBottom: '4px' }}>
              <Sparkles size={14} />
              Strategic Retention Action:
            </div>
            <div style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.5 }}>
              {selectedSegmentData.strategy}
            </div>
          </div>
        </div>

        {/* RFM Pie Distribution */}
        <div className="glass-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">RFM Customer Segmentation Breakdown</h2>
              <p className="card-subtitle">Distribution of 113,000 customers across segments</p>
            </div>
            <PieIcon size={18} color="var(--accent-primary)" />
          </div>

          <div style={{ width: '100%', height: 230 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={rfmSegments}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {rfmSegments.map((entry) => (
                    <Cell 
                      key={`rfm-cell-${entry.segment}`} 
                      fill={entry.color} 
                      stroke={activeSegment === entry.segment ? '#fff' : 'transparent'}
                      strokeWidth={activeSegment === entry.segment ? 2 : 0}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const s = payload[0].payload as RfmSegment;
                      return (
                        <div className="custom-tooltip">
                          <div className="tooltip-title" style={{ color: s.color }}>{s.segment}</div>
                          <div className="tooltip-row">
                            <span>Customers:</span>
                            <span>{s.count.toLocaleString()}</span>
                          </div>
                          <div className="tooltip-row">
                            <span>Share of Base:</span>
                            <span>{s.percentage}%</span>
                          </div>
                          <div className="tooltip-row">
                            <span>Avg Recency:</span>
                            <span>{s.avgRecencyDays} days</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
            {rfmSegments.map((s) => (
              <button
                key={s.segment}
                className="nav-item"
                style={{
                  padding: '6px 10px',
                  background: activeSegment === s.segment ? 'rgba(255,255,255,0.06)' : 'transparent',
                  borderColor: activeSegment === s.segment ? s.color : 'transparent'
                }}
                onClick={() => setActiveSegment(s.segment)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.color }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>{s.segment}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {s.count.toLocaleString()} <span style={{ color: 'var(--text-muted)' }}>({s.percentage}%)</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Demographics Row: Age Groups & Gender Analysis */}
      <div className="charts-grid-equal">
        {/* Age Groups */}
        <div className="glass-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Customer Age Distribution</h2>
              <p className="card-subtitle">Order volume across generational cohorts</p>
            </div>
            <Users size={18} color="var(--accent-primary)" />
          </div>

          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demographics.ageDistribution} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="group" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="custom-tooltip">
                          <div className="tooltip-title">Age Group: {item.group}</div>
                          <div className="tooltip-row">
                            <span>Order Count:</span>
                            <span>{item.orders.toLocaleString()}</span>
                          </div>
                          <div className="tooltip-row">
                            <span>Revenue Generated:</span>
                            <span>${(item.revenue / 1000000).toFixed(2)}M</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="orders" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Distribution */}
        <div className="glass-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Gender Demographics & Purchasing Power</h2>
              <p className="card-subtitle">Order and revenue parity between customer segments</p>
            </div>
            <Users size={18} color="var(--accent-emerald)" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }}>
            {demographics.genderDistribution.map((g) => {
              const isFemale = g.gender === 'F';
              return (
                <div 
                  key={g.gender} 
                  style={{
                    background: isFemale ? 'rgba(236, 72, 153, 0.08)' : 'rgba(59, 130, 246, 0.08)',
                    border: `1px solid ${isFemale ? 'rgba(236, 72, 153, 0.25)' : 'rgba(59, 130, 246, 0.25)'}`,
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isFemale ? '#f472b6' : '#60a5fa' }}>
                    {isFemale ? 'Female Buyers (F)' : 'Male Buyers (M)'}
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: '#fff' }}>
                    {g.orders.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Total Orders ({((g.orders / summary.totalOrders) * 100).toFixed(1)}%)
                  </div>
                  <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#10b981' }}>
                      ${(g.revenue / 1000000).toFixed(2)}M
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Aggregate Gross Spend</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Balanced demographic engagement with nearly 50/50 split across genders, showing broad appeal across core consumer electronics, lifestyle health, and fashion categories.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
