import React, { useState, useEffect } from "react";
import { RefreshCw, ShieldAlert, Users, MessageSquare, Calendar, TrendingUp, DollarSign, CheckCircle, Plus } from "lucide-react";
import api from "../Api/axios";
import { KpiCard, ConfirmationModal, LoadingState } from "../components/Common";
import "./SalesManagerDashboard.css";

// Extracted Modular Components
import ManagerOverviewTab from "../components/Dashboards/manager/ManagerOverviewTab";
import ManagerPerformanceTab from "../components/Dashboards/manager/ManagerPerformanceTab";
import ManagerReportsTab from "../components/Dashboards/manager/ManagerReportsTab";
import EnquiriesTab from "../components/Dashboards/shared/EnquiriesTab";

// Shared Modals
import LeadDetailsModal from "../components/Dashboards/shared/modals/LeadDetailsModal";
import AssignLeadModal from "../components/Dashboards/shared/modals/AssignLeadModal";
import AddEnquiryModel from "../components/Dashboards/shared/modals/AddEnquiryModel";
import AddEnquiry from "../service/AddEnquiry";

function SalesManagerDashboard({ tab }) {
  const activeTab = tab || "overview";
  const [loading, setLoading] = useState(true);
  const [enquiries, setEnquiries] = useState([]);
  const [executives, setExecutives] = useState([]);
  const [error, setError] = useState("");
  const [succ, setSucc] = useState("");
  const [AddLoading, setAddLoading] = useState(false);

  // Selection for Assignment Modal
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [selectedExecId, setSelectedExecId] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showConfirmReassign, setShowConfirmReassign] = useState(false);

  // Detail Modal
  const [viewEnquiryDetails, setViewEnquiryDetails] = useState(null);

  // Add Lead Modal
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);


  const handleAddEnquiry = async (enquiryData) => {
    setAddLoading(true);
    try {
      const response = await AddEnquiry(enquiryData);
      setSucc(response.message);
      setError("");
      fetchData();
    } catch (err) {
      console.error("Error adding enquiry:", error);
      setError(err.response?.data?.message || "Failed to add enquiry. Please try again.");
      setSucc("");
    } finally {
      setAddLoading(false);
      setTimeout(() => {
        setShowAddLeadModal(false);
        setSucc("");
        setError("");
      }, 3000);
    }

  };

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch enquiries
      const enqResponse = await api.get("/Enquiry/enquirys");
      setEnquiries(enqResponse.data.enquiries || []);

      // Fetch executives
      const execResponse = await api.get("/user/executives");
      setExecutives(execResponse.data.executives || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data from the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignLead = async (execId) => {
    const finalExecId = execId || selectedExecId;
    if (!selectedEnquiry || !finalExecId) return;

    try {
      // Fix original endpoint path bug (missing "/Enquiry")
      const response = await api.patch(`/Enquiry/${selectedEnquiry.enquiryNumber}/assign`, {
        assignedTo: finalExecId
      });

      if (response.data.success) {
        // Refresh local state
        setEnquiries(prev => prev.map(e =>
          e.enquiryNumber === selectedEnquiry.enquiryNumber
            ? { ...e, assignedTo: executives.find(ex => ex._id === finalExecId) }
            : e
        ));

        setShowAssignModal(false);
        setShowConfirmReassign(false);
        setSelectedEnquiry(null);
        setSelectedExecId("");

        // Refresh full data for logs/activities
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign lead.");
    }
  };

  // Helper values
  const getManagerName = () => {
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      return u?.name || "Manager";
    } catch (e) {
      return "Manager";
    }
  };

  // Calculate Metrics
  const totalEnqs = enquiries.length;
  const activeLeads = enquiries.filter(e => ["new", "contacted", "follow_up", "interested", "New", "In Progress"].includes(e.status)).length;
  const convertedCount = enquiries.filter(e => e.status.toLowerCase() === "converted").length;
  const lostCount = enquiries.filter(e => ["lost", "not_interested", "not-interested"].includes(e.status.toLowerCase())).length;
  const conversionRate = totalEnqs > 0 ? ((convertedCount / totalEnqs) * 100).toFixed(1) : "0.0";
  const estimatedSalesValue = convertedCount * 12500; // Mock average deal value of $12.5k

  // Follow-up aggregates
  const todayFollowUps = enquiries.filter(e => {
    if (!e.nextFollowUp) return false;
    const today = new Date().toISOString().split("T")[0];
    return e.nextFollowUp.split("T")[0] === today;
  });

  const overdueFollowUps = enquiries.filter(e => {
    if (!e.nextFollowUp) return false;
    const followDate = new Date(e.nextFollowUp);
    const now = new Date();
    return followDate < now && !["converted", "lost"].includes(e.status.toLowerCase());
  });

  // Executive performance calculation
  const execPerformance = executives.map(exec => {
    const assigned = enquiries.filter(e => e.assignedExecutive && e.assignedExecutive._id === exec._id).length;
    const contacted = enquiries.filter(e => e.assignedExecutive && e.assignedExecutive._id === exec._id && e.status.toLowerCase() !== "new").length;
    const converted = enquiries.filter(e => e.assignedExecutive && e.assignedExecutive._id === exec._id && e.status.toLowerCase() === "converted").length;
    const lost = enquiries.filter(e => e.assignedExecutive && e.assignedExecutive._id === exec._id && ["lost", "not_interested"].includes(e.status.toLowerCase())).length;
    const convRate = assigned > 0 ? ((converted / assigned) * 100).toFixed(1) + "%" : "0.0%";

    return {
      exec,
      assigned,
      contacted,
      converted,
      lost,
      convRate
    };
  });

  if (loading) {
    return <LoadingState message="Loading Team Dashboard details..." />;
  }

  if (error) {
    return (
      <div className="error-container">
        <ShieldAlert size={48} className="text-rose-500" />
        <h3>Error Accessing Dashboard</h3>
        <p>{error}</p>
        <button onClick={fetchData} className="retry-btn">
          <RefreshCw size={16} /> Retry Fetching
        </button>
      </div>
    );
  }

  return (
    <div className="manager-dashboard-container">
      {/* Header section */}
      <div className="welcome-header">
        <div>
          <h1 className="welcome-title">Good Morning, {getManagerName()}</h1>
          <p className="welcome-subtitle">Team sales overview and enquiry performance dashboard.</p>
        </div>
        <div className="header-actions">
          <button
            onClick={() => setShowAddLeadModal(true)}
            className="add-lead-btn"
            title="Add New Lead"
          >
            <Plus size={16} />
            <span>Add Lead</span>
          </button>
          <button onClick={fetchData} className="refresh-btn" title="Refresh Dashboard Data">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <KpiCard label="Total Team Enquiries" value={totalEnqs} change="+14.2%" isUp={true} icon={MessageSquare} colorClass="bg-sky" />
        <KpiCard label="Active Leads" value={activeLeads} change="+6.5%" isUp={true} icon={Users} colorClass="bg-amber" />
        <KpiCard label="Today's Follow-ups" value={todayFollowUps.length} change={`${overdueFollowUps.length} overdue`} isUp={false} icon={Calendar} colorClass="bg-rose" />
        <KpiCard label="Conversions" value={convertedCount} change="+12.5%" isUp={true} icon={CheckCircle} colorClass="bg-emerald" />
        <KpiCard label="Conversion Rate" value={`${conversionRate}%`} change="+2.4%" isUp={true} icon={TrendingUp} colorClass="bg-emerald" />
        <KpiCard label="Sales Value" value={`$${estimatedSalesValue.toLocaleString()}`} change="+15.0%" isUp={true} icon={DollarSign} colorClass="bg-emerald" />
      </div>

      {/* Tab Content links */}
      <div className="tabs-container">
        <div className="tab-bar-links">
          {activeTab === "overview" && (
            <ManagerOverviewTab
              execPerformance={execPerformance}
              totalEnqs={totalEnqs}
              enquiries={enquiries}
              convertedCount={convertedCount}
              todayFollowUps={todayFollowUps}
              onViewDetails={setViewEnquiryDetails}
            />
          )}

          {activeTab === "enquiries" && (
            <EnquiriesTab
              enquiries={enquiries}
              role="manager"
              executives={executives}
              onViewDetails={setViewEnquiryDetails}
              onAssign={(enq) => {
                setSelectedEnquiry(enq);
                setSelectedExecId(enq.assignedExecutive?._id || "");
                setShowAssignModal(true);
              }}
            />
          )}

          {activeTab === "followups" && (
            <div className="dashboard-card followups-tab-card">
              <div className="card-header">
                <h3>Lead Follow-up Monitor</h3>
                <p>Track team commitments, calls, and upcoming follow-ups.</p>
              </div>
              <div className="followup-lists-grid">
                <div className="followup-list-column">
                  <h4 className="column-title text-rose-400">Overdue Follow-ups ({overdueFollowUps.length})</h4>
                  <div className="column-content scroll-vertical max-h-500">
                    {overdueFollowUps.length > 0 ? (
                      overdueFollowUps.map(lead => (
                        lead.followUps.filter(f => f.status === "pending").map((f, i) => (
                          <ExecutiveOverviewTab.FollowUpCard key={i} followUp={f} onAction={() => setViewEnquiryDetails(lead)} />
                        ))
                      ))
                    ) : (
                      <div className="card-body">
                        <ConfirmationModal.EmptyState title="All caught up" description="No overdue follow-ups found." />
                      </div>
                    )}
                  </div>
                </div>

                <div className="followup-list-column">
                  <h4 className="column-title text-amber-400">Today's Follow-ups ({todayFollowUps.length})</h4>
                  <div className="column-content scroll-vertical max-h-500">
                    {todayFollowUps.length > 0 ? (
                      todayFollowUps.map(lead => (
                        lead.followUps.filter(f => f.status === "pending").map((f, i) => (
                          <ExecutiveOverviewTab.FollowUpCard key={i} followUp={f} onAction={() => setViewEnquiryDetails(lead)} />
                        ))
                      ))
                    ) : (
                      <div className="card-body">
                        <ConfirmationModal.EmptyState title="No follow-ups today" description="No more follow-ups scheduled for today." />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "performance" && (
            <ManagerPerformanceTab execPerformance={execPerformance} />
          )}

          {activeTab === "reports" && (
            <ManagerReportsTab
              enquiries={enquiries}
              execPerformance={execPerformance}
              convertedCount={convertedCount}
              lostCount={lostCount}
              totalEnqs={totalEnqs}
              estimatedSalesValue={estimatedSalesValue}
            />
          )}
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && (
        <AssignLeadModal
          enquiry={selectedEnquiry}
          executives={executives}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedEnquiry(null);
            setSelectedExecId("");
          }}
          onSave={(execId) => {
            setSelectedExecId(execId);
            if (selectedEnquiry?.assignedTo) {
              setShowConfirmReassign(true);
            } else {
              handleAssignLead(execId);
            }
          }}
        />
      )}

      {/* Reassignment Confirmation Dialog */}
      <ConfirmationModal
        isOpen={showConfirmReassign}
        title="Confirm Reassign Lead?"
        message={`Are you sure you want to reassign lead ${selectedEnquiry?.enquiryNumber} from ${selectedEnquiry?.assignedTo?.name || 'current agent'} to the selected executive?`}
        onConfirm={() => handleAssignLead(selectedExecId)}
        onCancel={() => setShowConfirmReassign(false)}
        confirmText="Confirm Reassignment"
      />

      {/* Detail View Modal */}
      {viewEnquiryDetails && (
        <LeadDetailsModal
          enquiry={viewEnquiryDetails}
          role="manager"
          onClose={() => setViewEnquiryDetails(null)}
        />
      )}

      {/* Add Lead Modal */}
      {showAddLeadModal && (
        <AddEnquiryModel
          onClose={() => setShowAddLeadModal(false)}
          onSave={(enquiryData) => { handleAddEnquiry(enquiryData) }}
          executives={executives}
          onSuccess={succ}
          onFail={error}
          isLoading={AddLoading}
        />
      )}
    </div>
  );
}

export default SalesManagerDashboard;
