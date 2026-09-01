import React, { useState } from 'react';

function ScheduleFollowUpModal({ onClose, onSave }) {
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpTime, setFollowUpTime] = useState('');
  const [followUpType, setFollowUpType] = useState('Phone Call');
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [followUpReminder, setFollowUpReminder] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!followUpDate) return;
    onSave({
      followUpDate,
      followUpTime,
      followUpType,
      notes: followUpNotes,
      reminder: followUpReminder
    });
  };

  return (
    <div className="modal-backdrop-common" style={{ zIndex: 1100 }}>
      <div className="modal-container-common">
        <form onSubmit={handleSubmit}>
          <div className="modal-header-common">
            <h3>Schedule Customer Follow-up</h3>
          </div>
          <div className="modal-body-common" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label className="field-label-common">Date</label>
                <input
                  type="date"
                  required
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  style={{ width: "100%", padding: "10px", marginTop: "4px", background: "rgba(15,23,42,0.5)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", borderRadius: "6px", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label className="field-label-common">Time</label>
                <input
                  type="time"
                  value={followUpTime}
                  onChange={(e) => setFollowUpTime(e.target.value)}
                  style={{ width: "100%", padding: "10px", marginTop: "4px", background: "rgba(15,23,42,0.5)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", borderRadius: "6px", boxSizing: "border-box" }}
                />
              </div>
            </div>
            <div>
              <label className="field-label-common">Follow-up Medium</label>
              <select
                value={followUpType}
                onChange={(e) => setFollowUpType(e.target.value)}
                className="exec-select-dropdown"
                style={{ width: "100%", marginTop: "4px" }}
              >
                <option value="Phone Call">Phone Call</option>
                <option value="Email Response">Email Response</option>
                <option value="WhatsApp Text">WhatsApp Text</option>
                <option value="Demo Session">Demo Session</option>
              </select>
            </div>
            <div>
              <label className="field-label-common">Task Description / Agenda</label>
              <textarea
                value={followUpNotes}
                onChange={(e) => setFollowUpNotes(e.target.value)}
                placeholder="Describe the agenda of this follow-up..."
                className="modal-textarea-common"
                style={{ width: "100%", minHeight: "70px", marginTop: "4px", background: "rgba(15,23,42,0.5)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", borderRadius: "6px", padding: "8px", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
              <input
                type="checkbox"
                id="reminder_chk"
                checked={followUpReminder}
                onChange={(e) => setFollowUpReminder(e.target.checked)}
                style={{ cursor: "pointer" }}
              />
              <label htmlFor="reminder_chk" className="field-label-common" style={{ cursor: "pointer" }}>Enable email reminder alert</label>
            </div>
          </div>
          <div className="modal-footer-common">
            <button type="button" onClick={onClose} className="modal-btn-cancel">
              Cancel
            </button>
            <button type="submit" className="modal-btn-confirm">
              Schedule Follow-up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ScheduleFollowUpModal;
