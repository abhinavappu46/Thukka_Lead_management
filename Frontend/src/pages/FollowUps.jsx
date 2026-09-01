import React, { useState, useEffect } from 'react';
import { Calendar, PhoneCall, Mail, MessageSquare, CheckCircle, Clock, AlertTriangle, Play, Sparkles } from 'lucide-react';
import "./FollowUps.css";
import api from "../Api/axios";

function FollowUps() {
  const [tasks, setTasks] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedEnquiryNumber, setSelectedEnquiryNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [followUpType, setFollowUpType] = useState("Call");
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpTime, setFollowUpTime] = useState("");
  const [followUpNotes, setFollowUpNotes] = useState("");
  const [followUpReminder, setFollowUpReminder] = useState(false);

  useEffect(() => {
    fetchFollowUps();
  }, []);

  const fetchFollowUps = async () => {
    setLoading(true);
    try {
      const response = await api.get("/Enquiry/enquirys");
      if (response.data.success) {
        setEnquiries(response.data.enquiries || []);

        // Extract and flatten all follow-ups
        const extractedTasks = (response.data.enquiries || []).flatMap(enquiry =>
          (enquiry.followUps || []).map(f => ({
            id: f._id,
            enquiryNumber: enquiry.enquiryNumber,
            name: enquiry.customerName,
            company: enquiry.companyName || "N/A",
            type: f.followUpType,
            scheduledFor: `${f.followUpDate ? f.followUpDate.split("T")[0] : ""} ${f.followUpTime || ""}`,
            status: f.status,
            notes: f.notes,
            reminder: f.reminder
          }))
        );
        console.log(extractedTasks);

        // Sort by status priority then by date
        const statusPriority = { overdue: 0, pending: 1, completed: 2 };
        const sortedTasks = extractedTasks.sort((a, b) => {
          const statusA = a.status?.toLowerCase() || "pending";
          const statusB = b.status?.toLowerCase() || "pending";
          if (statusPriority[statusA] !== statusPriority[statusB]) {
            return statusPriority[statusA] - statusPriority[statusB];
          }
          return new Date(a.scheduledFor) - new Date(b.scheduledFor);
        });

        setTasks(sortedTasks);
      }
    } catch (err) {
      console.error("Error fetching follow-ups:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEnquiryNumber || !followUpDate || !followUpTime) return;

    try {
      const response = await api.patch(`/Enquiry/enquiry/${selectedEnquiryNumber}/followup`, {
        followUpDate,
        followUpTime,
        followUpType,
        notes: followUpNotes,
        reminder: followUpReminder
      });

      if (response.data.success) {
        fetchFollowUps();
        closeModal();
      }
    } catch (err) {
      console.error("Failed to schedule follow-up:", err);
      alert(err.response?.data?.message || "Failed to schedule follow-up.");
    }
  };

  const closeModal = () => {
    setShowScheduleModal(false);
    setSelectedEnquiryNumber("");
    setCustomerName("");
    setCompanyName("");
    setFollowUpType("Call");
    setFollowUpDate("");
    setFollowUpTime("");
    setFollowUpNotes("");
    setFollowUpReminder(false);
  };

  const handleCompleteTask = async (task) => {
    try {
      console.log(task.id);
      const response = await api.patch(`/Enquiry/enquiry/${task.enquiryNumber}/followup/${task.id}/complete`);
      if (response.data.success) {
        fetchFollowUps();
      }
    } catch (err) {
      console.error("STATUS:", err.response?.status);
      console.error("MESSAGE:", err.response?.data?.message);
      console.error("DATA:", err.response?.data);
      console.error("REQUEST URL:", err.config?.url);

      alert(
        `Status: ${err.response?.status}\n` +
        `Message: ${err.response?.data?.message}`
      );
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return <CheckCircle className="text-emerald-400" size={18} />;
      case 'pending': return <Clock className="text-blue-400" size={18} />;
      case 'scheduled': return <Calendar className="text-indigo-400" size={18} />;
      case 'overdue': return <AlertTriangle className="text-rose-400" size={18} />;
      default: return <Clock className="text-slate-500" size={18} />;
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-emerald-950/30 border-emerald-900/60 text-emerald-400';
      case 'pending': return 'bg-blue-950/30 border-blue-900/60 text-blue-400';
      case 'scheduled': return 'bg-indigo-950/30 border-indigo-900/60 text-indigo-400';
      case 'overdue': return 'bg-rose-950/30 border-rose-900/60 text-rose-400 animate-pulse';
      default: return 'bg-slate-900 border-slate-800 text-slate-400';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Call': return <PhoneCall size={14} />;
      case 'Email': return <Mail size={14} />;
      case 'Meeting': return <MessageSquare size={14} />;
      case 'WhatsApp': return <MessageSquare size={14} />;
      default: return <Sparkles size={14} />;
    }
  };

  return (
    <div className="flw-container">
      {/* Header */}
      <div className="flw-header">
        <div>
          <h1 className="flw-title">Follow-ups & Tasks</h1>
          <p className="flw-subtitle">Schedule, assign, and execute follow-up items on active leads.</p>
        </div>
        <button
          onClick={() => setShowScheduleModal(true)}
          className="flw-schedule-btn"
        >
          <Calendar size={16} />
          <span>Schedule Follow-up</span>
        </button>
      </div>

      {/* Task List */}
      <div className="flw-list">
        {loading ? (
          <div className="flw-loading-spinner-container">
            <div className="flw-loading-spinner"></div>
            <p>Loading follow-up tasks...</p>
          </div>
        ) : tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className="flw-card">

              {/* Task core details */}
              <div className="flw-card-details">
                <div className="flw-meta-row">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border ${getStatusClass(task.status)}`}>
                    {getStatusIcon(task.status)}
                    {task.status}
                  </span>
                  <span className="flw-type-badge">
                    {getTypeIcon(task.type)}
                    {task.type}
                  </span>
                  <span className="flw-id-text">{task.enquiryNumber}</span>
                </div>

                <div>
                  <h3 className="flw-name">{task.name}</h3>
                  <p className="flw-company">{task.company}</p>
                </div>

                <p className="flw-notes">{task.notes}</p>
              </div>

              {/* Date and Action */}
              <div className="flw-action-row">
                <div className="flw-date-box">
                  <span className="flw-date-label">Scheduled Date</span>
                  <strong className="flw-date-value">{task.scheduledFor}</strong>
                </div>

                {task.status?.toLowerCase() !== 'completed' && (
                  <button
                    onClick={() => handleCompleteTask(task)}
                    className="flw-complete-btn"
                  >
                    <Play size={12} className="fill-emerald-400" />
                    <span>Mark Complete</span>
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flw-empty-state">
            <Calendar size={48} className="text-slate-600" style={{ marginBottom: '1rem' }} />
            <h3>No Scheduled Follow-ups</h3>
            <p>Select "Schedule Follow-up" to create a task for an enquiry.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showScheduleModal && (
        <div className="flw-modal-backdrop">
          <div className="flw-modal-content">
            <div className="flw-modal-header">
              <h3>Schedule New Follow-up</h3>
              <button onClick={closeModal} className="flw-modal-close-btn">&times;</button>
            </div>
            <form onSubmit={handleScheduleSubmit} className="flw-modal-form">
              <div className="flw-modal-field">
                <label>Select Enquiry / Lead</label>
                <select
                  required
                  value={selectedEnquiryNumber}
                  onChange={(e) => {
                    const eqNum = e.target.value;
                    setSelectedEnquiryNumber(eqNum);
                    const selected = enquiries.find(enq => enq.enquiryNumber === eqNum);
                    if (selected) {
                      setCustomerName(selected.customerName);
                      setCompanyName(selected.companyName || "N/A");
                    } else {
                      setCustomerName("");
                      setCompanyName("");
                    }
                  }}
                >
                  <option value="">-- Choose Lead / Enquiry --</option>
                  {enquiries.map((enq) => (
                    <option key={enq.enquiryNumber} value={enq.enquiryNumber}>
                      {enq.customerName} {enq.companyName ? `(${enq.companyName})` : ""} - {enq.enquiryNumber}
                    </option>
                  ))}
                </select>
              </div>

              {customerName && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", opacity: 0.85 }}>
                  <div className="flw-modal-field">
                    <label>Customer Name</label>
                    <input type="text" readOnly value={customerName} style={{ backgroundColor: "#1e293b/50", color: "#94a3b8", cursor: "not-allowed" }} />
                  </div>
                  <div className="flw-modal-field">
                    <label>Company</label>
                    <input type="text" readOnly value={companyName} style={{ backgroundColor: "#1e293b/50", color: "#94a3b8", cursor: "not-allowed" }} />
                  </div>
                </div>
              )}

              <div className="flw-modal-field">
                <label>Follow-up Medium</label>
                <select
                  value={followUpType}
                  onChange={(e) => setFollowUpType(e.target.value)}
                >
                  <option value="Call">Call (Phone)</option>
                  <option value="Email">Email Response</option>
                  <option value="Meeting">Meeting (In-person/Online)</option>
                  <option value="WhatsApp">WhatsApp Message</option>
                </select>
              </div>

              <div className="flw-modal-datetime-row">
                <div className="flw-modal-field">
                  <label>Date</label>
                  <input
                    type="date"
                    required
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                  />
                </div>
                <div className="flw-modal-field">
                  <label>Time</label>
                  <input
                    type="time"
                    required
                    value={followUpTime}
                    onChange={(e) => setFollowUpTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="flw-modal-field">
                <label>Notes / Agenda</label>
                <textarea
                  value={followUpNotes}
                  onChange={(e) => setFollowUpNotes(e.target.value)}
                  placeholder="Describe the objective of this follow-up..."
                  rows={3}
                />
              </div>

              {/* <div className="flw-modal-checkbox-group">
                <input
                  type="checkbox"
                  id="reminder_opt"
                  checked={followUpReminder}
                  onChange={(e) => setFollowUpReminder(e.target.checked)}
                />
                <label htmlFor="reminder_opt">Enable email reminder alert</label>
              </div> */}

              <div className="flw-modal-actions">
                <button type="button" onClick={closeModal} className="flw-modal-btn secondary">
                  Cancel
                </button>
                <button type="submit" className="flw-modal-btn primary">
                  Schedule Follow-up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FollowUps;
