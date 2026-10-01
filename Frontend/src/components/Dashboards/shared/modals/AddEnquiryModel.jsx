import React, { useState, useEffect } from 'react';
import api from '../../../../Api/axios';

function AddEnquiryModel({
  onClose,
  onSave,
  onSuccess,
  executives: propExecutives = [],
  isLoading,
  onFail
}) {
  const [executives, setExecutives] = useState(propExecutives);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [source, setSource] = useState('Website');
  const [priority, setPriority] = useState('Warm');
  const [notes, setNotes] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (propExecutives && propExecutives.length > 0) {
      setExecutives(propExecutives);
    } else {
      const fetchExecutives = async () => {
        try {
          const res = await api.get('/user/executives');
          if (res.data?.executives) {
            setExecutives(res.data.executives);
          }
        } catch (err) {
          console.error('Failed to fetch executives:', err);
        }
      };
      fetchExecutives();
    }
  }, [propExecutives]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name.trim() === '') {
      setError('Customer name is required');
      return;
    }

    if (company.trim() === '') {
      setError('Company name is required');
      return;
    }

    if (email.trim() === '') {
      setError('Email is required');
      return;
    }

    if (phone.trim() === '') {
      setError('Phone number is required');
      return;
    }

    if (phone.length !== 10) {
      setError('Phone number must contain 10 digits');
      return;
    }

    setError('');

    const formData = {
      customerName: name.trim(),
      companyName: company.trim(),
      email: email.trim(),
      phone: phone.trim(),
      source: source.toLowerCase(),
      priority,
      notes: notes.trim(),
      assignedTo: assignedTo || null
    };

    if (onSave) {
      onSave(formData);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <div className="dashboard-modal-backdrop">
      <div className="dashboard-modal-content" style={{ maxWidth: '600px' }}>
        <div className="dashboard-modal-header">
          <h3>Create New Enquiry</h3>
          <button
            type="button"
            onClick={handleClose}
            className="dashboard-modal-close-btn"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="dashboard-modal-form">
          {onFail && <div className="dashboard-modal-alert error">{onFail}</div>}
          {onSuccess && <div className="dashboard-modal-alert success">{onSuccess}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="dashboard-modal-field" style={{ marginBottom: 0 }}>
              <label>Customer Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="dashboard-modal-field" style={{ marginBottom: 0 }}>
              <label>Company Name</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Acme Corp"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="dashboard-modal-field" style={{ marginBottom: 0 }}>
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
              />
            </div>
            <div className="dashboard-modal-field" style={{ marginBottom: 0 }}>
              <label>Phone Number</label>
              <input
                type="text"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +1 555-0199"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="dashboard-modal-field" style={{ marginBottom: 0 }}>
              <label>Lead Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
              >
                <option value="Website">Website</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Google">Google</option>
                <option value="Referral">Referral</option>
                <option value="Direct">Direct Engagement</option>
              </select>
            </div>
            <div className="dashboard-modal-field" style={{ marginBottom: 0 }}>
              <label>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Hot">Hot (High)</option>
                <option value="Warm">Warm (Medium)</option>
                <option value="Cold">Cold (Low)</option>
              </select>
            </div>
          </div>

          <div className="dashboard-modal-field">
            <label>Assign To (Sales Executive)</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">-- Keep Unassigned --</option>
              {executives.map((exec) => (
                <option key={exec._id} value={exec._id}>
                  {exec.name} ({exec.email})
                </option>
              ))}
            </select>
          </div>

          <div className="dashboard-modal-field">
            <label>Requirement Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe initial details, requirements..."
              rows={3}
              style={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                color: '#f1f5f9',
                padding: '0.625rem 0.875rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
                minHeight: '80px',
                resize: 'vertical'
              }}
            />
          </div>

          <div className="dashboard-modal-actions">
            <button
              type="button"
              onClick={handleClose}
              className="dashboard-modal-btn secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="dashboard-modal-btn primary"
            >
              {isLoading ? 'Saving...' : 'Save Enquiry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEnquiryModel;
