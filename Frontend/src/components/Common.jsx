import React from "react";
import { 
  TrendingUp, TrendingDown, Clock, CheckCircle2, AlertCircle, 
  MessageSquare, User, Calendar, Phone, Mail, FileText, ChevronRight
} from "lucide-react";
import "./Common.css";

// 1. KpiCard Component
export function KpiCard({ label, value, change, isUp, icon: Icon, colorClass }) {
  return (
    <div className="kpi-card">
      <div className="kpi-card-content">
        <span className="kpi-label">{label}</span>
        <h3 className="kpi-value">{value}</h3>
        {change && (
          <div className="kpi-trend">
            <span className={isUp ? "trend-up" : "trend-down"}>
              {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {change}
            </span>
            <span className="trend-period">since last week</span>
          </div>
        )}
      </div>
      {Icon && (
        <div className={`kpi-icon-wrapper ${colorClass || ""}`}>
          <Icon size={20} />
        </div>
      )}
    </div>
  );
}

// 2. EnquiryStatusBadge Component
export function EnquiryStatusBadge({ status }) {
  const getStatusConfig = (statusStr = "") => {
    const s = statusStr.toLowerCase();
    switch (s) {
      case "new":
        return { label: "New", className: "badge-status-new" };
      case "contacted":
        return { label: "Contacted", className: "badge-status-contacted" };
      case "follow_up":
      case "follow-up":
        return { label: "Follow-up", className: "badge-status-followup" };
      case "interested":
        return { label: "Interested", className: "badge-status-interested" };
      case "converted":
        return { label: "Converted", className: "badge-status-converted" };
      case "lost":
        return { label: "Lost", className: "badge-status-lost" };
      case "not_interested":
      case "not interested":
        return { label: "Not Interested", className: "badge-status-notinterested" };
      default:
        return { label: statusStr || "Unknown", className: "badge-status-default" };
    }
  };

  const config = getStatusConfig(status);
  return (
    <span className={`status-badge ${config.className}`}>
      {config.label}
    </span>
  );
}

// 3. Priority Badge
export function PriorityBadge({ priority }) {
  const getPriorityStyle = (p = "") => {
    const pr = p.toLowerCase();
    switch (pr) {
      case "hot":
        return "priority-hot";
      case "warm":
        return "priority-warm";
      case "cold":
        return "priority-cold";
      default:
        return "priority-default";
    }
  };

  return (
    <span className={`priority-badge ${getPriorityStyle(priority)}`}>
      {priority || "Warm"}
    </span>
  );
}

// 4. ActivityTimeline Component
export function ActivityTimeline({ activities = [] }) {
  const getActivityIcon = (type = "") => {
    const t = type.toLowerCase();
    if (t.includes("call")) return <Phone size={12} />;
    if (t.includes("email")) return <Mail size={12} />;
    if (t.includes("whatsapp")) return <MessageSquare size={12} />;
    if (t.includes("meeting")) return <User size={12} />;
    if (t.includes("status")) return <Clock size={12} />;
    if (t.includes("follow-up") || t.includes("followup")) return <Calendar size={12} />;
    return <FileText size={12} />;
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="empty-timeline">
        <p>No activity recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="activity-timeline">
      {activities.map((act, index) => (
        <div key={act._id || index} className="timeline-item">
          <div className="timeline-marker">
            <div className="timeline-dot">
              {getActivityIcon(act.activityType)}
            </div>
            {index < activities.length - 1 && <div className="timeline-connector"></div>}
          </div>
          <div className="timeline-content">
            <div className="timeline-header">
              <span className="activity-type-label">{act.activityType}</span>
              <span className="activity-time">
                {new Date(act.createdAt).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </span>
            </div>
            <p className="activity-notes">{act.notes}</p>
            {act.performedBy && (
              <span className="activity-author">by {act.performedBy.name || act.performedBy}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// 5. FollowUpCard Component
export function FollowUpCard({ followUp, onAction }) {
  const getFollowUpTypeIcon = (type = "") => {
    const t = type.toLowerCase();
    if (t.includes("call")) return <Phone size={14} />;
    if (t.includes("email")) return <Mail size={14} />;
    return <Calendar size={14} />;
  };

  const isOverdue = new Date(followUp.followUpDate) < new Date() && followUp.status === "pending";

  return (
    <div className={`follow-up-card ${isOverdue ? "overdue" : ""}`}>
      <div className="follow-up-meta">
        <div className="follow-up-type-icon">
          {getFollowUpTypeIcon(followUp.followUpType)}
        </div>
        <div className="follow-up-details">
          <h4>{followUp.followUpType || "Follow-up"}</h4>
          <p className="follow-up-time-text">
            {new Date(followUp.followUpDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })} at {followUp.followUpTime || "N/A"}
          </p>
        </div>
      </div>
      <div className="follow-up-body">
        <p>{followUp.notes || "No additional notes provided."}</p>
        {isOverdue && <span className="overdue-label">Overdue</span>}
      </div>
      {onAction && (
        <button onClick={() => onAction(followUp)} className="follow-up-action-btn">
          View Enquiry <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

// 6. ConfirmationModal Component
export function ConfirmationModal({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel" }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop-common">
      <div className="modal-container-common">
        <div className="modal-header-common">
          <h3>{title}</h3>
        </div>
        <div className="modal-body-common">
          <p>{message}</p>
        </div>
        <div className="modal-footer-common">
          <button onClick={onCancel} className="modal-btn-cancel">
            {cancelText}
          </button>
          <button onClick={onConfirm} className="modal-btn-confirm">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// 7. LoadingState and EmptyState Components
export function LoadingState({ message = "Loading content..." }) {
  return (
    <div className="loading-state-wrapper">
      <div className="loading-spinner"></div>
      <p>{message}</p>
    </div>
  );
}

export function EmptyState({ title = "No data found", description = "There are no records to display here." }) {
  return (
    <div className="empty-state-wrapper">
      <div className="empty-state-icon">
        <FileText size={48} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
