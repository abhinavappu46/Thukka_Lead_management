import React, { useState } from 'react';

function OutcomeConfirmModal({ statusType, onClose, onConfirm }) {
  const [statusReason, setStatusReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!statusReason) return;
    onConfirm(statusReason);
  };

  return (
    <div className="modal-backdrop-common" style={{ zIndex: 1200 }}>
      <div className="modal-container-common">
        <div className="modal-header-common">
          <h3>Mark Lead Outcome: {statusType === "lost" ? "Lost" : "Not Interested"}</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body-common">
            <p style={{ fontSize: "13px", marginBottom: "14px" }}>
              Provide a reason why this lead is being closed as lost or not interested:
            </p>
            <textarea
              required
              value={statusReason}
              onChange={(e) => setStatusReason(e.target.value)}
              placeholder="Reason: e.g. Customer selected competitor, Out of budget, Not responsive..."
              className="modal-textarea-common"
              style={{
                width: "100%",
                minHeight: "80px",
                background: "rgba(15,23,42,0.5)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#fff",
                borderRadius: "6px",
                padding: "8px",
                boxSizing: "border-box"
              }}
            />
          </div>
          <div className="modal-footer-common">
            <button
              type="button"
              onClick={onClose}
              className="modal-btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!statusReason}
              className="modal-btn-confirm"
              style={{ background: "#ef4444", color: "#fff" }}
            >
              Confirm Outcome
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OutcomeConfirmModal;
