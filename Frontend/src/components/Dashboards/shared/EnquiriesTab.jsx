import React, { useState } from 'react';
import { Search, Filter, Phone, Mail, UserPlus } from 'lucide-react';
import { PriorityBadge, EnquiryStatusBadge, EmptyState } from '../../Common';

function EnquiriesTab({
  enquiries,
  role,
  executives = [],
  onViewDetails,
  onAssign,
  onTriggerCall,
  onTriggerEmail
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [execFilter, setExecFilter] = useState('All');

  // Filtering Logic
  const filteredEnquiries = enquiries.filter(enq => {
    const matchesSearch =
      enq.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (enq.companyName && enq.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      enq.enquiryNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || enq.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || enq.priority === priorityFilter;

    let matchesExec = true;
    if (role === 'manager') {
      if (execFilter === 'Unassigned') {
        matchesExec = !enq.assignedTo;
      } else if (execFilter !== 'All') {
        matchesExec = enq.assignedTo && enq.assignedTo._id === execFilter;
      }
    }

    return matchesSearch && matchesStatus && matchesPriority && matchesExec;
  });

  return (
    <div className="dashboard-card list-view-card enquiries-tab-card">
      <div className="card-header-actions">
        <div className="controls-row">
          {/* Search box */}
          <div className="search-box-wrapper">
            <Search size={16} />
            <input
              type="text"
              placeholder={role === 'executive' ? 'Search my leads, company name...' : 'Search enquiries, company name, ID...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Status */}
          <div className="filter-select-wrapper">
            <Filter size={14} />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="follow_up">Follow-up</option>
              <option value="interested">Interested</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
              <option value="not_interested">Not Interested</option>
            </select>
          </div>

          {/* Filter Priority */}
          <div className="filter-select-wrapper">
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
              <option value="All">All Priorities</option>
              <option value="Hot">Hot</option>
              <option value="Warm">Warm</option>
              <option value="Cold">Cold</option>
            </select>
          </div>

          {/* Filter Executive (Manager Only) */}
          {role === 'manager' && (
            <div className="filter-select-wrapper">
              <select value={execFilter} onChange={(e) => setExecFilter(e.target.value)}>
                <option value="All">All Executives</option>
                <option value="Unassigned">Unassigned Only</option>
                {executives.map(ex => (
                  <option key={ex._id} value={ex._id}>{ex.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="crm-table">
          <thead>
            <tr>
              <th>Enquiry ID</th>
              <th>Customer Details</th>
              <th>Source</th>
              <th>Priority</th>
              <th>Status</th>
              {role === 'manager' && <th>Assigned Executive</th>}
              {role === 'executive' && <th>Contact Actions</th>}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnquiries.length > 0 ? (
              filteredEnquiries.map(enq => (
                <tr key={enq._id} className="crm-tr">
                  <td><span className="enq-number-badge">{enq.enquiryNumber}</span></td>
                  <td>
                    <div className="td-name">{enq.customerName}</div>
                    <div className="td-company">{enq.companyName || 'No Company'}</div>
                    <div className="td-contact">{enq.phone} • {enq.email}</div>
                  </td>
                  <td>{enq.source}</td>
                  <td><PriorityBadge priority={enq.priority} /></td>
                  <td><EnquiryStatusBadge status={enq.status} /></td>

                  {role === 'manager' && (
                    <td>
                      {enq.assignedTo ? (
                        <div className="assigned-user-badge">
                          <span>{enq.assignedTo.name}</span>
                        </div>
                      ) : (
                        <span className="unassigned-badge">Unassigned</span>
                      )}
                    </td>
                  )}

                  {role === 'executive' && (
                    <td>
                      <div className="contact-quick-buttons">
                        <button onClick={() => onTriggerCall(enq.phone, enq)} className="contact-btn phone" title="Call Customer">
                          <Phone size={13} /> Call
                        </button>
                        <button onClick={() => onTriggerEmail(enq.email, enq)} className="contact-btn email" title="Email Customer">
                          <Mail size={13} /> Email
                        </button>
                      </div>
                    </td>
                  )}

                  <td>
                    {role === 'manager' ? (
                      <div className="table-row-actions">
                        <button
                          onClick={() => onAssign(enq)}
                          className="assign-btn-action"
                        >
                          <UserPlus size={14} />
                          <span>{enq.assignedTo ? 'AssignExecutive' : 'Assign'}</span>
                        </button>
                        <button onClick={() => onViewDetails(enq)} className="details-btn-action">
                          View
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => onViewDetails(enq)} className="details-btn-action">
                        Open File
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-12">
                  <EmptyState
                    title={role === 'executive' ? 'No leads found' : 'No matching enquiries'}
                    description={role === 'executive' ? 'You do not have any enquiries matching your criteria.' : 'Adjust your filters to see more results.'}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EnquiriesTab;
