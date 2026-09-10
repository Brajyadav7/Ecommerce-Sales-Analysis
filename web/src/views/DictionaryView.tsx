import React from 'react';
import { BookOpen, CheckCircle, Database, FileText, Layers, Terminal } from 'lucide-react';
import { AnalyticsPayload } from '../types/analytics';

interface DictionaryViewProps {
  data: AnalyticsPayload;
}

export const DictionaryView: React.FC<DictionaryViewProps> = ({ data }) => {
  const { dataDictionary, summary } = data;

  const cleaningSteps = [
    {
      step: '1. Timestamp Standardization',
      desc: 'Standardized mixed date formats (`OrderDate`, `Delivery Date`) using pandas `to_datetime()` with `dayfirst=True` and coerced irregular timestamps.'
    },
    {
      step: '2. Duplicate Elimination',
      desc: 'Applied `drop_duplicates()` across primary key and composite attributes to prevent artificial inflation of transaction counts.'
    },
    {
      step: '3. Order Status Filtering',
      desc: 'Separated active and completed transactions from cancelled records, computing accurate Return Rates on delivered merchandise.'
    },
    {
      step: '4. Revenue Feature Engineering',
      desc: 'Engineered `Revenue = Sale Price × Order Quantity` and extracted calendar attributes (`Year`, `Month`, `FirstPurchaseDate`) for cohort analysis.'
    },
    {
      step: '5. RFM Quantile Scoring',
      desc: 'Calculated Recency (days since max date), Frequency (count of orders), and Monetary (sum of spend). Discretized into quartiles (1-4) via `pd.qcut()`.'
    }
  ];

  return (
    <div className="content-area">
      {/* Pipeline Overview */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div className="card-header">
          <div>
            <h2 className="card-title">Data Cleaning & Feature Engineering Pipeline</h2>
            <p className="card-subtitle">
              Reproducible data preparation workflow executed in Python (`notebooks/ecommerce.ipynb`)
            </p>
          </div>
          <FileText size={20} color="var(--accent-primary)" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginTop: '10px' }}>
          {cleaningSteps.map((s) => (
            <div key={s.step} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '6px' }}>
                <CheckCircle size={15} color="#10b981" />
                {s.step}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Complete Data Dictionary */}
      <div className="glass-card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Enterprise Data Dictionary</h2>
            <p className="card-subtitle">Detailed metadata definitions for all {dataDictionary.length} dataset attributes</p>
          </div>
          <BookOpen size={18} color="var(--accent-emerald)" />
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '180px' }}>Field Name</th>
                <th style={{ width: '120px' }}>SQL Data Type</th>
                <th>Analytical Description & Range</th>
              </tr>
            </thead>
            <tbody>
              {dataDictionary.map((item) => (
                <tr key={item.column}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-primary)' }}>
                    `{item.column}`
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px' }}>
                      {item.type}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tech Stack & Architecture */}
      <div className="glass-card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Technology Stack & Implementation Architecture</h2>
            <p className="card-subtitle">Tools and libraries utilized across the end-to-end project</p>
          </div>
          <Layers size={18} color="var(--accent-amber)" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 700, color: '#60a5fa', marginBottom: '4px' }}>Python & Pandas</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Data preprocessing, duplicate removal, RFM scoring, datetime cohort parsing.
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 700, color: '#f59e0b', marginBottom: '4px' }}>SQL (MySQL 8.0)</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              CTEs, Window Functions (`LAG()`, `RANK() OVER`), Aggregation matrices, CLV.
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 700, color: '#a855f7', marginBottom: '4px' }}>Power BI (.PBIX)</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Desktop business reporting, executive dashboard visualizations, DAX calculations.
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 700, color: '#10b981', marginBottom: '4px' }}>Vite, React & Recharts</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Interactive live hosted web analytics studio, zero-backend deployment, 60fps charts.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
