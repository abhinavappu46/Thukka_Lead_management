import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, MessageSquare, Users, Calendar, 
  History, BarChart3, Settings, LogOut, Award 
} from "lucide-react";
import "./Sidebar.css"; 
import logo from "../../assets/logo-header.png";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/Login");
  };

  const userJson = localStorage.getItem("user");
  let user = null;
  try {
    user = userJson ? JSON.parse(userJson) : null;
  } catch (e) {
    console.error("Failed to parse user in Sidebar:", e);
  }

  const role = user?.role || "admin";
  const mappedRole = role === "salesManager" ? "sales_manager" : (role === "salesExecutive" ? "sales_executive" : role);

  const renderNavLinks = () => {
    if (mappedRole === "sales_manager") {
      return (
        <>
          <li>
            <NavLink to="/manager-dashboard" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/manager/enquiries" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <MessageSquare size={16} />
              <span>Team Enquiries</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/manager/follow-ups" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <Calendar size={16} />
              <span>Follow-ups</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/manager/team" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <Users size={16} />
              <span>Sales Executives</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/manager/performance" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <Award size={16} />
              <span>Performance</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/manager/reports" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <BarChart3 size={16} />
              <span>Reports</span>
            </NavLink>
          </li>
        </>
      );
    }

    if (mappedRole === "sales_executive") {
      return (
        <>
          <li>
            <NavLink to="/executive-dashboard" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/executive/enquiries" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <MessageSquare size={16} />
              <span>My Enquiries</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/executive/follow-ups" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <Calendar size={16} />
              <span>Follow-ups</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/executive/activities" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <History size={16} />
              <span>Activities</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/executive/reports" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <BarChart3 size={16} />
              <span>Reports</span>
            </NavLink>
          </li>
        </>
      );
    }

    // Default: admin
    return (
      <>
        <li>
          <NavLink to="/admin-dashboard" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            <LayoutDashboard size={16} />
            <span>Overview</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin-dashboard/enquiries" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            <MessageSquare size={16} />
            <span>Enquiries</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin-dashboard/customers" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            <Users size={16} />
            <span>Customers</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin-dashboard/follow-ups" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            <Calendar size={16} />
            <span>Follow-ups</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin-dashboard/activity" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            <History size={16} />
            <span>Activity Logs</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin-dashboard/reports" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            <BarChart3 size={16} />
            <span>Reports</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin-dashboard/settings" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            <Settings size={16} />
            <span>Settings</span>
          </NavLink>
        </li>
      </>
    );
  };

  return (
    <aside className="sidebar-container">
      <div className="sidebar-brand">
        <div className="sidebar-logo-box">
          <img src={logo} alt="Logo" className="w-25 h-8 object-contain" />
        <h2><span className="brand-subtitle">Lead Management</span></h2>
      </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {renderNavLinks()}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn flex items-center justify-center gap-2">
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;