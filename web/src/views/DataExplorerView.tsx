import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Package, 
  Filter, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { AnalyticsPayload, SampleOrder } from '../types/analytics';
import { FilterState } from '../components/FilterBar';

interface DataExplorerViewProps {
  data: AnalyticsPayload;
  filters: FilterState;
}

export const DataExplorerView: React.FC<DataExplorerViewProps> = ({ data, filters }) => {
  const { sampleOrders } = data;
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>(filters.category !== 'all' ? filters.category : 'all');
  const [statusFilter, setStatusFilter] = useState<string>(filters.status !== 'all' ? filters.status : 'all');
  const [zoneFilter, setZoneFilter] = useState<string>(filters.zone !== 'all' ? filters.zone : 'all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 20;

  // Filtered dataset
  const filteredOrders = useMemo(() => {
    return sampleOrders.filter((order) => {
      const matchesSearch = 
        order.OrderID.toString().includes(searchTerm) ||
        order.CustomerID.toString().includes(searchTerm) ||
        order.Product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.Location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat = categoryFilter === 'all' || order['Product Category'] === categoryFilter;
      const matchesStat = statusFilter === 'all' || order.Status === statusFilter;
      const matchesZone = zoneFilter === 'all' || order.Zone === zoneFilter;

      return matchesSearch && matchesCat && matchesStat && matchesZone;
    });
  }, [sampleOrders, searchTerm, categoryFilter, statusFilter, zoneFilter]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) return;
    const headers = Object.keys(filteredOrders[0]);
    const csvRows = [
      headers.join(','),
      ...filteredOrders.map(row => 
        headers.map(header => {
          const val = row[header as keyof SampleOrder];
          const escaped = typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
          return escaped;
        }).join(',')
      )
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ecommerce_orders_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="content-area">
      {/* Controls Bar */}
      <div className="glass-card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1', minWidth: '240px', maxWidth: '380px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text"
              placeholder="Search by Order ID, Customer, Product, City..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                background: 'rgba(31, 41, 55, 0.8)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px 8px 32px',
                color: '#fff',
                fontSize: '0.82rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Inline Filter Selectors */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <select 
              className="select-input"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Categories</option>
              {data.categoryMetrics.map(c => (
                <option key={c.category} value={c.category}>{c.category}</option>
              ))}
            </select>

            <select 
              className="select-input"
              value={zoneFilter}
              onChange={(e) => {
                setZoneFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Zones</option>
              {data.zoneMetrics.map(z => (
                <option key={z.zone} value={z.zone}>{z.zone}</option>
              ))}
            </select>

            <select 
              className="select-input"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Statuses</option>
              <option value="Delivered">Delivered</option>
              <option value="Returned">Returned</option>
            </select>

            <button className="btn btn-primary" onClick={handleExportCSV} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-card" style={{ padding: '0' }}>
        <div className="table-container" style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Order Date</th>
                <th>Customer</th>
                <th>Location</th>
                <th>Zone</th>
                <th>Category</th>
                <th>Product Description</th>
                <th>Qty</th>
                <th>Total Revenue</th>
                <th>Fulfillment</th>
                <th>Status</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((o) => (
                <tr key={o.OrderID}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-primary)' }}>
                    #{o.OrderID}
                  </td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {o.OrderDate}
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>ID: {o.CustomerID}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{o['Customer Gender']}, Age {o['Customer Age']}</div>
                  </td>
                  <td>{o.Location}</td>
                  <td>
                    <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px' }}>
                      {o.Zone}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>{o['Product Category']}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{o.SubCategory}</div>
                  </td>
                  <td style={{ maxWidth: '240px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={o.Product}>
                      {o.Product}
                    </div>
                  </td>
                  <td>{o['Order Quantity']}</td>
                  <td style={{ fontWeight: 700, color: '#10b981' }}>
                    ${o.Revenue.toLocaleString()}
                  </td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {o['Delivery Type']}
                  </td>
                  <td>
                    <span className={`status-pill ${o.Status === 'Delivered' ? 'status-delivered' : 'status-returned'}`}>
                      {o.Status === 'Delivered' ? <CheckCircle2 size={11} /> : <AlertCircle size={11} />}
                      {o.Status}
                    </span>
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.78rem' }}>
                      <Star size={12} fill="#f59e0b" color="#f59e0b" /> {o.Rating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Showing <strong>{(currentPage - 1) * pageSize + 1}</strong> to <strong>{Math.min(currentPage * pageSize, filteredOrders.length)}</strong> of <strong>{filteredOrders.length}</strong> matching records
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              className="btn btn-outline" 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{ padding: '6px 12px', fontSize: '0.78rem', opacity: currentPage === 1 ? 0.4 : 1 }}
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, padding: '0 8px' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button 
              className="btn btn-outline" 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{ padding: '6px 12px', fontSize: '0.78rem', opacity: currentPage === totalPages ? 0.4 : 1 }}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
