import React, { useState } from 'react';
import analyticsPayload from './data/analyticsData.json';
import { AnalyticsPayload } from './types/analytics';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { FilterBar, FilterState } from './components/FilterBar';
import { OverviewView } from './views/OverviewView';
import { RevenueView } from './views/RevenueView';
import { ProductView } from './views/ProductView';
import { CustomerView } from './views/CustomerView';
import { SqlStudioView } from './views/SqlStudioView';
import { DataExplorerView } from './views/DataExplorerView';
import { InsightsView } from './views/InsightsView';
import { DictionaryView } from './views/DictionaryView';

const data = analyticsPayload as AnalyticsPayload;

const initialFilters: FilterState = {
  year: 'all',
  category: 'all',
  zone: 'all',
  status: 'all'
};

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const categories = data.categoryMetrics.map(c => c.category);
  const zones = data.zoneMetrics.map(z => z.zone);

  const renderView = () => {
    switch (currentTab) {
      case 'overview':
        return <OverviewView data={data} filters={filters} />;
      case 'revenue':
        return <RevenueView data={data} filters={filters} />;
      case 'products':
        return <ProductView data={data} filters={filters} />;
      case 'customers':
        return <CustomerView data={data} />;
      case 'sql':
        return <SqlStudioView data={data} />;
      case 'explorer':
        return <DataExplorerView data={data} filters={filters} />;
      case 'insights':
        return <InsightsView data={data} />;
      case 'dictionary':
        return <DictionaryView data={data} />;
      default:
        return <OverviewView data={data} filters={filters} />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tabId) => setCurrentTab(tabId)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Wrapper */}
      <div className="main-wrapper">
        {/* Sticky Top Header */}
        <TopHeader
          currentTab={currentTab}
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        />

        {/* Dynamic Global Filter Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          years={data.summary.years}
          categories={categories}
          zones={zones}
        />

        {/* Tab View Content */}
        <main>
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
