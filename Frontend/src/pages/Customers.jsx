import React, { useState } from 'react';
import { Search, UserCheck, CreditCard, Building, ShieldAlert, Award, Star, Compass } from 'lucide-react';
import "./Customers.css";

const initialCustomers = [
  { id: 'CUST-001', name: 'John Doe', company: 'Acme Corp', sector: 'Technology', spent: '$12,450', enquiriesCount: 3, age: '1 year', status: 'Active' },
  { id: 'CUST-002', name: 'Sarah Connor', company: 'Cyberdyne Systems', sector: 'Robotics', spent: '$45,000', enquiriesCount: 8, age: '2 years', status: 'Active' },
  { id: 'CUST-003', name: 'Bruce Wayne', company: 'Wayne Enterprises', sector: 'Defense', spent: '$180,000', enquiriesCount: 15, age: '3 years', status: 'Premium' },
  { id: 'CUST-004', name: 'Tony Stark', company: 'Stark Industries', sector: 'Energy', spent: '$320,000', enquiriesCount: 22, age: '4 years', status: 'Premium' },
  { id: 'CUST-005', name: 'Clark Kent', company: 'Daily Planet', sector: 'Media', spent: '$3,800', enquiriesCount: 2, age: '6 months', status: 'Inactive' }
];

function Customers() {
  const [customers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(cust =>
    cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cust.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cust.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Premium': return 'bg-purple-950/30 text-purple-400 border-purple-900/60';
      case 'Active': return 'bg-emerald-950/30 text-emerald-400 border-emerald-900/60';
      case 'Inactive': return 'bg-slate-950 text-slate-500 border-slate-800';
      default: return 'bg-slate-900 text-slate-400 border-slate-800';
    }
  };

  return (
    <div className="cust-container">
      {/* Header */}
      <div className="cust-header">
        <h1 className="cust-title">Customers Directory</h1>
        <p className="cust-subtitle">Manage client relationships, track lifetime value, and view account statuses.</p>
      </div>

      {/* Metric Widgets */}
      <div className="cust-stats-row">
        {[
          { label: 'Total Clients', value: customers.length, icon: Building, color: 'text-emerald-400', bg: 'bg-emerald-950/30 border-emerald-800/80' },
          { label: 'Premium Accounts', value: customers.filter(c => c.status === 'Premium').length, icon: Award, color: 'text-teal-400', bg: 'bg-teal-950/30 border-teal-800/80' },
          { label: 'Total Sales Revenue', value: '$561,250', icon: CreditCard, color: 'text-emerald-400', bg: 'bg-emerald-950/30 border-emerald-800/80' }
        ].map((stat, idx) => (
          <div key={idx} className="cust-stat-card">
            <div>
              <span className="cust-stat-label">{stat.label}</span>
              <p className="cust-stat-value">{stat.value}</p>
            </div>
            <div className={`cust-stat-icon-box ${stat.bg} ${stat.color}`}>
              <stat.icon size={22} />
            </div>
          </div>
        ))}
      </div>

      {/* Main List Box */}
      <div className="cust-main-box">
        {/* Search */}
        <div className="cust-search-bar">
          <div className="cust-search-input-box">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search by client name, company, id..."
              className="cust-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Directory Grid */}
        <div className="cust-grid">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((cust) => (
              <div key={cust.id} className="cust-item">
                <div className="cust-item-details">
                  <div className="cust-logo-box">
                    {cust.company.charAt(0)}
                  </div>
                  <div>
                    <div className="cust-name-header">
                      <h3 className="cust-name">{cust.name}</h3>
                      <span className={`cust-badge ${getStatusBadge(cust.status)}`}>
                        {cust.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mt-0.5">{cust.company} • <span className="text-xs font-mono text-slate-500">{cust.id}</span></p>
                    <div className="cust-meta">
                      <span className="cust-meta-text">
                        <Compass size={12} className="text-slate-500" />
                        Sector: <strong className="cust-meta-value">{cust.sector}</strong>
                      </span>
                      <span className="cust-meta-text">
                        <UserCheck size={12} className="text-slate-500" />
                        Age: <strong className="cust-meta-value">{cust.age}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="cust-spent-box">
                  <div className="cust-spent-item sm:text-left">
                    <span className="cust-spent-label">Inquiries</span>
                    <strong className="cust-spent-value">{cust.enquiriesCount}</strong>
                  </div>
                  <div className="cust-divider"></div>
                  <div className="cust-spent-item sm:text-right">
                    <span className="cust-spent-label">LTV Spent</span>
                    <strong className="text-emerald-400 text-sm font-bold block mt-0.5">{cust.spent}</strong>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500">
              No clients found matching search query.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Customers;
