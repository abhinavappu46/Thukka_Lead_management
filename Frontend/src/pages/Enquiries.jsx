import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MessageSquare, Phone, Mail, MoreVertical, Compass, CheckCircle2, AlertCircle, Clock, ShieldCheck, RefreshCw } from 'lucide-react';
import api from "../Api/axios";
import { LoadingState } from "../components/Common";
import "./Enquiries.css";

function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Edit State
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editAssignedTo, setEditAssignedTo] = useState('');
  const [updating, setUpdating] = useState(false);

  // Form State
  const [newEnqName, setNewEnqName] = useState('');
  const [newEnqCompany, setNewEnqCompany] = useState('');
  const [newEnqEmail, setNewEnqEmail] = useState('');
  const [newEnqPhone, setNewEnqPhone] = useState('');
  const [newEnqSource, setNewEnqSource] = useState('Website');
  const [newEnqPriority, setNewEnqPriority] = useState('Warm');
  const [newEnqNotes, setNewEnqNotes] = useState('');
  const [newEnqAssignedTo, setNewEnqAssignedTo] = useState('');
  const [executives, setExecutives] = useState([]);
  const [managers, SetManagers] = useState([]);

  const fetchEnquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/Enquiry/enquirys");
      setEnquiries(response.data.enquiries || []);

      const execResponse = await api.get("/user/executives");
      setExecutives(execResponse.data.executives || []);
      const managerRes = await api.get("/user/managers");
      SetManagers(managerRes.data.managers || []);
    } catch (err) {
      console.error("Error fetching enquiries:", err);
      setError("Failed to load enquiries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleAddEnquiry = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/Enquiry", {
        customerName: newEnqName,
        companyName: newEnqCompany,
        email: newEnqEmail,
        phone: newEnqPhone,
        source: newEnqSource.toLowerCase(),
        priority: newEnqPriority,
        notes: newEnqNotes,
        assignedTo: newEnqAssignedTo || null
      });

      if (response.data.success) {
        fetchEnquiries();
        setShowAddModal(false);
        // Reset Form
        setNewEnqName('');
        setNewEnqCompany('');
        setNewEnqEmail('');
        setNewEnqPhone('');
        setNewEnqSource('Website');
        setNewEnqPriority('Warm');
        setNewEnqNotes('');
        setNewEnqAssignedTo('');
      }
    } catch (err) {
      console.error("Error creating enquiry:", err);
      alert(err.response?.data?.message || "Failed to create enquiry.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEnquiry) return;

    setUpdating(true);
    try {
      // 1. If status changed, call status update endpoint
      if (editStatus !== selectedEnquiry.status) {
        await api.patch(`/Enquiry/enquiry/${selectedEnquiry.enquiryNumber}/status`, {
          status: editStatus,
          reason: "Updated via Enquiries list management."
        });
      }

      // 2. If assignment changed, call assign endpoint
      const currentAssignedId = selectedEnquiry.assignedTo ? (selectedEnquiry.assignedTo._id || selectedEnquiry.assignedTo) : '';
      if (editAssignedTo !== currentAssignedId) {
        await api.patch(`/Enquiry/${selectedEnquiry.enquiryNumber}/assign`, {
          assignedTo: editAssignedTo || null
        });
      }

      await fetchEnquiries();
      setShowEditModal(false);
      setSelectedEnquiry(null);
    } catch (err) {
      console.error("Error updating enquiry:", err);
      alert(err.response?.data?.message || "Failed to update enquiry status/assignment.");
    } finally {
      setUpdating(false);
    }
  };

  const filteredEnquiries = enquiries.filter(enq => {
    const matchesSearch =
      (enq.customerName && enq.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (enq.companyName && enq.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (enq.enquiryNumber && enq.enquiryNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    // Status filter mapping:
    let matchesStatus = false;
    const status = (enq.status || "").toLowerCase();
    if (statusFilter === 'All') {
      matchesStatus = true;
    } else if (statusFilter === 'New') {
      matchesStatus = ['new'].includes(status);
    } else if (statusFilter === 'In Progress') {
      matchesStatus = ['in progress', 'contacted', 'follow_up', 'follow-up', 'interested'].includes(status);
    } else if (statusFilter === 'Closed') {
      matchesStatus = ['closed', 'converted', 'lost', 'not_interested', 'not-interested'].includes(status);
    }

    return matchesSearch && matchesStatus;
  });

  const getPriorityStyle = (priority) => {
    const p = (priority || "").toLowerCase();
    switch (p) {
      case 'hot': return 'bg-rose-950/30 text-rose-400 border-rose-900/60';
      case 'warm': return 'bg-amber-950/30 text-amber-400 border-amber-900/60';
      case 'cold': return 'bg-sky-950/30 text-sky-400 border-sky-900/60';
      default: return 'bg-slate-900 text-slate-400 border-slate-800';
    }
  };

  const getStatusStyle = (status) => {
    const s = (status || "").toLowerCase();
    switch (s) {
      case 'new': return 'bg-emerald-950/30 text-emerald-400 border-emerald-900/60';
      case 'in progress':
      case 'follow_up':
      case 'contacted':
      case 'interested':
        return 'bg-amber-950/30 text-amber-400 border-amber-900/60';
      case 'closed':
      case 'converted':
      case 'lost':
        return 'bg-slate-950/30 text-slate-400 border-slate-800';
      default: return 'bg-slate-900 text-slate-400 border-slate-800';
    }
  };

  const formatStatus = (status) => {
    if (!status) return "";
    return status.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase());
  };

  const formatSource = (source) => {
    if (!source) return "";
    return source.replace(/\b\w/g, c => c.toUpperCase());
  };

  if (loading) {
    return <LoadingState message="Loading enquiries list..." />;
  }

  if (error) {
    return (
      <div className="dashboard-error-container">
        <ShieldCheck size={48} className="text-rose-500" />
        <h3>Failed to Load Enquiries</h3>
        <p>{error}</p>
        <button onClick={fetchEnquiries} className="dashboard-retry-btn">
          <RefreshCw size={16} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="enq-container">
      {/* Header section */}
      <div className="enq-header-box">
        <div className="enq-title-box">
          <h1 className="enq-title">Enquiries Management</h1>
          <p className="enq-subtitle">Capture, track, and qualify leads throughout your sales funnel.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="enq-new-btn"
        >
          <Plus size={16} />
          <span>New Lead</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="enq-stats-row">
        {[
          { label: 'Total Enquiries', count: enquiries.length, color: 'text-emerald-400', icon: MessageSquare, bg: 'bg-emerald-950/30 border-emerald-800/80' },
          { label: 'New Inquiries', count: enquiries.filter(e => ['new', 'New'].includes(e.status)).length, color: 'text-teal-400', icon: AlertCircle, bg: 'bg-teal-950/30 border-teal-800/80' },
          { label: 'In Progress', count: enquiries.filter(e => ['In Progress', 'in progress', 'contacted', 'follow_up', 'follow-up', 'interested'].includes(e.status)).length, color: 'text-amber-400', icon: Clock, bg: 'bg-amber-950/30 border-amber-800/80' },
          { label: 'Closed/Won', count: enquiries.filter(e => ['Closed', 'closed', 'converted', 'lost', 'not_interested', 'not-interested'].includes(e.status)).length, color: 'text-slate-400', icon: CheckCircle2, bg: 'bg-slate-900 border-slate-800' }
        ].map((item, idx) => (
          <div key={idx} className="enq-stat-card">
            <div>
              <span className="enq-stat-label">{item.label}</span>
              <p className="enq-stat-count">{item.count}</p>
            </div>
            <div className={`enq-stat-icon-box ${item.bg} ${item.color}`}>
              <item.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Table Card */}
      <div className="enq-table-card">
        {/* Controls */}
        <div className="enq-controls-bar">
          <div className="enq-search-box">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search by name, company, or ID..."
              className="enq-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="enq-filter-group">
            <Filter size={16} className="text-slate-500" />
            <span className="enq-filter-label">Status:</span>
            <div className="enq-filter-tabs">
              {['All', 'New', 'In Progress', 'Closed'].map((tab) => (
                <button
                  key={tab}
                  className={`enq-filter-tab ${statusFilter === tab ? 'bg-slate-800 text-emerald-400 shadow-xs' : 'text-slate-400 hover:text-slate-200'}`}
                  onClick={() => setStatusFilter(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="enq-table-wrapper">
          <table className="enq-table">
            <thead>
              <tr>
                <th className="enq-th">Inquiry Details</th>
                <th className="enq-th">Company</th>
                <th className="enq-th">Contact Info</th>
                <th className="enq-th">Source</th>
                <th className="enq-th">Priority</th>
                <th className="enq-th">Status</th>
                <th className="enq-th">Date Added</th>
                <th className="enq-th text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
              {filteredEnquiries.length > 0 ? (
                filteredEnquiries.map((enq) => (
                  <tr key={enq.enquiryNumber} className="enq-tr">
                    <td className="px-6 py-4">
                      <div className="enq-td-name">{enq.customerName}</div>
                      <div className="enq-td-id">{enq.enquiryNumber}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-medium">{enq.companyName || "N/A"}</td>
                    <td className="enq-contact-info">
                      <div className="enq-contact-item">
                        <Mail size={12} className="text-slate-500" />
                        <span>{enq.email || "N/A"}</span>
                      </div>
                      <div className="enq-contact-item">
                        <Phone size={12} className="text-slate-500" />
                        <span>{enq.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="enq-source-tag">
                        <Compass size={10} />
                        {formatSource(enq.source)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`enq-priority-badge ${getPriorityStyle(enq.priority)}`}>
                        {enq.priority || "Warm"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`enq-status-badge ${getStatusStyle(enq.status)}`}>
                        {formatStatus(enq.status)}
                      </span>
                    </td>
                    <td className="enq-date-text">
                      {enq.createdAt ? new Date(enq.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedEnquiry(enq);
                          setEditStatus(enq.status || 'new');
                          setEditAssignedTo(enq.assignedTo ? (enq.assignedTo._id || enq.assignedTo) : '');
                          setShowEditModal(true);
                        }}
                        className="enq-action-btn"
                        title="Manage Enquiry"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-slate-500">
                    No enquiries found matching filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Enquiry Modal Backdrop */}
      {showAddModal && (
        <div className="enq-modal-backdrop">
          <div className="enq-modal">
            <div className="enq-modal-header">
              <h3 className="enq-modal-title">Add New Inquiry</h3>
              <button onClick={() => setShowAddModal(false)} className="enq-modal-close-btn">×</button>
            </div>
            <form onSubmit={handleAddEnquiry} className="enq-modal-form">
              <div className="enq-form-row">
                <div className="enq-form-field">
                  <label className="enq-form-label">Contact Name</label>
                  <input
                    type="text"
                    required
                    className="enq-form-input"
                    placeholder="Enter name"
                    value={newEnqName}
                    onChange={(e) => setNewEnqName(e.target.value)}
                  />
                </div>
                <div className="enq-form-field">
                  <label className="enq-form-label">Company Name</label>
                  <input
                    type="text"
                    required
                    className="enq-form-input"
                    placeholder="Enter company"
                    value={newEnqCompany}
                    onChange={(e) => setNewEnqCompany(e.target.value)}
                  />
                </div>
              </div>
              <div className="enq-form-field">
                <label className="enq-form-label">Email Address</label>
                <input
                  type="email"
                  required
                  className="enq-form-input"
                  placeholder="e.g. name@company.com"
                  value={newEnqEmail}
                  onChange={(e) => setNewEnqEmail(e.target.value)}
                />
              </div>
              <div className="enq-form-field">
                <label className="enq-form-label">Phone Number</label>
                <input
                  type="tel"
                  required
                  className="enq-form-input"
                  placeholder="e.g. +1 (555) 012-3456"
                  value={newEnqPhone}
                  onChange={(e) => setNewEnqPhone(e.target.value)}
                />
              </div>
              <div className="enq-form-row">
                <div className="enq-form-field">
                  <label className="enq-form-label">Lead Source</label>
                  <select
                    className="enq-form-select"
                    value={newEnqSource}
                    onChange={(e) => setNewEnqSource(e.target.value)}
                  >
                    <option value="Website">Website</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Google">Google</option>
                    <option value="Referral">Referral</option>
                    <option value="Direct">Direct Engagement</option>
                  </select>
                </div>
                <div className="enq-form-field">
                  <label className="enq-form-label">Priority</label>
                  <select
                    className="enq-form-select"
                    value={newEnqPriority}
                    onChange={(e) => setNewEnqPriority(e.target.value)}
                  >
                    <option value="Hot">Hot (High)</option>
                    <option value="Warm">Warm (Medium)</option>
                    <option value="Cold">Cold (Low)</option>
                  </select>
                </div>
              </div>

              <div className="enq-form-field">
                <label className="enq-form-label">Assign To (Sales Executive)</label>
                <select
                  className="enq-form-select"
                  value={newEnqAssignedTo}
                  onChange={(e) => setNewEnqAssignedTo(e.target.value)}
                >
                  <option value="">-- Unassigned --</option>
                  {executives.map((exec) => (
                    <option key={exec._id} value={exec._id}>
                      {exec.name} ({exec.email})
                    </option>
                  ))}
                  {managers.map((manager) => (
                    <option key={manager._id} value={manager._id}>
                      {manager.name} ({manager.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="enq-form-field">
                <label className="enq-form-label">Requirement Notes</label>
                <textarea
                  className="enq-form-input enq-textarea"
                  placeholder="Describe initial details, budget, requirements..."
                  value={newEnqNotes}
                  onChange={(e) => setNewEnqNotes(e.target.value)}
                  rows={3}
                  style={{ minHeight: '80px', resize: 'vertical' }}
                />
              </div>

              <div className="enq-form-footer">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="enq-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="enq-save-btn"
                >
                  Save Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Status and Assignment Modal */}
      {showEditModal && selectedEnquiry && (
        <div className="enq-modal-backdrop">
          <div className="enq-modal">
            <div className="enq-modal-header">
              <h3 className="enq-modal-title">Manage Lead: {selectedEnquiry.enquiryNumber}</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedEnquiry(null);
                }}
                className="enq-modal-close-btn"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="enq-modal-form">
              <div className="enq-form-field">
                <label className="enq-form-label">Client Name</label>
                <input
                  type="text"
                  disabled
                  className="enq-form-input opacity-70"
                  value={selectedEnquiry.customerName || ""}
                  style={{ opacity: 0.7 }}
                />
              </div>

              <div className="enq-form-field">
                <label className="enq-form-label">Update Status</label>
                <select
                  className="enq-form-select"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="follow_up">Follow Up</option>
                  <option value="interested">Interested</option>
                  <option value="converted">Converted</option>
                  <option value="not_interested">Not Interested</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              <div className="enq-form-field">
                <label className="enq-form-label">Assign Executive</label>
                <select
                  className="enq-form-select"
                  value={editAssignedTo}
                  onChange={(e) => setEditAssignedTo(e.target.value)}
                >
                  <option value="">-- Keep Unassigned / Current --</option>
                  <optgroup label="Sales Executives">
                    {executives.map((exec) => (
                      <option key={exec._id} value={exec._id}>
                        {exec.name} ({exec.email})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Managers">
                    {managers.map((man) => (
                      <option key={man._id} value={man._id}>
                        {man.name} ({man.email})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="enq-form-footer">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedEnquiry(null);
                  }}
                  className="enq-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="enq-save-btn"
                >
                  {updating ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Enquiries;
