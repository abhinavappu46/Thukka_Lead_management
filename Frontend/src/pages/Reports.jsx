import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Award, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import api from "../Api/axios";
import { LoadingState } from "../components/Common";
import "./Reports.css";

function Reports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReportsStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/Enquiry/reports/stats");
      if (response.data.success) {
        setStats(response.data.stats);
      } else {
        setError("Failed to load reports data");
      }
    } catch (err) {
      console.error("Error loading reports data:", err);
      setError("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsStats();
  }, []);

  if (loading) {
    return <LoadingState message="Loading performance reports..." />;
  }

  if (error || !stats) {
    return (
      <div className="rep-error-container">
        <Award size={48} className="text-rose-500" />
        <h3>Failed to Load Reports</h3>
        <p>{error || "An unexpected error occurred"}</p>
        <button onClick={fetchReportsStats} className="rep-retry-btn">
          Retry
        </button>
      </div>
    );
  }

  const {
    conversionRate,
    conversionRateTrend,
    avgDealSize,
    avgDealSizeTrend,
    activeSalesCycle,
    activeSalesCycleTrend,
    funnel,
    sources
  } = stats;

  const websitePct = sources?.website?.percentage || 0;
  const linkedinPct = sources?.linkedin?.percentage || 0;
  const googlePct = sources?.google?.percentage || 0;
  const referralPct = sources?.referral?.percentage || 0;
  const totalLeads = sources?.totalLeads || 0;

  return (
    <div className="rep-container">
      {/* Header */}
      <div className="rep-header">
        <div className="rep-title-box">
          <h1 className="rep-title">Performance Reports</h1>
          <p className="rep-subtitle">Analyze sales conversion rates, lead pipelines, and monthly revenue performance.</p>
        </div>
        <button className="rep-export-btn">
          <Download size={16} />
          <span>Export PDF/CSV</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="rep-stats-row">
        {/* Card 1 */}
        <div className="rep-stat-card">
          <div className="rep-stat-main">
            <div className="rep-stat-header">
              <div>
                <span className="rep-stat-label">Conversion Rate</span>
                <h2 className="rep-stat-value">{conversionRate}%</h2>
              </div>
              <div className="rep-stat-icon bg-emerald-950/40 border-emerald-800/80 text-emerald-400">
                <TrendingUp size={20} />
              </div>
            </div>
          </div>
          <div className="rep-stat-footer">
            <span className={`rep-stat-trend ${conversionRateTrend >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {conversionRateTrend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {conversionRateTrend >= 0 ? `+${conversionRateTrend}%` : `${conversionRateTrend}%`}
            </span>
            <span className="rep-stat-comparison">vs previous month</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rep-stat-card">
          <div className="rep-stat-main">
            <div className="rep-stat-header">
              <div>
                <span className="rep-stat-label">Avg Deal Size</span>
                <h2 className="rep-stat-value">${avgDealSize.toLocaleString()}</h2>
              </div>
              <div className="rep-stat-icon bg-teal-950/40 border-teal-800/80 text-teal-400">
                <DollarSign size={20} />
              </div>
            </div>
          </div>
          <div className="rep-stat-footer">
            <span className={`rep-stat-trend ${avgDealSizeTrend >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {avgDealSizeTrend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {avgDealSizeTrend >= 0 ? `+${avgDealSizeTrend}%` : `${avgDealSizeTrend}%`}
            </span>
            <span className="rep-stat-comparison">vs previous month</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rep-stat-card">
          <div className="rep-stat-main">
            <div className="rep-stat-header">
              <div>
                <span className="rep-stat-label">Active Sales Cycle</span>
                <h2 className="rep-stat-value">{activeSalesCycle} Days</h2>
              </div>
              <div className="rep-stat-icon bg-green-950/40 border-green-800/80 text-green-400">
                <Users size={20} />
              </div>
            </div>
          </div>
          <div className="rep-stat-footer">
            <span className={`rep-stat-trend ${activeSalesCycleTrend <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {activeSalesCycleTrend <= 0 ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
              {activeSalesCycleTrend <= 0 ? `${activeSalesCycleTrend} Days` : `+${activeSalesCycleTrend} Days`}
            </span>
            <span className="rep-stat-comparison">
              {activeSalesCycleTrend <= 0 ? "shorter sales pipeline" : "longer sales pipeline"}
            </span>
          </div>
        </div>
      </div>

      {/* Visualizers Card */}
      <div className="rep-visualizer-grid">
        {/* Sales Funnel SVG Chart */}
        <div className="rep-chart-card">
          <div className="rep-chart-header">
            <h3 className="rep-chart-title">Inquiry Pipeline Funnel</h3>
            <p className="rep-chart-subtitle">Flow of leads from discovery to deal closure.</p>
          </div>

          <div className="rep-funnel-list">
            {(funnel || []).map((item, index) => (
              <div key={index} className="rep-funnel-item">
                <div className="rep-funnel-info">
                  <span className="rep-funnel-label">{item.stage}</span>
                  <span className="rep-funnel-count">{item.count} leads ({item.percentage}%)</span>
                </div>
                <div className="rep-funnel-track">
                  <div className={`rep-funnel-bar ${item.color}`} style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Distribution (Donut style / SVG details) */}
        <div className="rep-donut-card">
          <div className="rep-chart-header">
            <h3 className="rep-chart-title">Lead Generation Sources</h3>
            <p className="rep-chart-subtitle">Where your most profitable leads originate.</p>
          </div>

          {/* Custom SVG Donut / Segment visuals */}
          <div className="rep-donut-body">
            <div className="rep-donut-wrapper">
              {/* Outer SVG Circle */}
              <svg className="rep-donut-chart" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#1e293b" strokeWidth="3"></circle>
                {/* Segment Website */}
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="3" 
                  strokeDasharray={`${websitePct} ${100 - websitePct}`} strokeDashoffset="0" className="rep-donut-circle-segment"></circle>
                {/* Segment LinkedIn */}
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#059669" strokeWidth="3" 
                  strokeDasharray={`${linkedinPct} ${100 - linkedinPct}`} strokeDashoffset={`-${websitePct}`} className="rep-donut-circle-segment"></circle>
                {/* Segment Google */}
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#34d399" strokeWidth="3" 
                  strokeDasharray={`${googlePct} ${100 - googlePct}`} strokeDashoffset={`-${websitePct + linkedinPct}`} className="rep-donut-circle-segment"></circle>
                {/* Segment Referral */}
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#047857" strokeWidth="3" 
                  strokeDasharray={`${referralPct} ${100 - referralPct}`} strokeDashoffset={`-${websitePct + linkedinPct + googlePct}`} className="rep-donut-circle-segment"></circle>
              </svg>
              <div className="rep-donut-label">
                <span className="rep-donut-total-label">Total Leads</span>
                <span className="rep-donut-total-value">{totalLeads}</span>
              </div>
            </div>

            {/* Legends */}
            <div className="rep-legend-list">
              <div className="rep-legend-item">
                <span className="rep-legend-dot bg-emerald-500"></span>
                <span className="rep-legend-text">Website ({websitePct}%)</span>
              </div>
              <div className="rep-legend-item">
                <span className="rep-legend-dot bg-emerald-600"></span>
                <span className="rep-legend-text">LinkedIn ({linkedinPct}%)</span>
              </div>
              <div className="rep-legend-item">
                <span className="rep-legend-dot bg-emerald-400"></span>
                <span className="rep-legend-text">Google SEO ({googlePct}%)</span>
              </div>
              <div className="rep-legend-item">
                <span className="rep-legend-dot bg-emerald-700"></span>
                <span className="rep-legend-text">Referrals/Direct ({referralPct}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
