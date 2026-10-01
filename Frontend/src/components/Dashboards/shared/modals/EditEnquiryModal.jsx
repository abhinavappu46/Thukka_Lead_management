import React, { useState } from 'react';
import { X } from 'lucide-react';
import './editenquirymodel.css';

function EditEnquiryModal({
  enquiry,
  executives = [],
  onClose,
  onSave,
  loading,
  success,
  error
}) {
  const [formData, setFormData] = useState({
    customerName: enquiry?.customerName || '',
    companyName: enquiry?.companyName || '',
    phone: enquiry?.phone || '',
    email: enquiry?.email || '',
    source: enquiry?.source || 'website',
    priority: enquiry?.priority || 'Warm',
    status: enquiry?.status || 'new',
    notes: enquiry?.notes || '',
    assignedTo: enquiry?.assignedTo?._id || enquiry?.assignedTo || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.phone.trim()) return;

    onSave({
      ...formData,
      customerName: formData.customerName.trim(),
      companyName: formData.companyName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      notes: formData.notes.trim(),
      assignedTo: formData.assignedTo || null
    });
  };

  return (
    <div className="modal-backdrop-common edit-enquiry-backdrop">
      <div className="modal-container-common edit-enquiry-modal-container">
        <div className="modal-header-common edit-enquiry-header">
          <div>
            <h3>Edit Enquiry</h3>
            {enquiry?.enquiryNumber && (
              <span className="edit-enquiry-id">
                ID: {enquiry.enquiryNumber}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="edit-enquiry-close-btn"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="edit-enquiry-form">
          <div className="modal-body-common edit-enquiry-body">
            {success && <div className="dashboard-modal-alert success">{success}</div>}
            {error && <div className="dashboard-modal-alert error">{error}</div>}
            {/* Customer Name & Company Name */}
            <div className="edit-enquiry-grid">
              <div>
                <label className="field-label-common">Customer Name *</label>
                <input
                  type="text"
                  name="customerName"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.customerName}
                  onChange={handleChange}
                  className="edit-enquiry-input"
                />
              </div>

              <div>
                <label className="field-label-common">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  placeholder="e.g. Acme Corp"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="edit-enquiry-input"
                />
              </div>
            </div>

            {/* Phone & Email */}
            <div className="edit-enquiry-grid">
              <div>
                <label className="field-label-common">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="edit-enquiry-input"
                />
              </div>

              <div>
                <label className="field-label-common">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="edit-enquiry-input"
                />
              </div>
            </div>

            {/* Source & Priority */}
            <div className="edit-enquiry-grid">
              <div>
                <label className="field-label-common">Source</label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="exec-select-dropdown edit-enquiry-select"
                >
                  <option value="website">Website</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="phone">Phone</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="referral">Referral</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Google">Google</option>
                  <option value="Direct">Direct</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="field-label-common">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="exec-select-dropdown edit-enquiry-select"
                >
                  <option value="Hot">Hot</option>
                  <option value="Warm">Warm</option>
                  <option value="Cold">Cold</option>
                </select>
              </div>
            </div>

            {/* Status & Assignment */}
            <div className={executives.length > 0 ? "edit-enquiry-grid" : "edit-enquiry-grid-single"}>
              <div>
                <label className="field-label-common">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="exec-select-dropdown edit-enquiry-select"
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

              {executives.length > 0 && (
                <div>
                  <label className="field-label-common">Assigned Executive</label>
                  <select
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    className="exec-select-dropdown edit-enquiry-select"
                  >
                    <option value="">-- Unassigned --</option>
                    {executives.map(exec => (
                      <option key={exec._id} value={exec._id}>
                        {exec.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Requirement Notes */}
            <div>
              <label className="field-label-common">Notes / Requirement Details</label>
              <textarea
                name="notes"
                rows={3}
                placeholder="Add notes about customer requirements, budget, preferences..."
                value={formData.notes}
                onChange={handleChange}
                className="modal-textarea-common edit-enquiry-textarea"
              />
            </div>
          </div>

          <div className="modal-footer-common">
            <button
              type="button"
              onClick={onClose}
              className="modal-btn-cancel"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn-confirm"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEnquiryModal;
