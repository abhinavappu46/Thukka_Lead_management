import React, { useState, useEffect } from 'react';
import { User, MessageSquare, CheckCircle, RefreshCcw, LogIn, Phone, Mail, ShieldCheck } from 'lucide-react';
import api from "../Api/axios";
import { LoadingState } from "../components/Common";
import "./ActivityLogs.css";

function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/Enquiry/activity-logs");
      setLogs(response.data.logs || []);
    } catch (err) {
      console.error("Error fetching activity logs:", err);
      setError("Failed to fetch activity logs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getLogIconConfig = (type) => {
    const t = type || 'Note';
    switch (t) {
      case 'Status Change':
        return { icon: RefreshCcw, color: 'bg-amber-950/40 border-amber-900/60 text-amber-400' };
      case 'Call':
        return { icon: Phone, color: 'bg-indigo-950/40 border-indigo-900/60 text-indigo-400' };
      case 'Email':
        return { icon: Mail, color: 'bg-indigo-950/40 border-indigo-900/60 text-indigo-400' };
      case 'Note':
        return { icon: MessageSquare, color: 'bg-blue-950/40 border-blue-900/60 text-blue-400' };
      case 'Follow-up Scheduled':
        return { icon: CheckCircle, color: 'bg-emerald-950/40 border-emerald-900/60 text-emerald-400' };
      default:
        return { icon: MessageSquare, color: 'bg-slate-950 border-slate-800 text-slate-400' };
    }
  };

  if (loading) {
    return <LoadingState message="Loading activity logs..." />;
  }

  if (error) {
    return (
      <div className="dashboard-error-container" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <ShieldCheck size={48} className="text-rose-500" style={{ margin: '0 auto 1rem' }} />
        <h3>Failed to Load Activity Logs</h3>
        <p style={{ color: '#94a3b8', margin: '0.5rem 0 1.5rem' }}>{error}</p>
        <button onClick={fetchLogs} className="dashboard-retry-btn" style={{ margin: '0 auto' }}>
          <RefreshCcw size={16} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="act-container">
      {/* Header */}
      <div className="act-header">
        <h1 className="act-title">Activity Logs</h1>
        <p className="act-subtitle">System audit log tracking all actions and changes across the sales dashboard.</p>
      </div>

      {/* Timeline Card */}
      <div className="act-card">
        <div className="act-timeline">
          {logs.length > 0 ? (
            logs.map((log, idx) => {
              const { icon: IconComponent, color } = getLogIconConfig(log.type);
              return (
                <div key={idx} className="act-item">
                  {/* Timeline dot/icon */}
                  <span className={`act-icon-box ${color}`}>
                    <IconComponent size={16} />
                  </span>

                  {/* Log Details */}
                  <div className="act-details">
                    <div className="act-row">
                      <p className="act-text">
                        <span className="font-semibold text-slate-200">{log.performedBy}</span>{" "}
                        <span className="text-slate-400 font-normal">{log.notes || log.type}</span>{" "}
                        {log.customerName && (
                          <span className="text-emerald-400 font-medium">
                            ({log.customerName} - {log.enquiryNumber})
                          </span>
                        )}
                      </p>
                      <span className="act-timestamp">
                        {log.time ? new Date(log.time).toLocaleString() : "N/A"}
                      </span>
                    </div>
                    <p className="act-id">Activity Type: {log.type || "General Audit"}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              No system activity logs found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActivityLogs;
