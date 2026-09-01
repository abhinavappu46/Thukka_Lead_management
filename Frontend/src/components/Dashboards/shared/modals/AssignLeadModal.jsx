import React, { useState } from 'react';

function AssignLeadModal({ enquiry, executives, onClose, onSave }) {
  const [selectedExecId, setSelectedExecId] = useState(enquiry?.assignedTo?._id || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedExecId) return;
    onSave(selectedExecId);
  };

  return (
    <div className="modal-backdrop-common">
      <div className="modal-container-common">
        <div className="modal-header-common">
          <h3>Assign Lead: {enquiry?.customerName}</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body-common">
            <p style={{ marginBottom: "16px", fontSize: "13.5px" }}>
              Select a Sales Executive to handle the enquiry <strong className="text-emerald-400">{enquiry?.enquiryNumber}</strong>.
            </p>
            
            <div className="form-field-assignment">
              <label className="field-label-common">Select Sales Executive</label>
              <select 
                className="exec-select-dropdown"
                value={selectedExecId} 
                onChange={(e) => setSelectedExecId(e.target.value)}
                style={{ width: "100%", marginTop: "4px" }}
              >
                <option value="">-- Choose Executive --</option>
                {executives.map(ex => (
                  <option key={ex._id} value={ex._id}>{ex.name}</option>
                ))}
              </select>
            </div>
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
              disabled={!selectedExecId} 
              className="modal-btn-confirm"
            >
              {enquiry?.assignedTo ? "Reassign Lead" : "Confirm Assignment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AssignLeadModal;
