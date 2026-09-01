import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { FollowUpCard, EmptyState, EnquiryStatusBadge } from '../../Common';

function ManagerOverviewTab({
  execPerformance,
  totalEnqs,
  enquiries,
  convertedCount,
  todayFollowUps,
  onViewDetails
}) {
  return (
    <div className="overview-tab-grid">
      {/* Row 1: Charts */}
      <div className="chart-row-grid">
        {/* Team Performance Chart */}
        <div className="dashboard-card chart-card">
          <div className="card-header">
            <div>
              <h3>Team Performance Chart</h3>
              <p>Lead conversion analysis per active Sales Executive</p>
            </div>
          </div>
          <div className="card-body">
            <div style={{ height: '220px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={execPerformance.slice(0, 5).map(ep => ({
                    name: ep.exec.name.split(" ")[0],
                    Assigned: ep.assigned,
                    Converted: ep.converted
                  }))}
                  margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis stroke="#64748b" tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderColor: 'rgba(255,255,255,0.08)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
                  <Bar dataKey="Assigned" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Converted" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="dashboard-card chart-card">
          <div className="card-header">
            <div>
              <h3>Conversion / Sales Chart</h3>
              <p>Current distribution of active and completed deals</p>
            </div>
          </div>
          <div className="card-body">
            <div className="conversion-chart-funnel">
              {[
                { label: "Total Enquiries", count: totalEnqs, width: "100%", bg: "rgba(56, 189, 248, 0.2)" },
                { label: "Contacted", count: enquiries.filter(e => e.status.toLowerCase() !== "new").length, width: "80%", bg: "rgba(129, 140, 248, 0.2)" },
                { label: "Interested / Follow-up", count: enquiries.filter(e => ["follow_up", "interested", "In Progress"].includes(e.status)).length, width: "60%", bg: "rgba(251, 191, 36, 0.2)" },
                { label: "Converted", count: `${(convertedCount / (totalEnqs || 1)) * 100}`, width: "40%", bg: "rgba(16, 185, 129, 0.2)" }
              ].map((item, idx) => (
                <div key={idx} className="funnel-tier" style={{ width: item.width, background: item.bg }}>
                  <span className="funnel-tier-label">{item.label}</span>
                  <span className="funnel-tier-val">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Followup & Recent table */}
      <div className="overview-details-grid">
        {/* Follow-up Overview */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Follow-up Overview</h3>
          </div>
          <div className="card-body scroll-vertical max-h-400">
            {todayFollowUps.length > 0 ? (
              <div className="followups-list">
                {todayFollowUps.map(lead => (
                  lead.followUps.filter(f => f.status === "pending").map((f, i) => (
                    <FollowUpCard key={i} followUp={f} onAction={() => onViewDetails(lead)} />
                  ))
                ))}
              </div>
            ) : (
              <EmptyState title="No follow-ups today" description="No customer follow-up calls are scheduled for today." />
            )}
          </div>
        </div>

        {/* Recent Team Enquiries */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Recent Team Enquiries</h3>
          </div>
          <div className="card-body">
            <div className="table-wrapper">
              <table className="crm-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Executive</th>
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
                      <td>{enq.assignedTo?.name || <span className="text-amber-500">Unassigned</span>}</td>
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

export default ManagerOverviewTab;
