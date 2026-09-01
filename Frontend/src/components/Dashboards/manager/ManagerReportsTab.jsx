import React, { useState } from 'react';

function ManagerReportsTab({
  enquiries,
  execPerformance,
  convertedCount,
  lostCount,
  totalEnqs,
  estimatedSalesValue
}) {
  const [timeFilter, setTimeFilter] = useState('This Month');

  return (
    <div className="reports-tab-container">
      <div className="filter-row">
        <div className="time-filters">
          {["Today", "This Week", "This Month", "This Quarter"].map(tf => (
            <button 
              key={tf} 
              className={`time-filter-btn ${timeFilter === tf ? "active" : ""}`}
              onClick={() => setTimeFilter(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="report-sections-grid">
        {/* Attrition Report */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Lead Stage Distribution</h3>
          </div>
          <div className="card-body">
            <div className="lead-stage-report">
              {[
                { label: "New", count: enquiries.filter(e => e.status.toLowerCase() === "new").length, color: "bg-sky" },
                { label: "Contacted", count: enquiries.filter(e => e.status.toLowerCase() === "contacted").length, color: "bg-sky" },
                { label: "Follow-up", count: enquiries.filter(e => ["follow_up", "follow-up"].includes(e.status.toLowerCase())).length, color: "bg-amber" },
                { label: "Interested", count: enquiries.filter(e => e.status.toLowerCase() === "interested").length, color: "bg-sky" },
                { label: "Converted", count: convertedCount, color: "bg-emerald" },
                { label: "Lost / Not Interested", count: lostCount, color: "bg-rose" }
              ].map((stage, i) => {
                const pct = totalEnqs > 0 ? ((stage.count / totalEnqs) * 100).toFixed(1) : 0;
                return (
                  <div key={i} className="stage-row">
                    <div className="stage-info">
                      <span>{stage.label}</span>
                      <span className="count font-semibold">{stage.count} ({pct}%)</span>
                    </div>
                    <div className="stage-bar-bg">
                      <div className={`stage-bar-fill ${stage.color}`} style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sales report */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Sales Value & Executive Share</h3>
          </div>
          <div className="card-body">
            <div className="sales-value-report">
              <div className="value-header-box">
                <span className="label">Total Generated Revenue</span>
                <h2 className="text-emerald-400">${estimatedSalesValue.toLocaleString()}</h2>
                <span className="desc">Based on converted leads multiplied by average value.</span>
              </div>
              
              <div className="executive-contributions">
                <h4>Contribution by Executive</h4>
                {execPerformance.map((ep, i) => {
                  const revenue = ep.converted * 12500;
                  const revPct = estimatedSalesValue > 0 ? ((revenue / estimatedSalesValue) * 100).toFixed(0) : 0;
                  return (
                    <div key={i} className="contribution-row">
                      <span className="exec-name">{ep.exec.name}</span>
                      <div className="contribution-bar">
                        <div className="bar-fill" style={{ width: `${revPct}%` }}></div>
                      </div>
                      <span className="exec-revenue">${revenue.toLocaleString()} ({revPct}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerReportsTab;
