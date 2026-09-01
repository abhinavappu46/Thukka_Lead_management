import React, { useState } from 'react';

function StatusUpdateModal({ enquiry, onClose, onSave }) {
  const [statusForm, setStatusForm] = useState(enquiry?.status || 'new');
  const [statusReason, setStatusReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!statusForm) return;
    onSave(statusForm, statusReason);
  };

  return (
    <div className="modal-backdrop-common" style={{ zIndex: 1100 }}>
      <div className="modal-container-common">
        <div className="modal-header-common">
          <h3>Update Status: {enquiry?.customerName}</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body-common">
            <div className="form-field-wrapper" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label className="field-label-common">Select Status</label>
                <select
                  value={statusForm}
                  onChange={(e) => setStatusForm(e.target.value)}
                  className="exec-select-dropdown"
                  style={{ width: "100%", marginTop: "4px" }}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="follow_up">Follow-up</option>
                  <option value="interested">Interested</option>
                  <option value="converted">Converted</option>
                  <option value="lost">Lost</option>
                  <option value="not_interested">Not Interested</option>
                </select>
              </div>
              <div>
                <label className="field-label-common">Change Reason / Log Comment</label>
                <textarea
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  placeholder="Enter reason or note for status transition..."
                  className="modal-textarea-common"
                  style={{
                    width: "100%",
                    minHeight: "80px",
                    marginTop: "4px",
                    background: "rgba(15,23,42,0.5)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#fff",
                    borderRadius: "6px",
                    padding: "8px",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            </div>
          </div>
          <div className="modal-footer-common">
            <button type="button" onClick={onClose} className="modal-btn-cancel">
              Cancel
            </button>
            <button type="submit" className="modal-btn-confirm">
              Update Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StatusUpdateModal;
