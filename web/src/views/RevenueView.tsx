import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  DollarSign, 
  BarChart2, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { AnalyticsPayload, MonthlyTrend } from '../types/analytics';
import { FilterState } from '../components/FilterBar';

interface RevenueViewProps {
  data: AnalyticsPayload;
  filters: FilterState;
}

export const RevenueView: React.FC<RevenueViewProps> = ({ data, filters }) => {
  const { yearlyTrends, monthlyTrends } = data;
  const [selectedYear, setSelectedYear] = useState<string>(filters.year !== 'all' ? filters.year : '2020');

  // Filter trends
  const filteredMonthly = selectedYear === 'all'
    ? monthlyTrends
    : monthlyTrends.filter(m => m.year === parseInt(selectedYear));

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
    return `$${val.toFixed(2)}`;
  };

  return (
    <div className="content-area">
      {/* Yearly Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        {yearlyTrends.map((yt) => {
          const isSelected = selectedYear === yt.year.toString();
          return (
            <div 
              key={yt.year} 
              className={`glass-card ${isSelected ? 'active' : ''}`}
              style={{ 
                padding: '16px', 
                cursor: 'pointer',
                borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)',
                background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)'
              }}
              onClick={() => setSelectedYear(yt.year.toString())}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isSelected ? '#a5b4fc' : 'var(--text-secondary)' }}>
                  Year {yt.year}
                </span>
                <Calendar size={15} color={isSelected ? 'var(--accent-primary)' : 'var(--text-muted)'} />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '8px', color: '#fff' }}>
                {formatCurrency(yt.revenue)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {yt.orders.toLocaleString()} orders • AOV: ${yt.avgOrderValue.toFixed(0)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary Chart: Year-over-Year Comparison */}
      <div className="charts-grid-equal">
        <div className="glass-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Annual Revenue Progression (2015 - 2020)</h2>
              <p className="card-subtitle">Macro gross revenue comparison across operating fiscal years</p>
            </div>
            <BarChart2 size={18} color="var(--accent-primary)" />
          </div>

          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={11} tickFormatter={(v) => `$${(v / 1000000).toFixed(0)}M`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const yt = payload[0].payload;
                      return (
                        <div className="custom-tooltip">
                          <div className="tooltip-title">Fiscal Year {yt.year}</div>
                          <div className="tooltip-row">
                            <span>Total Revenue:</span>
                            <span>{formatCurrency(yt.revenue)}</span>
                          </div>
                          <div className="tooltip-row">
                            <span>Total Orders:</span>
                            <span>{yt.orders.toLocaleString()}</span>
                          </div>
                          <div className="tooltip-row">
                            <span>Avg Order Value:</span>
                            <span>${yt.avgOrderValue.toFixed(2)}</span>
                          </div>
                          <div className="tooltip-row">
                            <span>Return Rate:</span>
                            <span style={{ color: '#fb7185' }}>{yt.returnRate}%</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend for Selected Year */}
        <div className="glass-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Monthly Trajectory for {selectedYear}</h2>
              <p className="card-subtitle">Month-over-month revenue velocity and performance</p>
            </div>
            <Activity size={18} color="var(--accent-emerald)" />
          </div>

          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredMonthly} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="monthStr" 
                  stroke="#6b7280" 
                  fontSize={11}
                  tickFormatter={(val) => {
                    const parts = val.split('-');
                    return parts.length === 2 ? `M${parts[1]}` : val;
                  }}
                />
                <YAxis stroke="#6b7280" fontSize={11} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const m = payload[0].payload;
                      return (
                        <div className="custom-tooltip">
                          <div className="tooltip-title">{m.monthStr}</div>
                          <div className="tooltip-row">
                            <span>Monthly Revenue:</span>
                            <span>{formatCurrency(m.revenue)}</span>
                          </div>
                          <div className="tooltip-row">
                            <span>MoM Growth:</span>
                            <span style={{ color: m.growth >= 0 ? '#34d399' : '#fb7185' }}>
                              {m.growth >= 0 ? `+${m.growth}%` : `${m.growth}%`}
                            </span>
                          </div>
                          <div className="tooltip-row">
                            <span>Orders:</span>
                            <span>{m.orders.toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#10b981' }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Growth Breakdown Table (LAG Window Function Simulation) */}
      <div className="glass-card">
        <div className="card-header">
          <div>
            <h2 className="card-title">SQL LAG() Analysis: Month-over-Month Revenue Growth Table</h2>
            <p className="card-subtitle">Realized revenue differentials computed via SQL Window Functions</p>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Monthly Revenue</th>
                <th>Previous Month Revenue</th>
                <th>Absolute Growth ($)</th>
                <th>Growth Rate (%)</th>
                <th>Order Volume</th>
                <th>AOV</th>
                <th>Trajectory</th>
              </tr>
            </thead>
            <tbody>
              {filteredMonthly.map((m, idx) => {
                const prev = idx > 0 ? filteredMonthly[idx - 1].revenue : null;
                const diff = prev !== null ? m.revenue - prev : 0;
                const isPositive = diff >= 0;
                return (
                  <tr key={m.monthStr}>
                    <td style={{ fontWeight: 600 }}>{m.monthStr}</td>
                    <td style={{ fontWeight: 700, color: '#fff' }}>{formatCurrency(m.revenue)}</td>
                    <td>{prev !== null ? formatCurrency(prev) : '—'}</td>
                    <td style={{ color: isPositive ? '#34d399' : '#fb7185', fontWeight: 600 }}>
                      {prev !== null ? `${isPositive ? '+' : ''}${formatCurrency(diff)}` : 'Baseline'}
                    </td>
                    <td>
                      {prev !== null ? (
                        <span className={`status-pill ${isPositive ? 'status-delivered' : 'status-returned'}`}>
                          {isPositive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                          {m.growth}%
                        </span>
                      ) : '—'}
                    </td>
                    <td>{m.orders.toLocaleString()}</td>
                    <td>${m.avgOrderValue.toFixed(2)}</td>
                    <td>
                      <span style={{ fontSize: '0.78rem', color: isPositive ? '#10b981' : '#f43f5e' }}>
                        {isPositive ? 'Expansion 📈' : 'Contraction 📉'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
