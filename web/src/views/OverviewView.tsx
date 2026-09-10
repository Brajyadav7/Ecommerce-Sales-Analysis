import React from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  RotateCcw, 
  Star, 
  Truck, 
  ArrowUpRight, 
  Layers,
  MapPin
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from 'recharts';
import { AnalyticsPayload } from '../types/analytics';
import { FilterState } from '../components/FilterBar';

interface OverviewViewProps {
  data: AnalyticsPayload;
  filters: FilterState;
}

const CATEGORY_COLORS = ['#6366f1', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];
const ZONE_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f97316'];

export const OverviewView: React.FC<OverviewViewProps> = ({ data, filters }) => {
  const { summary, monthlyTrends, categoryMetrics, zoneMetrics, deliveryTypes } = data;

  // Filter trends if year is selected
  const displayTrends = filters.year !== 'all'
    ? monthlyTrends.filter(t => t.year === parseInt(filters.year))
    : monthlyTrends;

  // Format currency
  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
    return `$${val.toFixed(2)}`;
  };

  return (
    <div className="content-area">
      {/* KPI Cards */}
      <div className="kpi-grid">
        {/* Total Revenue */}
        <div className="kpi-card" style={{ '--card-accent': '#6366f1' } as React.CSSProperties}>
          <div className="kpi-header">
            <span className="kpi-title">Gross Revenue</span>
            <div className="kpi-icon"><DollarSign size={20} /></div>
          </div>
          <div className="kpi-value">{formatCurrency(summary.totalRevenue)}</div>
          <div className="kpi-footer">
            <span className="kpi-badge positive"><ArrowUpRight size={13} /> +124%</span>
            <span>2020 peak demand surge</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="kpi-card" style={{ '--card-accent': '#3b82f6' } as React.CSSProperties}>
          <div className="kpi-header">
            <span className="kpi-title">Total Orders</span>
            <div className="kpi-icon"><ShoppingCart size={20} /></div>
          </div>
          <div className="kpi-value">{summary.totalOrders.toLocaleString()}</div>
          <div className="kpi-footer">
            <span className="kpi-badge neutral">100% Verified</span>
            <span>Across 4 regional zones</span>
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="kpi-card" style={{ '--card-accent': '#10b981' } as React.CSSProperties}>
          <div className="kpi-header">
            <span className="kpi-title">Avg Order Value (AOV)</span>
            <div className="kpi-icon"><TrendingUp size={20} /></div>
          </div>
          <div className="kpi-value">${summary.avgOrderValue.toFixed(2)}</div>
          <div className="kpi-footer">
            <span className="kpi-badge positive">Healthy Basket</span>
            <span>Avg 4.8 units per order</span>
          </div>
        </div>

        {/* Customer Return Rate */}
        <div className="kpi-card" style={{ '--card-accent': '#f43f5e' } as React.CSSProperties}>
          <div className="kpi-header">
            <span className="kpi-title">Return Rate</span>
            <div className="kpi-icon"><RotateCcw size={20} /></div>
          </div>
          <div className="kpi-value">{summary.returnRate.toFixed(1)}%</div>
          <div className="kpi-footer">
            <span className="kpi-badge warning">{summary.returnedCount.toLocaleString()} orders</span>
            <span>$36.6M lost GMV</span>
          </div>
        </div>

        {/* Average Customer Rating */}
        <div className="kpi-card" style={{ '--card-accent': '#f59e0b' } as React.CSSProperties}>
          <div className="kpi-header">
            <span className="kpi-title">Customer Satisfaction</span>
            <div className="kpi-icon"><Star size={20} /></div>
          </div>
          <div className="kpi-value">{summary.avgRating.toFixed(2)} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 5.0</span></div>
          <div className="kpi-footer">
            <span className="kpi-badge neutral">Post-delivery reviews</span>
            <span>Quality focus area</span>
          </div>
        </div>
      </div>

      {/* Main Charts: Revenue Trend & Category Split */}
      <div className="charts-grid-2">
        {/* Revenue Timeline */}
        <div className="glass-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Historical Revenue Velocity</h2>
              <p className="card-subtitle">
                {filters.year === 'all' ? 'Monthly revenue progression from 2015 to 2020' : `Monthly performance for Year ${filters.year}`}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#6366f1' }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Revenue ($)</span>
            </div>
          </div>

          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="monthStr" 
                  stroke="#6b7280" 
                  fontSize={11}
                  tickFormatter={(val) => {
                    const parts = val.split('-');
                    return parts.length === 2 ? `${parts[1]}/${parts[0].slice(2)}` : val;
                  }}
                  interval={filters.year === 'all' ? 5 : 0}
                />
                <YAxis 
                  stroke="#6b7280" 
                  fontSize={11}
                  tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="custom-tooltip">
                          <div className="tooltip-title">{item.monthStr}</div>
                          <div className="tooltip-row">
                            <span>Revenue:</span>
                            <span>{formatCurrency(item.revenue)}</span>
                          </div>
                          <div className="tooltip-row">
                            <span>Orders:</span>
                            <span>{item.orders.toLocaleString()}</span>
                          </div>
                          <div className="tooltip-row">
                            <span>Avg Order Value:</span>
                            <span>${item.avgOrderValue.toFixed(2)}</span>
                          </div>
                          <div className="tooltip-row">
                            <span>Return Rate:</span>
                            <span style={{ color: '#fb7185' }}>{item.returnRate}%</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#6366f1" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#revenueGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Donut */}
        <div className="glass-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Category Distribution</h2>
              <p className="card-subtitle">Revenue contribution by merchandise line</p>
            </div>
            <Layers size={18} color="var(--accent-primary)" />
          </div>

          <div style={{ width: '100%', height: 220, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryMetrics}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="revenue"
                >
                  {categoryMetrics.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const cat = payload[0].payload;
                      return (
                        <div className="custom-tooltip">
                          <div className="tooltip-title">{cat.category}</div>
                          <div className="tooltip-row">
                            <span>Revenue:</span>
                            <span>{formatCurrency(cat.revenue)}</span>
                          </div>
                          <div className="tooltip-row">
                            <span>Share:</span>
                            <span>{cat.share}%</span>
                          </div>
                          <div className="tooltip-row">
                            <span>Total Orders:</span>
                            <span>{cat.orders.toLocaleString()}</span>
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

          {/* Category Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
            {categoryMetrics.map((cat, idx) => (
              <div key={cat.category} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{cat.category}</span>
                </div>
                <div style={{ fontWeight: 600 }}>
                  {formatCurrency(cat.revenue)} <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>({cat.share}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Row: Regional Logistics & Delivery Types */}
      <div className="charts-grid-equal">
        {/* Geographic Zones */}
        <div className="glass-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Geographic Performance by Zone</h2>
              <p className="card-subtitle">Revenue volume across shipping territories</p>
            </div>
            <MapPin size={18} color="var(--accent-emerald)" />
          </div>

          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneMetrics} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="zone" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} tickFormatter={(v) => `$${(v / 1000000).toFixed(0)}M`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const z = payload[0].payload;
                      return (
                        <div className="custom-tooltip">
                          <div className="tooltip-title">{z.zone}</div>
                          <div className="tooltip-row">
                            <span>Revenue:</span>
                            <span>{formatCurrency(z.revenue)}</span>
                          </div>
                          <div className="tooltip-row">
                            <span>Order Count:</span>
                            <span>{z.orders.toLocaleString()}</span>
                          </div>
                          <div className="tooltip-row">
                            <span>Avg Shipping:</span>
                            <span>${z.avgShippingFee.toFixed(2)}</span>
                          </div>
                          <div className="tooltip-row">
                            <span>Return Rate:</span>
                            <span style={{ color: '#fb7185' }}>{z.returnRate}%</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                  {zoneMetrics.map((_, index) => (
                    <Cell key={`zone-cell-${index}`} fill={ZONE_COLORS[index % ZONE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '16px', textAlign: 'center' }}>
            {zoneMetrics.map(z => (
              <div key={z.zone} style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{z.zone}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '2px' }}>{z.share}%</div>
                <div style={{ fontSize: '0.7rem', color: '#10b981' }}>{formatCurrency(z.revenue)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Fulfillment Delivery Types */}
        <div className="glass-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Fulfillment Speed & Logistics Mode</h2>
              <p className="card-subtitle">Volume breakdown and delivery reliability</p>
            </div>
            <Truck size={18} color="var(--accent-amber)" />
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fulfillment Type</th>
                  <th>Orders</th>
                  <th>Volume Share</th>
                  <th>Avg Shipping</th>
                  <th>Satisfaction</th>
                  <th>Return Rate</th>
                </tr>
              </thead>
              <tbody>
                {deliveryTypes.map((d) => (
                  <tr key={d.type}>
                    <td style={{ fontWeight: 600 }}>{d.type}</td>
                    <td>{d.orders.toLocaleString()}</td>
                    <td>{d.share}%</td>
                    <td>${d.avgShippingFee.toFixed(2)}</td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <Star size={12} fill="#f59e0b" color="#f59e0b" /> {d.avgRating.toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <span className="status-pill status-returned" style={{ fontSize: '0.72rem' }}>
                        {d.returnRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '16px', background: 'rgba(99,102,241,0.08)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.2)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a5b4fc', marginBottom: '2px' }}>
              💡 Logistics Analyst Observation:
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              "Shipped from Abroad" commands higher shipping fees ($11.50) and maintains comparable satisfaction ratings to domestic Standard Delivery, proving customer willingness to absorb cross-border fulfillment costs for unique inventory.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
