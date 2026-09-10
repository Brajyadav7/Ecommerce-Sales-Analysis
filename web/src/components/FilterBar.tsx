import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

export interface FilterState {
  year: string;
  category: string;
  zone: string;
  status: string;
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onReset: () => void;
  years: number[];
  categories: string[];
  zones: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  years,
  categories,
  zones
}) => {
  const isFiltered = filters.year !== 'all' || filters.category !== 'all' || filters.zone !== 'all' || filters.status !== 'all';

  return (
    <div className="filter-bar">
      <div className="filters-group">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-primary)', marginRight: '8px' }}>
          <Filter size={16} />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Filters:
          </span>
        </div>

        {/* Year Filter */}
        <div className="filter-item">
          <label className="filter-label">Year:</label>
          <select 
            className="select-input"
            value={filters.year}
            onChange={(e) => onFilterChange('year', e.target.value)}
          >
            <option value="all">All Years (2015-2020)</option>
            {years.map((y) => (
              <option key={y} value={y.toString()}>{y}</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="filter-item">
          <label className="filter-label">Category:</label>
          <select 
            className="select-input"
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Zone Filter */}
        <div className="filter-item">
          <label className="filter-label">Zone:</label>
          <select 
            className="select-input"
            value={filters.zone}
            onChange={(e) => onFilterChange('zone', e.target.value)}
          >
            <option value="all">All Zones</option>
            {zones.map((z) => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="filter-item">
          <label className="filter-label">Order Status:</label>
          <select 
            className="select-input"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Delivered">Delivered</option>
            <option value="Returned">Returned</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {isFiltered && (
          <button className="btn btn-outline" onClick={onReset} style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
            <RotateCcw size={13} />
            <span>Reset Filters</span>
          </button>
        )}
        <div className="filter-status-pill">
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isFiltered ? '#f59e0b' : '#10b981' }} />
          <span>{isFiltered ? 'Active Filter Applied' : 'Showing Complete Dataset'}</span>
        </div>
      </div>
    </div>
  );
};
