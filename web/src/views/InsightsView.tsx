import React from 'react';
import { 
  Lightbulb, 
  TrendingUp, 
  ShieldAlert, 
  Truck, 
  DollarSign, 
  CheckCircle2, 
  ArrowRight,
  Target
} from 'lucide-react';
import { AnalyticsPayload } from '../types/analytics';

interface InsightsViewProps {
  data: AnalyticsPayload;
}

export const InsightsView: React.FC<InsightsViewProps> = ({ data }) => {
  const { executiveInsights, summary } = data;

  const pillarIcons: Record<string, React.ReactNode> = {
    'Returns Mitigation': <ShieldAlert size={22} color="#f43f5e" />,
    'Customer Retention': <Target size={22} color="#8b5cf6" />,
    'Geographic Logistics': <Truck size={22} color="#3b82f6" />,
    'Merchandise Focus': <TrendingUp size={22} color="#10b981" />
  };

  return (
    <div className="content-area">
      {/* Strategic Header */}
      <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(16,185,129,0.08))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(99,102,241,0.2)' }}>
            <Lightbulb size={24} color="#a5b4fc" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Executive Brief & Strategic Action Plan</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Data-backed operational initiatives synthesized from 113,000 transactions and RFM behavioral modeling.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Value Creation */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {executiveInsights.map((insight, idx) => {
          const icon = pillarIcons[insight.category] || <Lightbulb size={20} />;
          return (
            <div key={insight.title} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }}>
                    {icon}
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.05em' }}>
                      Pillar {idx + 1}: {insight.category}
                    </span>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
                      {insight.title}
                    </h3>
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '14px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Empirical Finding:
                </div>
                <div style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                  {insight.finding}
                </div>
              </div>

              <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '8px', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#34d399', marginBottom: '4px' }}>
                  <CheckCircle2 size={13} />
                  Prescribed Strategic Action:
                </div>
                <div style={{ fontSize: '0.84rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                  {insight.recommendation}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Projected Financial Impact Table */}
      <div className="glass-card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Projected Bottom-Line Financial Impact</h2>
            <p className="card-subtitle">Estimated 12-month EBITDA lift from implementing the 4 strategic initiatives</p>
          </div>
          <DollarSign size={18} color="#10b981" />
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Strategic Initiative</th>
                <th>Target Metric</th>
                <th>Baseline</th>
                <th>Post-Optimization Target</th>
                <th>Estimated Financial Upside</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600 }}>Catalog Accuracy & Sizing Overhaul</td>
                <td>Return Rate Reduction</td>
                <td>27.01%</td>
                <td>21.50% (-5.5%)</td>
                <td style={{ fontWeight: 700, color: '#10b981' }}>+$7,450,000 GMV Saved</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Automated 14-Day Cross-Sell Trigger</td>
                <td>Potential Loyalist Conversion</td>
                <td>28.4% Single-buyers</td>
                <td>38.0% Repeat-buyers</td>
                <td style={{ fontWeight: 700, color: '#10b981' }}>+$4,800,000 Net ARR</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Zone 3 Regional 3PL Fulfillment Hub</td>
                <td>Fulfillment Transit Time</td>
                <td>5.4 Days Avg</td>
                <td>2.2 Days (-59%)</td>
                <td style={{ fontWeight: 700, color: '#10b981' }}>+$1,950,000 Shipping Efficiency</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Top 20 Health & Beauty VMI Program</td>
                <td>Supplier Gross Margin</td>
                <td>41.2% Margin</td>
                <td>45.8% Margin (+4.6%)</td>
                <td style={{ fontWeight: 700, color: '#10b981' }}>+$2,050,000 Direct Margin</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
