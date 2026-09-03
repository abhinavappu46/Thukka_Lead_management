import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, Users, DollarSign, Calendar, MessageSquare,
  ArrowUpRight, Clock, Plus, ArrowRight, ShieldCheck, RefreshCw, UserPlus, CheckCircle
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import api from "../Api/axios";
import { LoadingState } from "../components/Common";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEnquiries: 0,
    newEnquiries: 0,
    conversionRate: "0.0",
    followupsToday: 0,
    convertedCount: 0,
    salesValue: 0
  });
  const [chartData, setChartData] = useState([]);
  const [latestActivities, setLatestActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regForm, setRegForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "sales_executive"
  });
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // New Enquiry State
  const [showAddModal, setShowAddModal] = useState(false);
  const [executives, setExecutives] = useState([]);
  const [newEnqName, setNewEnqName] = useState('');
  const [newEnqCompany, setNewEnqCompany] = useState('');
  const [newEnqEmail, setNewEnqEmail] = useState('');
  const [newEnqPhone, setNewEnqPhone] = useState('');
  const [newEnqSource, setNewEnqSource] = useState('Website');
  const [newEnqPriority, setNewEnqPriority] = useState('Warm');
  const [newEnqNotes, setNewEnqNotes] = useState('');
  const [newEnqAssignedTo, setNewEnqAssignedTo] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (regForm.name.trim() === "") {
      setRegError("Name is required");
      return;
    }

    if (regForm.email.trim() === "") {
      setRegError("Email is required");
      return;
    }

    if (regForm.password === "") {
      setRegError("Password is required");
      return;
    }

    if (regForm.password.length < 8) {
      setRegError("Password must be at least 8 characters");
      return;
    }

    if (confirmPassword === "") {
      setRegError("Confirm password is required");
      return;
    }

    if (regForm.role === "") {
      setRegError("Role is required");
      return;
    }

    if (regForm.password !== confirmPassword) {
      setRegError("Passwords do not match");
      return;
    }
    setRegLoading(true);
    setRegError("");
    setRegSuccess("");
    try {
      const response = await api.post("/auth/register", regForm);
      if (response.data.user) {
        setRegSuccess("User registered successfully!");
        setRegForm({
          name: "",
          email: "",
          password: "",
          role: "sales_executive"
        });
        setConfirmPassword("");
        // Auto close modal after 1.5 seconds
        setTimeout(() => {
          setShowRegisterModal(false);
          setRegSuccess("");
        }, 1500);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setRegError(err.response?.data?.message || "Failed to register user");
    } finally {
      setRegLoading(false);
    }
  };

  const handleAddEnquiry = async (e) => {
    e.preventDefault();
    if (newEnqName.trim() === "") {
      setAddError("Customer name is required");
      return;
    }

    if (newEnqCompany.trim() === "") {
      setAddError("Company name is required");
      return;
    }

    if (newEnqEmail.trim() === "") {
      setAddError("Email is required");
      return;
    }

    if (newEnqPhone.trim() === "") {
      setAddError("Phone number is required");
      return;
    }

    if (newEnqPhone.length !== 10) {
      setAddError("Phone number must contain 10 digits");
      return;
    }
    setAddLoading(true);
    setAddError("");
    setAddSuccess("");


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
        setAddSuccess("Enquiry added successfully!");
        setNewEnqName('');
        setNewEnqCompany('');
        setNewEnqEmail('');
        setNewEnqPhone('');
        setNewEnqSource('Website');
        setNewEnqPriority('Warm');
        setNewEnqNotes('');
        setNewEnqAssignedTo('');

        // Refresh stats
        await fetchStats();

        setTimeout(() => {
          setShowAddModal(false);
          setAddSuccess("");
        }, 1500);
      }
    } catch (err) {
      console.error("Error adding lead:", err);
      setAddError(err.response?.data?.message || "Failed to add enquiry");
    } finally {
      setAddLoading(false);
    }
  };
  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/Enquiry/admin/stats");
      if (response.data.success) {
        setStats(response.data.stats);
        setChartData(response.data.chartData || []);
        setLatestActivities(response.data.latestActivities || []);
      } else {
        setError("Failed to load dashboard metrics");
      }

      const execResponse = await api.get("/user/executives");
      setExecutives(execResponse.data.executives || []);
    } catch (err) {
      console.error("Error fetching admin stats:", err);
      setError("Error connecting to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return <LoadingState message="Loading Sales Hub overview..." />;
  }

  if (error) {
    return (
      <div className="dashboard-error-container">
        <ShieldCheck size={48} className="text-rose-500" />
        <h3>Failed to Load Overview</h3>
        <p>{error}</p>
        <button onClick={fetchStats} className="dashboard-retry-btn">
          <RefreshCw size={16} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Top Banner/Welcome */}
      <div className="dashboard-welcome-banner">
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="dashboard-welcome-text-box">
          <h1 className="dashboard-welcome-title">Sales Hub Overview</h1>
          <p className="dashboard-welcome-desc">Welcome back, Admin. Here is what needs your attention today.</p>
        </div>
        <div className="relative z-10 flex gap-3 text-sm">
          <button
            onClick={() => setShowRegisterModal(true)}
            className="dashboard-register-user-btn"
            title="Register Team Member"
          >
            <UserPlus size={16} />
            <span>Add User</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="dashboard-new-lead-btn"
            title="Add New Enquiry"
          >
            <Plus size={16} />
            <span>New Lead</span>
          </button>
        </div>
      </div>

      {/* Stats Counter Grid */}
      <div className="dashboard-stats-grid">
        {[
          {
            id: 'total',
            label: 'Total Enquiries',
            value: stats.totalEnquiries.toLocaleString(),
            badge: 'All Time',
            icon: MessageSquare,
            iconClass: 'icon-emerald',
            badgeClass: 'badge-emerald'
          },
          {
            id: 'new',
            label: 'New Enquiries',
            value: stats.newEnquiries.toLocaleString(),
            badge: 'Active',
            icon: Users,
            iconClass: 'icon-sky',
            badgeClass: 'badge-sky'
          },
          {
            id: 'sales-value',
            label: 'Sales Value',
            value: `$${(stats.salesValue || 0).toLocaleString()}`,
            badge: 'Total Revenue',
            icon: DollarSign,
            iconClass: 'icon-emerald-glow',
            badgeClass: 'badge-emerald-glow',
            // isSalesValue: true
          },
          {
            id: 'conversion',
            label: 'Conversion Rate',
            value: `${stats.conversionRate}%`,
            badge: 'Win Rate',
            icon: TrendingUp,
            iconClass: 'icon-teal',
            badgeClass: 'badge-teal'
          },
          {
            id: 'converted',
            label: 'Converted Leads',
            value: stats.convertedCount.toLocaleString(),
            badge: 'Won Deals',
            icon: CheckCircle,
            iconClass: 'icon-green',
            badgeClass: 'badge-green'
          },
          {
            id: 'followups',
            label: 'Follow-ups Today',
            value: `${stats.followupsToday}`,
            badge: 'Scheduled',
            icon: Calendar,
            iconClass: 'icon-amber',
            badgeClass: 'badge-amber'
          }
        ].map((stat) => (
          <div key={stat.id} className={`dashboard-stat-card ${stat.isSalesValue ? 'stat-card-highlight' : ''}`}>
            <div className="stat-card-top">
              <span className="stat-card-label" title={stat.label}>{stat.label}</span>
              <div className={`stat-icon-wrapper ${stat.iconClass}`}>
                <stat.icon size={17} />
              </div>
            </div>

            <div className="stat-card-mid">
              <h3 className={`stat-card-value ${stat.isSalesValue ? 'value-emerald' : ''}`}>{stat.value}</h3>
            </div>

            <div className="stat-card-bottom">
              <span className={`stat-pill-badge ${stat.badgeClass}`}>
                <span className="stat-pill-dot"></span>
                {stat.badge}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Pipeline card converted into Converted & Lost Lead Analysis */}
      <div className="dashboard-pipeline-card">
        <div className="dashboard-pipeline-header">
          <div>
            <h3 className="dashboard-pipeline-title">Lead Conversion & Attrition Analysis</h3>
            <p className="dashboard-pipeline-subtitle">Comparison of successfully converted vs lost leads over the past six months.</p>
          </div>
          <button
            onClick={() => navigate('/Admin-dashboard/reports')}
            className="dashboard-view-funnel-btn"
          >
            <span>View Reports</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="dashboard-graph-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 0
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255, 255, 255, 0.05)"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                stroke="#64748b"
                tickLine={false}
                tick={{
                  fill: "#94a3b8",
                  fontSize: 11
                }}
              />

              <YAxis
                stroke="#64748b"
                tickLine={false}
                tick={{
                  fill: "#94a3b8",
                  fontSize: 11
                }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  borderColor: "rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  color: "#fff"
                }}
                itemStyle={{
                  color: "#fff"
                }}
                labelStyle={{
                  color: "#94a3b8",
                  fontWeight: "bold"
                }}
              />

              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{
                  fontSize: 12
                }}
              />

              <Bar
                dataKey="Converted"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />

              <Bar
                dataKey="Lost"
                fill="#f43f5e"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Latest Enquiry Activities Table */}
      <div className="dashboard-table-card">
        <div className="dashboard-table-header">
          <div>
            <h3 className="dashboard-table-title">Latest Enquiry Activities</h3>
            <p className="dashboard-table-subtitle">Real-time status updates of active leads and customer queries.</p>
          </div>
          <button
            onClick={() => navigate('/dashboard/enquiries')}
            className="dashboard-view-funnel-btn"
          >
            <span>View All Enquiries</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="dashboard-table-wrapper">
          <table className="dashboard-activity-table">
            <thead>
              <tr>
                <th>Enquiry ID</th>
                <th>Name</th>
                <th>Activity</th>
                <th>Time</th>
                <th style={{ width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {latestActivities.length > 0 ? (
                latestActivities.map((act, idx) => (
                  <tr key={idx} className="dashboard-table-row">
                    <td>
                      <span className="activity-id-badge">{act.id}</span>
                    </td>
                    <td className="activity-name-cell">{act.name}</td>
                    <td>
                      <div className="activity-desc-cell">
                        <span className="activity-status-dot"></span>
                        <span>{act.activity}</span>
                      </div>
                    </td>
                    <td className="activity-time-text">{formatRelativeTime(act.time)}</td>
                    <td className="activity-action-cell">
                      <button
                        onClick={() => navigate('/admin-dashboard/enquiries')}
                        className="activity-row-action-btn"
                        title="Open Enquiry Details"
                      >
                        <ArrowUpRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    No recent activities recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegisterModal && (
        <div className="dashboard-modal-backdrop">
          <div className="dashboard-modal-content">
            <div className="dashboard-modal-header">
              <h3>Register Team Member</h3>
              <button
                onClick={() => {
                  setShowRegisterModal(false);
                  setRegError("");
                  setRegSuccess("");
                  setConfirmPassword("");
                  setRegForm({
                    name: "",
                    email: "",
                    password: "",
                    role: "sales_executive"
                  });
                }}
                className="dashboard-modal-close-btn"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleRegisterSubmit} className="dashboard-modal-form">
              {regError && <div className="dashboard-modal-alert error">{regError}</div>}
              {regSuccess && <div className="dashboard-modal-alert success">{regSuccess}</div>}

              <div className="dashboard-modal-field">
                <label>Full Name</label>
                <input
                  type="text"

                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  placeholder="e.g. Jane Doe"
                />
              </div>

              <div className="dashboard-modal-field">
                <label>Email Address</label>
                <input
                  type="email"

                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  placeholder="name@company.com"
                />
              </div>

              <div className="dashboard-modal-field">
                <label>Password</label>
                <input
                  type="password"

                  value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                  placeholder="Minimum 8 characters"
                />
              </div>

              <div className="dashboard-modal-field">
                <label>Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type your password"
                />
              </div>

              <div className="dashboard-modal-field">
                <label>Role</label>
                <select
                  value={regForm.role}
                  onChange={(e) => setRegForm({ ...regForm, role: e.target.value })}
                >
                  <option value="sales_manager">Sales Manager</option>
                  <option value="sales_executive">Sales Executive</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="dashboard-modal-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowRegisterModal(false);
                    setRegError("");
                    setRegSuccess("");
                    setConfirmPassword("");
                    setRegForm({
                      name: "",
                      email: "",
                      password: "",
                      role: "sales_executive"
                    });
                  }}
                  className="dashboard-modal-btn secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={regLoading}
                  className="dashboard-modal-btn primary"
                >
                  {regLoading ? "Registering..." : "Register User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Enquiry Modal */}
      {showAddModal && (
        <div className="dashboard-modal-backdrop">
          <div className="dashboard-modal-content" style={{ maxWidth: '600px' }}>
            <div className="dashboard-modal-header">
              <h3>Create New Enquiry</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setAddError("");
                  setAddSuccess("");
                }}
                className="dashboard-modal-close-btn"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddEnquiry} className="dashboard-modal-form">
              {addError && <div className="dashboard-modal-alert error">{addError}</div>}
              {addSuccess && <div className="dashboard-modal-alert success">{addSuccess}</div>}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="dashboard-modal-field" style={{ marginBottom: 0 }}>
                  <label>Customer Name</label>
                  <input
                    type="text"
                    value={newEnqName}
                    onChange={(e) => setNewEnqName(e.target.value)}
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div className="dashboard-modal-field" style={{ marginBottom: 0 }}>
                  <label>Company Name</label>
                  <input
                    type="text"
                    value={newEnqCompany}
                    onChange={(e) => setNewEnqCompany(e.target.value)}
                    placeholder="e.g. Acme Corp"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="dashboard-modal-field" style={{ marginBottom: 0 }}>
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={newEnqEmail}
                    onChange={(e) => setNewEnqEmail(e.target.value)}
                    placeholder="name@company.com"
                  />
                </div>
                <div className="dashboard-modal-field" style={{ marginBottom: 0 }}>
                  <label>Phone Number</label>
                  <input
                    type="text"
                    maxLength={10}
                    value={newEnqPhone}
                    onChange={(e) => setNewEnqPhone(e.target.value)}
                    placeholder="e.g. +1 555-0199"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="dashboard-modal-field" style={{ marginBottom: 0 }}>
                  <label>Lead Source</label>
                  <select
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
                <div className="dashboard-modal-field" style={{ marginBottom: 0 }}>
                  <label>Priority</label>
                  <select
                    value={newEnqPriority}
                    onChange={(e) => setNewEnqPriority(e.target.value)}
                  >
                    <option value="Hot">Hot (High)</option>
                    <option value="Warm">Warm (Medium)</option>
                    <option value="Cold">Cold (Low)</option>
                  </select>
                </div>
              </div>

              <div className="dashboard-modal-field">
                <label>Assign To (Sales Executive)</label>
                <select
                  value={newEnqAssignedTo}
                  onChange={(e) => setNewEnqAssignedTo(e.target.value)}
                >
                  <option value="">-- Keep Unassigned --</option>
                  {executives.map((exec) => (
                    <option key={exec._id} value={exec._id}>
                      {exec.name} ({exec.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="dashboard-modal-field">
                <label>Requirement Notes</label>
                <textarea
                  value={newEnqNotes}
                  onChange={(e) => setNewEnqNotes(e.target.value)}
                  placeholder="Describe initial details, requirements..."
                  rows={3}
                  style={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    color: '#f1f5f9',
                    padding: '0.625rem 0.875rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    width: '100%',
                    boxSizing: 'border-box',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div className="dashboard-modal-actions">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="dashboard-modal-btn secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="dashboard-modal-btn primary"
                >
                  {addLoading ? "Saving..." : "Save Enquiry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;