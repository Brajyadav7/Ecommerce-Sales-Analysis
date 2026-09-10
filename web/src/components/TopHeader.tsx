import React from 'react';
import { Menu, Sparkles, ExternalLink, Download, Share2 } from 'lucide-react';

interface TopHeaderProps {
  currentTab: string;
  onToggleSidebar: () => void;
  onExportSummary?: () => void;
}

const tabTitles: Record<string, { title: string; subtitle: string }> = {
  overview: { title: 'Executive Overview', subtitle: 'Macro sales performance, core KPIs, and revenue distribution' },
  revenue: { title: 'Revenue & Growth Trends', subtitle: 'Historical trajectory, seasonality, and monthly growth rates' },
  products: { title: 'Category & Product Performance', subtitle: 'Merchandise velocity, top products, and returns impact' },
  customers: { title: 'Customer Segmentation & RFM Model', subtitle: 'Recency, Frequency, Monetary scoring and retention strategies' },
  sql: { title: 'Interactive SQL Studio', subtitle: 'Real-world business SQL queries, CTEs, and window functions' },
  explorer: { title: 'Data & Transaction Explorer', subtitle: 'Live searchable transactions data table with CSV export' },
  insights: { title: 'Executive Insights & Recommendations', subtitle: 'Data-driven business decisions and operational improvements' },
  dictionary: { title: 'Data Dictionary & Methodology', subtitle: 'Schema reference, data cleaning pipeline, and metrics definitions' }
};

export const TopHeader: React.FC<TopHeaderProps> = ({ currentTab, onToggleSidebar, onExportSummary }) => {
  const current = tabTitles[currentTab] || { title: 'Analytics Dashboard', subtitle: 'E-Commerce Business Intelligence' };

  return (
    <header className="top-header">
      <div className="header-left">
        <button 
          className="btn btn-outline" 
          onClick={onToggleSidebar}
          style={{ padding: '8px', display: window.innerWidth < 1024 ? 'inline-flex' : 'none' }}
          title="Toggle Navigation"
        >
          <Menu size={18} />
        </button>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{current.title}</h1>
            <span className="page-title-badge">
              <Sparkles size={12} />
              <span>Live Dataset: 113,000 Records</span>
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {current.subtitle}
          </p>
        </div>
      </div>

      <div className="header-actions">
        {onExportSummary && (
          <button className="btn btn-outline" onClick={onExportSummary} title="Export Current View Data">
            <Download size={15} />
            <span>Export View</span>
          </button>
        )}
        <a 
          href="https://github.com/Brajyadav7/Ecommerce-Sales-Analysis" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          <ExternalLink size={15} />
          <span>Star Repo</span>
        </a>
      </div>
    </header>
  );
};
