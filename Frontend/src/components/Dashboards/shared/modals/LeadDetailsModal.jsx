import React from 'react';
import { Phone, Mail, Edit, Plus, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { PriorityBadge, EnquiryStatusBadge, ActivityTimeline } from '../../../Common';

function LeadDetailsModal({
  enquiry,
  role,
  onClose,
  onEditStatusClick,
  onTriggerCall,
  onAddNoteClick,
  onScheduleFollowUpClick,
  onMarkConverted,
  onMarkLost,
  OpenWhatsapp
}) {
  if (!enquiry) return null;

  return (
    <div className="modal-backdrop-common" style={{ zIndex: 1000, }}>
      <div className="modal-container-common" style={{ maxWidth: "100vw", maxHeight: "100vh", overflowY: "auto" }}>
        <div className="modal-header-common justify-between flex">
          <h3>Lead File: {enquiry.customerName} ({enquiry.enquiryNumber})</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="modal-body-common scroll-vertical max-h-500" style={{ padding: "20px" }}>
          <div className="details-header-grid-ex">
            <div>
              <span className="lbl">Company</span>
              <p className="val">{enquiry.companyName || "N/A"}</p>
            </div>
            <div>
              <span className="lbl">Contact Info</span>
              <p className="val">{enquiry.phone} • {enquiry.email}</p>
            </div>
            <div>
              <span className="lbl">Priority</span>
              <p className="val"><PriorityBadge priority={enquiry.priority} /></p>
            </div>
            <div>
              <span className="lbl">Status</span>
              <p className="val d-flex align-center gap-10">
                <EnquiryStatusBadge status={enquiry.status} />
                {role === "executive" && (
                  <button
                    onClick={() => onEditStatusClick(enquiry.status)}
                    className="edit-status-quick-btn"
                  >
                    <Edit size={12} /> Change
                  </button>
                )}
              </p>
            </div>
            {role === "manager" && (
              <div>
                <span className="lbl">Assigned Executive</span>
                <p className="val">{enquiry.assignedTo?.name || "Unassigned"}</p>
              </div>
            )}
            {role === "manager" && (
              <div>
                <span className="lbl">Source</span>
                <p className="val">{enquiry.source}</p>
              </div>
            )}
          </div>

          {/* CRM Action Buttons (Executive Only) */}
          {role === 'executive' && (
            <div className="workspace-action-buttons">
              <button onClick={() => onTriggerCall(enquiry.phone, enquiry)} className="w-btn call">
                <Phone size={14} /> Log Call
              </button>
              <button
                onClick={() => onAddNoteClick('Note')}
                className="w-btn note"
              >
                <Plus size={14} /> Add Note
              </button>
              <button
                onClick={onScheduleFollowUpClick}
                className="w-btn followup"
              >
                <Calendar size={14} /> Schedule Follow-up
              </button>
              <button
                onClick={onScheduleFollowUpClick}
                className="w-btn followup"
              >
                <Calendar size={14} /> Schedule Follow-up
              </button>
            </div>
          )}

          {/* Description / Notes */}
          <div className="lead-description-box">
            <span className="lbl">Initial Enquiry Notes</span>
            <p className="desc-text-box">{enquiry.notes || "No description notes logged."}</p>
          </div>

          {/* Split Feed: Left Activities, Right Followups */}
          <div className="lead-split-feed">
            <div className="feed-column">
              <h4>Activities & Call Logs</h4>
              <ActivityTimeline activities={enquiry.activities} />
            </div>
            <div className="feed-column">
              <h4>Scheduled Follow-ups</h4>
              {enquiry.followUps && enquiry.followUps.length > 0 ? (
                <div className="inline-followups-list">
                  {enquiry.followUps.map((f, i) => (
                    <div key={i} className={`inline-followup-item ${f.status}`}>
                      <div className="head">
                        <span className="type">{f.followUpType}</span>
                        <span className="status">{f.status}</span>
                      </div>
                      <span className="time">{new Date(f.followUpDate).toLocaleDateString()} at {f.followUpTime}</span>
                      <p className="notes">{f.notes}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-followups-text">No follow-ups scheduled.</p>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer-common">
          {/* Quick outcomes (Executive Only) */}
          {role === 'executive' && (
            <div className="outcome-quick-actions" style={{ marginRight: "auto", display: "flex", gap: "10px" }}>
              {enquiry.status.toLowerCase() !== "converted" && (
                <>
                  <button
                    onClick={() => onMarkConverted(enquiry)}
                    className="outcome-btn convert"
                  >
                    <CheckCircle2 size={13} /> Converted
                  </button>
                  <button
                    onClick={() => onMarkLost(enquiry)}
                    className="outcome-btn lost"
                  >
                    <XCircle size={13} /> Lost / Rejected
                  </button>
                </>
              )}
            </div>
          )}
          <button onClick={onClose} className="modal-btn-confirm">
            {role === 'manager' ? 'Close' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LeadDetailsModal;
