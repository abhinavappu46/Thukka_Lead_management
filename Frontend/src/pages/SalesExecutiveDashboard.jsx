import React, { useState, useEffect } from "react";
import { RefreshCw, ShieldCheck, MessageSquare, Clock, Calendar, CheckCircle2, TrendingUp } from "lucide-react";
import api from "../Api/axios";
import { KpiCard, ConfirmationModal, LoadingState } from "../components/Common";
import "./SalesExecutiveDashboard.css";

// Extracted Modular Components
import ExecutiveOverviewTab from "../components/Dashboards/executive/ExecutiveOverviewTab";
import ExecutiveReportsTab from "../components/Dashboards/executive/ExecutiveReportsTab";
import EnquiriesTab from "../components/Dashboards/shared/EnquiriesTab";
import ActivitiesTab from "../components/Dashboards/shared/ActivitiesTab";

// Shared Modals
import LeadDetailsModal from "../components/Dashboards/shared/modals/LeadDetailsModal";
import StatusUpdateModal from "../components/Dashboards/shared/modals/StatusUpdateModal";
import AddActivityModal from "../components/Dashboards/shared/modals/AddActivityModal";
import ScheduleFollowUpModal from "../components/Dashboards/shared/modals/ScheduleFollowUpModal";
import OutcomeConfirmModal from "../components/Dashboards/shared/modals/OutcomeConfirmModal";

function SalesExecutiveDashboard({ tab }) {
  const activeTab = tab || "overview";
  const [loading, setLoading] = useState(true);
  const [enquiries, setEnquiries] = useState([]);
  const [error, setError] = useState(null);

  // Selection for operations
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  // Form Modals Display States
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusForm, setStatusForm] = useState("");

  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activityDefaultType, setActivityDefaultType] = useState("Call");

  const [showFollowUpModal, setShowFollowUpModal] = useState(false);

  // Conversion / Outcome confirm dialogs
  const [showConvertConfirm, setShowConvertConfirm] = useState(false);
  const [showOutcomeConfirm, setShowOutcomeConfirm] = useState(false); // for Lost/Not Interested

  const getExecutiveName = () => {
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      return u?.name || "Executive";
    } catch (e) {
      return "Executive";
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/Enquiry/enquirys");
      setEnquiries(response.data.enquiries || []);
    } catch (err) {
      console.error("Error fetching executive data:", err);
      setError("Failed to load your enquiries. Please check connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (status, reason) => {
    const finalStatus = typeof status === "string" ? status : statusForm;
    const finalReason = typeof reason === "string" ? reason : "";
    if (!selectedEnquiry || !finalStatus) return;

    try {
      const response = await api.patch(`/Enquiry/enquiry/${selectedEnquiry.enquiryNumber}/status`, {
        status: finalStatus,
        reason: finalReason
      });

      if (response.data.success) {
        const updated = response.data.enquiry;
        setEnquiries(prev => prev.map(e =>
          e.enquiryNumber === selectedEnquiry.enquiryNumber ? updated : e
        ));

        // If the details modal is currently viewing this, update it
        setSelectedEnquiry(updated);

        setShowStatusModal(false);
        setShowConvertConfirm(false);
        setShowOutcomeConfirm(false);
        setStatusForm("");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    }
  };

  const handleAddActivity = async (activityType, notes) => {
    if (!selectedEnquiry || !notes) return;

    try {
      const response = await api.patch(`/Enquiry/enquiry/${selectedEnquiry.enquiryNumber}/activity`, {
        activityType,
        notes
      });

      if (response.data.success) {
        const updated = response.data.enquiry;
        setEnquiries(prev => prev.map(e =>
          e.enquiryNumber === selectedEnquiry.enquiryNumber ? updated : e
        ));

        setSelectedEnquiry(updated);
        setShowActivityModal(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add activity log.");
    }
  };

  const handleScheduleFollowUp = async (followUpData) => {
    if (!selectedEnquiry || !followUpData.followUpDate) return;

    try {
      const response = await api.patch(`/Enquiry/enquiry/${selectedEnquiry.enquiryNumber}/followup`, {
        followUpDate: followUpData.followUpDate,
        followUpTime: followUpData.followUpTime,
        followUpType: followUpData.followUpType,
        notes: followUpData.notes,
        reminder: followUpData.reminder
      });

      if (response.data.success) {
        const updated = response.data.enquiry;
        setEnquiries(prev => prev.map(e =>
          e.enquiryNumber === selectedEnquiry.enquiryNumber ? updated : e
        ));

        setSelectedEnquiry(updated);
        setShowFollowUpModal(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to schedule follow-up.");
    }
  };

  // Mock calling/email actions
  const triggerCall = (phone, enq) => {
    window.open(`tel:${phone}`);
    setSelectedEnquiry(enq);
    setActivityDefaultType("Call");
    setShowActivityModal(true);
  };

  const triggerEmail = (email, enq) => {
    window.open(`mailto:${email}`);
    setSelectedEnquiry(enq);
    setActivityDefaultType("Email");
    setShowActivityModal(true);
  };

  // Calculate Metrics
  const totalMyEnqs = enquiries.length;
  const pendingFollowups = enquiries.filter(e => {
    return e.followUps && e.followUps.some(f => f.status === "pending");
  }).length;

  const todayFollowUps = enquiries.filter(e => {
    if (!e.nextFollowUp) return false;
    const today = new Date().toISOString().split("T")[0];
    return e.nextFollowUp.split("T")[0] === today;
  });

  const convertedCount = enquiries.filter(e => e.status.toLowerCase() === "converted").length;
  const conversionRate = totalMyEnqs > 0 ? ((convertedCount / totalMyEnqs) * 100).toFixed(1) : "0.0";

  // Active pipeline stages count
  const pipelineStages = {
    new: enquiries.filter(e => e.status.toLowerCase() === "new").length,
    contacted: enquiries.filter(e => e.status.toLowerCase() === "contacted").length,
    followUp: enquiries.filter(e => ["follow_up", "follow-up"].includes(e.status.toLowerCase())).length,
    interested: enquiries.filter(e => e.status.toLowerCase() === "interested").length,
    converted: convertedCount,
    lost: enquiries.filter(e => ["lost", "not_interested", "not-interested"].includes(e.status.toLowerCase())).length
  };

  if (loading) {
    return <LoadingState message="Loading your dashboard portfolio..." />;
  }

  if (error) {
    return (
      <div className="error-container">
        <ShieldCheck size={48} className="text-rose-500" />
        <h3>Failed to Load Executive Workspace</h3>
        <p>{error}</p>
        <button onClick={fetchData} className="retry-btn">
          <RefreshCw size={16} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="executive-dashboard-container">
      {/* Welcome Banner */}
      <div className="welcome-header">
        <div>
          <h1 className="welcome-title">Good Morning, {getExecutiveName()}</h1>
          <p className="welcome-subtitle">Here is your sales activity and lead workflow for today.</p>
        </div>
        <div className="header-actions">
          <button onClick={fetchData} className="refresh-btn">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="kpi-grid">
        <KpiCard label="My Enquiries" value={totalMyEnqs} change="+4.5%" isUp={true} icon={MessageSquare} colorClass="bg-sky" />
        <KpiCard label="Pending Follow-ups" value={pendingFollowups} change="Next due shortly" isUp={true} icon={Clock} colorClass="bg-amber" />
        <KpiCard label="Today's Follow-ups" value={todayFollowUps.length} change="Scheduled today" isUp={true} icon={Calendar} colorClass="bg-rose" />
        <KpiCard label="Converted" value={convertedCount} change="+2" isUp={true} icon={CheckCircle2} colorClass="bg-emerald" />
        <KpiCard label="Conversion Rate" value={`${conversionRate}%`} change="+1.2%" isUp={true} icon={TrendingUp} colorClass="bg-emerald" />
      </div>

      {/* Conditional Tabs content */}
      {activeTab === "overview" && (
        <ExecutiveOverviewTab
          pipelineStages={pipelineStages}
          todayFollowUps={todayFollowUps}
          enquiries={enquiries}
          onViewDetails={setSelectedEnquiry}
        />
      )}

      {activeTab === "enquiries" && (
        <EnquiriesTab
          enquiries={enquiries}
          role="executive"
          onViewDetails={setSelectedEnquiry}
          onTriggerCall={triggerCall}
          onTriggerEmail={triggerEmail}
        />
      )}

      {activeTab === "followups" && (
        <div className="dashboard-card">
          <div className="card-header">
            <h3>My Scheduled Follow-ups</h3>
            <p>Direct view of active commitments and calls scheduled for you.</p>
          </div>
          <div className="followup-grid-view">
            {enquiries.filter(e => e.followUps && e.followUps.length > 0).length > 0 ? (
              <div className="exec-followups-columns">
                {enquiries.map(lead => (
                  lead.followUps.map((f, i) => (
                    <div key={i} className="followup-list-item-box">
                      <ExecutiveOverviewTab.FollowUpCard followUp={f} onAction={() => setSelectedEnquiry(lead)} />
                      <span className="lead-tag">Lead: {lead.customerName}</span>
                    </div>
                  ))
                ))}
              </div>
            ) : (
              <div className="card-body">
                <ConfirmationModal.EmptyState title="No followups scheduled" description="You have not scheduled any follow-ups for your enquiries." />
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "activities" && (
        <ActivitiesTab enquiries={enquiries} />
      )}

      {activeTab === "reports" && (
        <ExecutiveReportsTab
          pipelineStages={pipelineStages}
          totalMyEnqs={totalMyEnqs}
          convertedCount={convertedCount}
          conversionRate={conversionRate}
        />
      )}

      {/* Complete Lead Details / Action Workspace Modal */}
      {selectedEnquiry && (
        <LeadDetailsModal
          enquiry={selectedEnquiry}
          role="executive"
          onClose={() => setSelectedEnquiry(null)}
          onEditStatusClick={(currentStatus) => {
            setStatusForm(currentStatus);
            setShowStatusModal(true);
          }}
          onTriggerCall={triggerCall}
          onAddNoteClick={(type) => {
            setActivityDefaultType(type);
            setShowActivityModal(true);
          }}
          onScheduleFollowUpClick={() => setShowFollowUpModal(true)}
          onMarkConverted={(enq) => {
            setStatusForm("converted");
            setShowConvertConfirm(true);
          }}
          onMarkLost={(enq) => {
            setStatusForm("lost");
            setShowOutcomeConfirm(true);
          }}
        />
      )}

      {/* Change Status Modal */}
      {showStatusModal && (
        <StatusUpdateModal
          enquiry={selectedEnquiry}
          onClose={() => setShowStatusModal(false)}
          onSave={handleUpdateStatus}
        />
      )}

      {/* Add Call Note / General Activity Modal */}
      {showActivityModal && (
        <AddActivityModal
          defaultType={activityDefaultType}
          onClose={() => setShowActivityModal(false)}
          onSave={handleAddActivity}
        />
      )}

      {/* Schedule Follow-up Modal */}
      {showFollowUpModal && (
        <ScheduleFollowUpModal
          onClose={() => setShowFollowUpModal(false)}
          onSave={handleScheduleFollowUp}
        />
      )}

      {/* Convert Confirm Dialog */}
      <ConfirmationModal
        isOpen={showConvertConfirm}
        title="Convert Enquiry?"
        message={`Are you sure you want to mark lead ${selectedEnquiry?.customerName} as Converted? This represents a successfully completed deal.`}
        onConfirm={handleUpdateStatus}
        onCancel={() => setShowConvertConfirm(false)}
        confirmText="Confirm Conversion"
      />

      {/* Outcome Confirm Dialog (Lost/Not Interested) */}
      {showOutcomeConfirm && (
        <OutcomeConfirmModal
          statusType={statusForm}
          onClose={() => {
            setShowOutcomeConfirm(false);
          }}
          onConfirm={(reason) => handleUpdateStatus(statusForm, reason)}
        />
      )}
    </div>
  );
}

export default SalesExecutiveDashboard;
