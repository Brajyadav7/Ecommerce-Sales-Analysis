import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Database, 
  TableProperties, 
  Lightbulb, 
  BookOpen,
  Github,
  Globe,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, isOpen, onClose }) => {
  const navItems = [
    { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'revenue', label: 'Revenue Trends', icon: TrendingUp },
    { id: 'products', label: 'Category & Products', icon: ShoppingBag },
    { id: 'customers', label: 'Customer RFM Model', icon: Users },
    { id: 'sql', label: 'SQL Analysis Studio', icon: Database },
    { id: 'explorer', label: 'Data & Transactions', icon: TableProperties },
    { id: 'insights', label: 'Strategic Insights', icon: Lightbulb },
    { id: 'dictionary', label: 'Data Dictionary', icon: BookOpen }
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <a href="#overview" className="sidebar-brand" onClick={() => onSelectTab('overview')}>
          <div className="brand-icon">
            <TrendingUp size={22} />
          </div>
          <div>
            <div className="brand-title">E-Commerce BI</div>
            <div className="brand-subtitle">Analytics Studio</div>
          </div>
        </a>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Analytics Dashboards</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                onSelectTab(item.id);
                if (window.innerWidth < 1024) onClose();
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div className="nav-section-title" style={{ marginTop: '16px' }}>Project Links</div>
        <a 
          href="https://github.com/Brajyadav7/Ecommerce-Sales-Analysis" 
          target="_blank" 
          rel="noopener noreferrer"
          className="nav-item"
        >
          <Github size={18} />
          <span>GitHub Repository</span>
        </a>
      </nav>

      <div className="sidebar-footer">
        <div className="author-card">
          <div className="author-avatar">BY</div>
          <div>
            <div className="author-name">Braj Yadav</div>
            <div className="author-role">Data Analyst Portfolio</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
