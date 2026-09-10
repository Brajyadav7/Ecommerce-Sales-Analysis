import React, { useState } from 'react';
import { 
  Database, 
  Play, 
  Copy, 
  Check, 
  Terminal, 
  Code, 
  Sparkles,
  Table,
  HelpCircle
} from 'lucide-react';
import { AnalyticsPayload, SqlQuery } from '../types/analytics';

interface SqlStudioViewProps {
  data: AnalyticsPayload;
}

export const SqlStudioView: React.FC<SqlStudioViewProps> = ({ data }) => {
  const { sqlQueries, dataDictionary } = data;
  const [selectedQueryId, setSelectedQueryId] = useState<string>(sqlQueries[0].id);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'results' | 'schema'>('results');

  const currentQuery = sqlQueries.find(q => q.id === selectedQueryId) || sqlQueries[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentQuery.query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get result columns
  const resultColumns = currentQuery.result.length > 0 
    ? Object.keys(currentQuery.result[0]) 
    : [];

  return (
    <div className="content-area">
      {/* Introduction Banner */}
      <div className="glass-card" style={{ padding: '18px 24px', background: 'linear-gradient(90deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={20} color="var(--accent-primary)" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>SQL Analytics Engine & Query Inspector</h2>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Production MySQL queries powering the E-Commerce KPI calculations, CTE pipelines, and analytical window functions.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="status-pill status-delivered" style={{ padding: '4px 10px' }}>
              <Terminal size={12} /> Dialect: MySQL 8.0+
            </span>
          </div>
        </div>
      </div>

      {/* Main Studio Layout */}
      <div className="sql-layout">
        {/* Left Column: Query Selector */}
        <div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '10px' }}>
            Predefined Analytical Queries:
          </div>

          {sqlQueries.map((q) => {
            const isSelected = q.id === selectedQueryId;
            return (
              <div 
                key={q.id}
                className={`sql-query-item ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedQueryId(q.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.7rem', color: isSelected ? 'var(--accent-primary)' : 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    {q.category}
                  </span>
                  {isSelected && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)' }} />}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: isSelected ? '#fff' : 'var(--text-secondary)' }}>
                  {q.title}
                </div>
              </div>
            );
          })}

          <div style={{ marginTop: '16px' }}>
            <button 
              className={`nav-item ${activeTab === 'schema' ? 'active' : ''}`}
              style={{ width: '100%', border: '1px solid var(--border-subtle)', background: activeTab === 'schema' ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)' }}
              onClick={() => setActiveTab(activeTab === 'schema' ? 'results' : 'schema')}
            >
              <Table size={16} />
              <span>{activeTab === 'schema' ? 'Return to Query Results' : 'View Table Schema'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Code Editor & Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Query Code Box */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{currentQuery.title}</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {currentQuery.description}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button className="btn btn-outline" onClick={handleCopy} style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                  {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                  <span>{copied ? 'Copied' : 'Copy SQL'}</span>
                </button>
              </div>
            </div>

            <div className="sql-editor-box">
              <code>{currentQuery.query}</code>
            </div>
          </div>

          {/* Results Output or Schema Table */}
          {activeTab === 'results' ? (
            <div className="glass-card" style={{ padding: '20px' }}>
              <div className="card-header" style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Terminal size={16} color="var(--accent-emerald)" />
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Query Execution Output</h3>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({currentQuery.result.length} rows returned)</span>
                </div>
                <span className="status-pill status-delivered" style={{ fontSize: '0.72rem' }}>
                  Status: 200 OK • Execution: ~14ms
                </span>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      {resultColumns.map((col) => (
                        <th key={col}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentQuery.result.map((row, idx) => (
                      <tr key={idx}>
                        {resultColumns.map((col) => (
                          <td key={col} style={{ fontWeight: col.toLowerCase().includes('revenue') || col.toLowerCase().includes('lifetime') ? 700 : 400 }}>
                            {row[col]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '20px' }}>
              <div className="card-header" style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Table size={16} color="var(--accent-primary)" />
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Database Table Schema: `ecommerce_data`</h3>
                </div>
                <span className="status-pill neutral" style={{ fontSize: '0.72rem' }}>
                  20 Defined Columns
                </span>
              </div>

              <div className="table-container" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Column Field</th>
                      <th>Data Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataDictionary.map((item) => (
                      <tr key={item.column}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-primary)' }}>
                          `{item.column}`
                        </td>
                        <td>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px' }}>
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
          )}
        </div>
      </div>
    </div>
  );
};
