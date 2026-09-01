import React from 'react';

function ManagerPerformanceTab({ execPerformance }) {
  return (
    <div className="dashboard-card performance-tab-card">
      <div className="card-header">
        <h3>Sales Executive Performance Matrix</h3>
        <p>Review individual metrics, conversions, and conversion rates.</p>
      </div>
      <div className="table-wrapper">
        <table className="crm-table">
          <thead>
            <tr>
              <th>Executive</th>
              <th className="text-right">Assigned</th>
              <th className="text-right">Contacted</th>
              <th className="text-right">Converted</th>
              <th className="text-right">Lost</th>
              <th className="text-right">Conversion Rate</th>
            </tr>
          </thead>
          <tbody>
            {execPerformance.map((ep, i) => (
              <tr key={i} className="crm-tr">
                <td className="font-semibold">{ep.exec.name}</td>
                <td className="text-right font-medium">{ep.assigned}</td>
                <td className="text-right">{ep.contacted}</td>
                <td className="text-right text-emerald-400 font-semibold">{ep.converted}</td>
                <td className="text-right text-rose-400">{ep.lost}</td>
                <td className="text-right text-emerald-400 font-bold">{ep.convRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManagerPerformanceTab;
