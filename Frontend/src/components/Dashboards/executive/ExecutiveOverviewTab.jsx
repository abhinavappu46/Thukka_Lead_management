import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { FollowUpCard, EmptyState, PriorityBadge, EnquiryStatusBadge } from '../../Common';

function ExecutiveOverviewTab({
  pipelineStages,
  todayFollowUps,
  enquiries,
  onViewDetails
}) {
  return (
    <div className="overview-tab-grid">
      {/* Row 1: Pipeline stage metrics */}
      <div className="dashboard-card pipeline-card-full">
        <div className="card-header">
          <h3>My Enquiry Pipeline</h3>
          <p>Current distribution of your deals across sales cycles</p>
        </div>
        <div className="pipeline-horizontal-flow">
          {[
            { label: "New Leads", count: pipelineStages.new, color: "border-sky" },
            { label: "Contacted", count: pipelineStages.contacted, color: "border-sky" },
            { label: "Follow-up", count: pipelineStages.followUp, color: "border-amber" },
            { label: "Interested", count: pipelineStages.interested, color: "border-indigo" },
            { label: "Converted", count: pipelineStages.converted, color: "border-emerald" },
            { label: "Lost", count: pipelineStages.lost, color: "border-rose" }
          ].map((stage, i) => (
            <div key={i} className={`pipeline-step ${stage.color}`}>
              <span className="step-val">{stage.count}</span>
              <span className="step-label">{stage.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Today's follow-ups & Recent enquiries */}
      <div className="details-columns-split">
        {/* Today's Followups */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Today's Follow-ups</h3>
          </div>
          <div className="card-body scroll-vertical max-h-400">
            {todayFollowUps.length > 0 ? (
              <div className="followup-list-container">
                {todayFollowUps.map(lead => (
                  lead.followUps.filter(f => f.status === "pending").map((f, i) => (
                    <FollowUpCard key={i} followUp={f} onAction={() => onViewDetails(lead)} />
                  ))
                ))}
              </div>
            ) : (
              <EmptyState title="No followups today" description="No customer follow-up calls are due today." />
            )}
          </div>
        </div>

        {/* Recent Enquiries list */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Recent Enquiries</h3>
          </div>
          <div className="card-body">
            <div className="table-wrapper">
              <table className="crm-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.slice(0, 5).map(enq => (
                    <tr key={enq._id} className="crm-tr">
                      <td>
                        <div className="td-name">{enq.customerName}</div>
                        <div className="td-company">{enq.companyName || "No Company"}</div>
                      </td>
                      <td><PriorityBadge priority={enq.priority} /></td>
                      <td><EnquiryStatusBadge status={enq.status} /></td>
                      <td>
                        <button onClick={() => onViewDetails(enq)} className="action-icon-btn">
                          <ArrowUpRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExecutiveOverviewTab;
