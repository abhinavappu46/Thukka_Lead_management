import React from 'react';
import { MessageSquare } from 'lucide-react';
import { EmptyState } from '../../Common';

function ActivitiesTab({ enquiries }) {
  // Flatten and sort activities across all enquiries
  const allActivities = enquiries.reduce((acc, enq) => {
    if (enq.activities) {
      const enqActivities = enq.activities.map(a => ({
        ...a,
        leadName: enq.customerName,
        leadNumber: enq.enquiryNumber
      }));
      return [...acc, ...enqActivities];
    }
    return acc;
  }, []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (allActivities.length === 0) {
    return (
      <div className="dashboard-card">
        <div className="card-header">
          <h3>Contact History Timeline</h3>
          <p>Chronological feed of your calls, emails, and notes across all leads.</p>
        </div>
        <div className="card-body">
          <EmptyState title="No activity logged" description="You have not logged any sales activity yet." />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h3>Contact History Timeline</h3>
        <p>Chronological feed of your calls, emails, and notes across all leads.</p>
      </div>
      <div className="global-timeline-view scroll-vertical max-h-600">
        <div className="activity-timeline">
          {allActivities.map((act, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-marker">
                <div className="timeline-dot">
                  <MessageSquare size={12} />
                </div>
                {index < allActivities.length - 1 && <div className="timeline-connector"></div>}
              </div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <span className="activity-type-label">{act.activityType}</span>
                  <span className="activity-time">{new Date(act.createdAt).toLocaleString()}</span>
                </div>
                <p className="activity-notes">{act.notes}</p>
                <span className="lead-tag" style={{ fontSize: "10.5px", color: "#38bdf8", cursor: "pointer" }}>
                  Lead: {act.leadName} ({act.leadNumber})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ActivitiesTab;
