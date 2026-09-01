import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, User, Globe, HelpCircle } from 'lucide-react';
import "./Settings.css";

function Settings() {
  const [profileName, setProfileName] = useState('Admin User');
  const [profileEmail, setProfileEmail] = useState('admin@thukka.com');
  const [autoRouting, setAutoRouting] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [hotLeadNotifications, setHotLeadNotifications] = useState(true);

  return (
    <div className="set-container">
      {/* Header */}
      <div className="set-header">
        <h1 className="set-title">System & Account Settings</h1>
        <p className="set-subtitle">Configure workspace settings, notification preferences, and team details.</p>
      </div>

      {/* Main Settings Panel Grid */}
      <div className="set-panel-grid">
        {/* Left Nav menu - Quick status info */}
        <div className="set-menu-card">
          {[
            { label: 'Profile Info', icon: User, active: true },
            { label: 'Notifications', icon: Bell, active: false },
            { label: 'Lead Routing Rules', icon: SettingsIcon, active: false },
            { label: 'Security & Password', icon: Shield, active: false },
            { label: 'Localization', icon: Globe, active: false }
          ].map((item, idx) => (
            <button
              key={idx}
              className={`set-menu-btn ${item.active ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right Settings Panel Card */}
        <div className="set-content-box">
          
          {/* Section 1: Profile */}
          <div className="set-section-card">
            <h3 className="set-section-title">
              <User size={18} className="text-slate-400" />
              <span>Profile Settings</span>
            </h3>
            <div className="set-form-row">
              <div className="set-form-field">
                <label className="set-form-label">Full Name</label>
                <input
                  type="text"
                  className="set-form-input"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                />
              </div>
              <div className="set-form-field">
                <label className="set-form-label">Email Address</label>
                <input
                  type="email"
                  className="set-form-input"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Routing Config */}
          <div className="set-section-card">
            <h3 className="set-section-title">
              <SettingsIcon size={18} className="text-slate-400" />
              <span>Lead Distribution Rules</span>
            </h3>

            <div className="set-rule-list">
              {/* Toggle 1 */}
              <div className="set-rule-row">
                <div className="set-rule-info">
                  <h4 className="set-rule-title">Automatic Lead Assignment</h4>
                  <p className="set-rule-desc">Automatically allocate incoming enquiries to sales agents round-robin.</p>
                </div>
                <button
                  onClick={() => setAutoRouting(!autoRouting)}
                  className={`set-toggle-btn ${autoRouting ? 'bg-emerald-600' : 'bg-slate-800'}`}
                >
                  <span className={`set-toggle-dot ${autoRouting ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Toggle 2 */}
              <div className="set-rule-row pt-4 border-t border-slate-800">
                <div className="set-rule-info">
                  <h4 className="set-rule-title">Email Alerts</h4>
                  <p className="set-rule-desc">Send immediate notification summary logs for high-priority items.</p>
                </div>
                <button
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`set-toggle-btn ${emailAlerts ? 'bg-emerald-600' : 'bg-slate-800'}`}
                >
                  <span className={`set-toggle-dot ${emailAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Toggle 3 */}
              <div className="set-rule-row pt-4 border-t border-slate-800">
                <div className="set-rule-info">
                  <h4 className="set-rule-title">Hot Lead Audio Chimes</h4>
                  <p className="set-rule-desc">Play alerting chime sounds in-browser when high-importance leads are added.</p>
                </div>
                <button
                  onClick={() => setHotLeadNotifications(!hotLeadNotifications)}
                  className={`set-toggle-btn ${hotLeadNotifications ? 'bg-emerald-600' : 'bg-slate-800'}`}
                >
                  <span className={`set-toggle-dot ${hotLeadNotifications ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="set-footer">
            <button className="set-discard-btn">
              Discard
            </button>
            <button className="set-save-btn">
              Save Preferences
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Settings;
