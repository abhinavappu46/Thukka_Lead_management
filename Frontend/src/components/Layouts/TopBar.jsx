import React, { useState } from 'react';
import { Bell, User, Mail, Shield, ChevronDown, LogOut } from 'lucide-react';
import "./TopBar.css";

function TopBar() {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="topbar-container">
      
      {/* <div className="search-box">
        <input 
          type="text" 
          placeholder="Search enquiries, customers, or IDs (e.g. THK-ENQ-001)..." 
        />
      </div> */}

      <div className="topbar-actions">
        <button className="icon-btn" aria-label="Notifications">
          <Bell size={16} />
        </button>

        <div className="profile-dropdown-wrapper">
          {(() => {
            const userJson = localStorage.getItem("user");
            let user = null;
            try {
              user = userJson ? JSON.parse(userJson) : null;
            } catch (e) {
              console.error("Failed to parse user in TopBar:", e);
            }
            
            const handleLogout = () => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = '/Login';
            };

            const getRoleLabel = (role) => {
              if (role === "admin") return "System Administrator";
              if (role === "sales_manager" || role === "salesManager") return "Sales Manager";
              if (role === "sales_executive" || role === "salesExecutive") return "Sales Executive";
              return role || "User";
            };

            const getAccessLevel = (role) => {
              if (role === "admin") return "Full Authority";
              if (role === "sales_manager" || role === "salesManager") return "Managerial Access";
              return "Executive Access";
            };

            return (
              <>
                <button 
                  className="profile-btn" 
                  onClick={() => setShowProfile(!showProfile)}
                >
                  <div className="profile-avatar">
                    <User size={14} />
                  </div>
                  <span className="profile-text">{user?.name || "Profile"}</span>
                  <ChevronDown size={12} className={`profile-chevron ${showProfile ? 'rotate' : ''}`} />
                </button>

                {showProfile && (
                  <div className="profile-dropdown-menu">
                    <div className="profile-header-dropdown">
                      <p className="profile-menu-name">{user?.name || "User"}</p>
                      <p className="profile-menu-role">{getRoleLabel(user?.role)}</p>
                    </div>
                    <div className="profile-menu-divider"></div>
                    <div className="profile-menu-items">
                      <div className="profile-menu-item">
                        <Mail size={14} className="profile-item-icon" />
                        <div>
                          <p className="profile-item-label">Email</p>
                          <p className="profile-item-val">{user?.email || "N/A"}</p>
                        </div>
                      </div>
                      <div className="profile-menu-item">
                        <Shield size={14} className="profile-item-icon" />
                        <div>
                          <p className="profile-item-label">Access Level</p>
                          <p className="profile-item-val">{getAccessLevel(user?.role)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="profile-menu-divider"></div>
                    <button className="profile-logout-btn" onClick={handleLogout}>
                      <LogOut size={14} />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

export default TopBar;