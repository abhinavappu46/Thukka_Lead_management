import React from 'react';
import { ShieldCheck } from 'lucide-react';

function ExecutiveReportsTab({
  pipelineStages,
  totalMyEnqs,
  convertedCount,
  conversionRate
}) {
  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h3>My Sales Analytics</h3>
        <p>Performance report card for conversions, status stats, and deal rates.</p>
      </div>
      <div className="reports-analytics-grid">
        <div className="anal-card">
          <h4>Lead Status Distribution</h4>
          <div className="stage-distribution-box">
            {[
              { label: "New", count: pipelineStages.new, color: "bg-sky" },
              { label: "Contacted", count: pipelineStages.contacted, color: "bg-sky" },
              { label: "Follow-up", count: pipelineStages.followUp, color: "bg-amber" },
              { label: "Interested", count: pipelineStages.interested, color: "bg-sky" },
              { label: "Converted", count: pipelineStages.converted, color: "bg-emerald" },
              { label: "Lost / Rejected", count: pipelineStages.lost, color: "bg-rose" }
            ].map((s, idx) => {
              const pct = totalMyEnqs > 0 ? ((s.count / totalMyEnqs) * 100).toFixed(0) : 0;
              return (
                <div key={idx} className="anal-stage-row">
                  <div className="info">
                    <span>{s.label}</span>
                    <span>{s.count} ({pct}%)</span>
                  </div>
                  <div className="bar-bg">
                    <div className={`bar-fill ${s.color}`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="anal-card">
          <h4>My Conversion Analysis</h4>
          <div className="conversion-stats-metric">
            <div className="metric-box">
              <span className="label">Conversion Target</span>
              <h3>20%</h3>
            </div>
            <div className="metric-box">
              <span className="label">My Achievement</span>
              <h3 className="text-emerald-400">{conversionRate}%</h3>
            </div>
          </div>
          <div className="outcome-description-card">
            <ShieldCheck size={18} className="text-emerald-400" />
            <p>You have converted {convertedCount} enquiries from a portfolio of {totalMyEnqs} assigned customers.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExecutiveReportsTab;
