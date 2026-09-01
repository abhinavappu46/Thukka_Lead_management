import React, { useState } from 'react';

function AddActivityModal({ defaultType = 'Call', onClose, onSave }) {
  const [activityTypeForm, setActivityTypeForm] = useState(defaultType);
  const [activityNotesForm, setActivityNotesForm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!activityNotesForm) return;
    onSave(activityTypeForm, activityNotesForm);
  };

  return (
    <div className="modal-backdrop-common" style={{ zIndex: 1100 }}>
      <div className="modal-container-common">
        <form onSubmit={handleSubmit}>
          <div className="modal-header-common">
            <h3>Add Call Log & Notes</h3>
          </div>
          <div className="modal-body-common" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <label className="field-label-common">Activity Type</label>
              <select
                value={activityTypeForm}
                onChange={(e) => setActivityTypeForm(e.target.value)}
                className="exec-select-dropdown"
                style={{ width: "100%", marginTop: "4px" }}
              >
                <option value="Call">Phone Call</option>
                <option value="Email">Email</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Meeting">Meeting</option>
                <option value="Note">Note / Memo</option>
              </select>
            </div>
            <div>
              <label className="field-label-common">Activity Notes / Call Details</label>
              <textarea
                required
                value={activityNotesForm}
                onChange={(e) => setActivityNotesForm(e.target.value)}
                placeholder="Provide details about the call/conversation..."
                className="modal-textarea-common"
                style={{
                  width: "100%",
                  minHeight: "100px",
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
          <div className="modal-footer-common">
            <button type="button" onClick={onClose} className="modal-btn-cancel">
              Cancel
            </button>
            <button type="submit" className="modal-btn-confirm">
              Save Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddActivityModal;
