const Enquiry = require("../model/Enquiry");
const User = require("../model/user");
const createEnquiry = async (req, res) => {
  try {
    const {
      customerName,
      phone,
      email,
      source,
      notes,
      companyName,
      priority,
      assignedTo
    } = req.body;

    if (!customerName || !phone) {
      return res.status(400).json({
        success: false,
        message: "Customer name and phone are required"
      });
    }
    const enquiryCount = await Enquiry.countDocuments();
    const enquiryNumber = `ENQ-${String(enquiryCount + 1).padStart(4, "0")}`;

    const enquiry = await Enquiry.create({
      enquiryNumber,
      customerName,
      phone,
      email,
      source,
      notes: notes || "",
      companyName: companyName || "",
      priority: priority || "Warm",
      assignedTo: assignedTo || null,
      createdBy: req.user.id,
      activities: [{
        activityType: "Note",
        notes: `Enquiry created via ${source || "other"}.`,
        performedBy: req.user.id
      }]
    });

    res.status(201).json({
      success: true,
      message: "Enquiry created successfully",
      enquiry
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create enquiry",
      error: error.message
    });
  }
};




const getAllEnquiries = async (req, res) => {
  try {
    // console.log("USER:", req.user);
    let filter = {};
    if (req.user.role === "admin") {
      filter = {};
    }
    else if (req.user.role === "sales_manager") {
      filter = { assignedManager: req.user.id };
    }
    else if (req.user.role === "sales_executive") {
      filter = {
        assignedExecutive: req.user.id
      };
    }
    console.log("ROLE:", req.user.role);
    console.log("USER ID:", req.user.id);
    console.log("FILTER:", filter);
    const enquiries = await Enquiry.find(filter)
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role")
      .populate("assignedManager", "name email role")
      .populate("assignedExecutive", "name email role")
      .sort({ createdAt: -1 });


    console.log("FOUND ENQUIRIES:", enquiries.length);
    console.log(
      "ENQUIRY NUMBERS:",
      enquiries.map(e => e.enquiryNumber)
    );

    res.status(200).json({
      success: true,
      count: enquiries.length,
      enquiries
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiries",
      error: error.message
    });
  }
};




const getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findOne({ enquiryNumber: req.params.id })
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role");

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found"
      });
    }

    res.status(200).json({
      success: true,
      enquiry
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiry",
      error: error.message
    });
  }
};


const updateEnquiry = async (req, res) => {
  try {
    const {
      customerName,
      phone,
      email,
      source,
      status,
      notes,
      assignedTo
    } = req.body;

    const enquiry = await Enquiry.findOne({
      enquiryNumber: req.params.id
    });

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found"
      });
    }

    if (customerName) {
      enquiry.customerName = customerName;
    }

    if (phone) {
      enquiry.phone = phone;
    }

    if (email) {
      enquiry.email = email;
    }

    if (source) {
      enquiry.source = source;
    }

    if (status) {
      enquiry.status = status;
    }

    if (notes) {
      enquiry.notes = notes;
    }

    if (assignedTo) {
      enquiry.assignedTo = assignedTo;
    }

    await enquiry.save();

    const updatedEnquiry = await Enquiry.findOne({
      enquiryNumber: req.params.id
    })
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role");

    res.status(200).json({
      success: true,
      message: "Enquiry updated successfully",
      enquiry: updatedEnquiry
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update enquiry",
      error: error.message
    });
  }
};



const assignEnquiry = async (req, res) => {
  try {
    const { assignedTo } = req.body;

    if (!assignedTo) {
      return res.status(400).json({
        success: false,
        message: "Sales Executive ID is required"
      });
    }

    const user = await User.findById(assignedTo);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    const allowedRoles = ["sales_executive", "sales_manager"]
    if (!allowedRoles.includes(user.role)) {
      return res.status(400).json({
        success: false,
        message: "Enquiry can only be assigned to a Sales Executive or Sales manager"
      });
    }

    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message: "Cannot assign enquiry to an inactive user"
      });
    }

    const enquiry = await Enquiry.findOne({
      enquiryNumber: req.params.id
    }).populate("assignedTo");

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found"
      });
    }

    const oldExecutiveName = enquiry.assignedTo ? enquiry.assignedTo.name : "Unassigned";
    const newExecutiveName = user.name;
    if (user.role === "sales_manager") {

      // Save manager
      enquiry.assignedManager = user._id;

      // Manager assignment should not have an executive
      enquiry.assignedExecutive = null;

    } else if (user.role === "sales_executive") {

      // Save executive
      enquiry.assignedExecutive = user._id;
    }

    enquiry.assignedTo = assignedTo;

    // Log assignment activity
    let activityNotes = `Lead assigned to ${newExecutiveName}`;
    if (oldExecutiveName !== "Unassigned" && oldExecutiveName !== newExecutiveName) {
      activityNotes = `Lead reassigned from ${oldExecutiveName} to ${newExecutiveName}`;
    }

    enquiry.activities.push({
      activityType: "Note",
      notes: activityNotes,
      performedBy: req.user.id
    });

    await enquiry.save();

    const updatedEnquiry = await Enquiry.findOne({
      enquiryNumber: req.params.id
    })
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role")
      .populate("assignedManager", "name email role")
      .populate("assignedExecutive", "name email role");

    res.status(200).json({
      success: true,
      message: "Enquiry assigned successfully",
      enquiry: updatedEnquiry
    });

  } catch (error) {
    console.error("Assign enquiry error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to assign enquiry",
      error: error.message
    });
  }
};

const addActivity = async (req, res) => {
  try {
    const { activityType, notes } = req.body;
    if (!activityType || !notes) {
      return res.status(400).json({
        success: false,
        message: "Activity type and notes are required"
      });
    }

    const enquiry = await Enquiry.findOne({ enquiryNumber: req.params.id });
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found"
      });
    }

    enquiry.activities.push({
      activityType,
      notes,
      performedBy: req.user.id
    });
    enquiry.lastContacted = new Date();
    await enquiry.save();

    const updatedEnquiry = await Enquiry.findOne({ enquiryNumber: req.params.id })
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role")
      .populate("activities.performedBy", "name email role");

    res.status(200).json({
      success: true,
      message: "Activity added successfully",
      enquiry: updatedEnquiry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add activity",
      error: error.message
    });
  }
};

const scheduleFollowUp = async (req, res) => {
  try {
    const { followUpDate, followUpTime, followUpType, notes, reminder } = req.body;
    if (!followUpDate || !followUpType) {
      return res.status(400).json({
        success: false,
        message: "Follow-up date and type are required"
      });
    }

    const enquiry = await Enquiry.findOne({ enquiryNumber: req.params.id });
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found"
      });
    }

    enquiry.followUps.push({
      followUpDate,
      followUpTime,
      followUpType,
      notes,
      reminder: !!reminder,
      status: "pending"
    });
    enquiry.nextFollowUp = new Date(followUpDate);

    // Also record it as an activity
    enquiry.activities.push({
      activityType: "Follow-up Scheduled",
      notes: `Scheduled ${followUpType} follow-up for ${followUpDate} at ${followUpTime || 'N/A'}. Notes: ${notes || 'none'}`,
      performedBy: req.user.id
    });

    await enquiry.save();

    const updatedEnquiry = await Enquiry.findOne({ enquiryNumber: req.params.id })
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role")
      .populate("activities.performedBy", "name email role");

    res.status(200).json({
      success: true,
      message: "Follow-up scheduled successfully",
      enquiry: updatedEnquiry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to schedule follow-up",
      error: error.message
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status, reason } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }

    const enquiry = await Enquiry.findOne({ enquiryNumber: req.params.id });
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found"
      });
    }

    const oldStatus = enquiry.status;
    enquiry.status = status;

    let notesText = `Status changed from ${oldStatus} to ${status}`;
    if (reason) {
      notesText += `. Reason: ${reason}`;
    }

    enquiry.activities.push({
      activityType: "Status Change",
      notes: notesText,
      performedBy: req.user.id
    });

    await enquiry.save();

    const updatedEnquiry = await Enquiry.findOne({ enquiryNumber: req.params.id })
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role")
      .populate("activities.performedBy", "name email role");

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      enquiry: updatedEnquiry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: error.message
    });
  }
};

const getAdminStats = async (req, res) => {
  try {
    const totalEnquiries = await Enquiry.countDocuments();

    const newEnquiries = await Enquiry.countDocuments({
      status: { $in: ["new", "New"] }
    });

    const convertedEnquiries = await Enquiry.find({
      status: { $in: ["converted", "Converted", "Closed"] }
    });
    const convertedCount = convertedEnquiries.length;

    // Total Sales Value from converted enquiries
    const salesValue = convertedEnquiries.reduce((sum, enq) => sum + (enq.dealSize || 10000), 0);

    // Conversion rate
    const conversionRate = totalEnquiries > 0
      ? ((convertedCount / totalEnquiries) * 100).toFixed(1)
      : "0.0";

    // Follow-ups today: Match what client considers today using UTC split method
    const todayStr = new Date().toISOString().split("T")[0];
    const startOfToday = new Date(`${todayStr}T00:00:00.000Z`);
    const endOfToday = new Date(`${todayStr}T23:59:59.999Z`);

    const followupsToday = await Enquiry.countDocuments({
      nextFollowUp: {
        $gte: startOfToday,
        $lte: endOfToday
      }
    });

    // Chart Data aggregation: past 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setDate(1); // avoid JavaScript month rollover bug
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyStats = await Enquiry.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            status: "$status"
          },
          count: { $sum: 1 }
        }
      }
    ]);

    const monthsNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Generate list of last 6 months in chronological order
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(1); // avoid JavaScript month rollover bug
      d.setMonth(d.getMonth() - i);
      last6Months.push({
        year: d.getFullYear(),
        monthNum: d.getMonth() + 1,
        monthName: monthsNames[d.getMonth()],
        Converted: 0,
        Lost: 0
      });
    }

    monthlyStats.forEach(stat => {
      const match = last6Months.find(m => m.year === stat._id.year && m.monthNum === stat._id.month);
      if (match) {
        const status = (stat._id.status || "").toLowerCase();
        if (status === "converted") {
          match.Converted += stat.count;
        } else if (["lost", "not_interested", "not-interested"].includes(status)) {
          match.Lost += stat.count;
        }
      }
    });

    const chartData = last6Months.map(m => ({
      month: m.monthName,
      Converted: m.Converted,
      Lost: m.Lost
    }));

    // Fetch latest 5 enquiry activities across all enquiries
    const latestActivities = await Enquiry.aggregate([
      { $unwind: "$activities" },
      { $sort: { "activities.createdAt": -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          id: "$enquiryNumber",
          name: "$customerName",
          activity: "$activities.notes",
          time: "$activities.createdAt"
        }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalEnquiries,
        newEnquiries,
        conversionRate,
        followupsToday,
        convertedCount,
        salesValue
      },
      chartData,
      latestActivities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin stats",
      error: error.message
    });
  }
};

const getActivityLogs = async (req, res) => {
  try {
    const logs = await Enquiry.aggregate([
      { $unwind: "$activities" },
      { $sort: { "activities.createdAt": -1 } },
      {
        $lookup: {
          from: "users",
          localField: "activities.performedBy",
          foreignField: "_id",
          as: "performer"
        }
      },
      { $unwind: { path: "$performer", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          id: "$activities._id",
          enquiryNumber: 1,
          customerName: 1,
          type: "$activities.activityType",
          notes: "$activities.notes",
          time: "$activities.createdAt",
          performedBy: { $ifNull: ["$performer.name", "System"] }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      logs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch activity logs",
      error: error.message
    });
  }
};

const completeFollowUp = async (req, res) => {
  try {
    const { enquiryNumber, followupId } = req.params;
    const enquiry = await Enquiry.findOne({ enquiryNumber });
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found"
      });
    }

    const followUp = enquiry.followUps.id(followupId);
    if (!followUp) {
      return res.status(404).json({
        success: false,
        message: "Follow-up not found"
      });
    }

    followUp.status = "completed";

    enquiry.activities.push({
      activityType: "Note",
      notes: `Completed follow-up (Type: ${followUp.followUpType}) scheduled for ${followUp.followUpDate ? new Date(followUp.followUpDate).toISOString().split("T")[0] : "N/A"}`,
      performedBy: req.user.id
    });

    await enquiry.save();

    res.status(200).json({
      success: true,
      message: "Follow-up completed successfully",
      enquiry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to complete follow-up",
      error: error.message
    });
  }
};

const getReportsStats = async (req, res) => {
  try {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // 1. Conversion Rate
    const totalCount = await Enquiry.countDocuments();
    const blackjackCount = await Enquiry.countDocuments({ status: { $in: ["converted", "Closed"] } });
    const conversionRate = totalCount > 0 ? parseFloat(((blackjackCount / totalCount) * 100).toFixed(1)) : 0.0;

    const totalCurMonth = await Enquiry.countDocuments({ createdAt: { $gte: currentMonthStart } });
    const convertedCurMonth = await Enquiry.countDocuments({
      status: { $in: ["converted", "Closed"] },
      createdAt: { $gte: currentMonthStart }
    });
    const convRateCurMonth = totalCurMonth > 0 ? (convertedCurMonth / totalCurMonth) * 100 : 0.0;

    const totalLastMonth = await Enquiry.countDocuments({
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
    });
    const convertedLastMonth = await Enquiry.countDocuments({
      status: { $in: ["converted", "Closed"] },
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
    });
    const convRateLastMonth = totalLastMonth > 0 ? (convertedLastMonth / totalLastMonth) * 100 : 0.0;
    const conversionRateTrend = parseFloat((convRateCurMonth - convRateLastMonth).toFixed(1));

    // 2. Avg Deal Size
    const convertedEnquiries = await Enquiry.find({ status: { $in: ["converted", "Closed"] } });
    const totalDealSize = convertedEnquiries.reduce((sum, enq) => sum + (enq.dealSize || 8500), 0);
    const avgDealSize = convertedEnquiries.length > 0 ? Math.round(totalDealSize / convertedEnquiries.length) : 8450;

    const convertedCurMonthEnqs = await Enquiry.find({
      status: { $in: ["converted", "Closed"] },
      createdAt: { $gte: currentMonthStart }
    });
    const totalDealSizeCur = convertedCurMonthEnqs.reduce((sum, enq) => sum + (enq.dealSize || 8500), 0);
    const avgDealSizeCur = convertedCurMonthEnqs.length > 0 ? Math.round(totalDealSizeCur / convertedCurMonthEnqs.length) : 8450;

    const convertedLastMonthEnqs = await Enquiry.find({
      status: { $in: ["converted", "Closed"] },
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
    });
    const totalDealSizeLast = convertedLastMonthEnqs.reduce((sum, enq) => sum + (enq.dealSize || 8500), 0);
    const avgDealSizeLast = convertedLastMonthEnqs.length > 0 ? Math.round(totalDealSizeLast / convertedLastMonthEnqs.length) : 8000;

    let avgDealSizeTrend = 0.0;
    if (avgDealSizeLast > 0) {
      avgDealSizeTrend = parseFloat((((avgDealSizeCur - avgDealSizeLast) / avgDealSizeLast) * 100).toFixed(1));
    }

    // 3. Active Sales Cycle
    const getSalesCycleDays = (enquiry) => {
      const conversionActivity = enquiry.activities.find(act =>
        act.activityType === "Status Change" &&
        (act.notes.toLowerCase().includes("converted") || act.notes.toLowerCase().includes("closed"))
      );
      const conversionDate = conversionActivity ? new Date(conversionActivity.createdAt) : new Date(enquiry.updatedAt);
      const createdDate = new Date(enquiry.createdAt);
      const diffTime = Math.abs(conversionDate - createdDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    const cycleDaysList = convertedEnquiries.map(getSalesCycleDays);
    const activeSalesCycle = cycleDaysList.length > 0
      ? Math.round(cycleDaysList.reduce((sum, days) => sum + days, 0) / cycleDaysList.length)
      : 14;

    const cycleDaysListCur = convertedCurMonthEnqs.map(getSalesCycleDays);
    const avgSalesCycleCur = cycleDaysListCur.length > 0
      ? Math.round(cycleDaysListCur.reduce((sum, days) => sum + days, 0) / cycleDaysListCur.length)
      : 14;

    const cycleDaysListLast = convertedLastMonthEnqs.map(getSalesCycleDays);
    const avgSalesCycleLast = cycleDaysListLast.length > 0
      ? Math.round(cycleDaysListLast.reduce((sum, days) => sum + days, 0) / cycleDaysListLast.length)
      : 16;

    const activeSalesCycleTrend = avgSalesCycleCur - avgSalesCycleLast;

    // 4. Funnel stages
    const contactedCount = await Enquiry.countDocuments({
      status: { $in: ["contacted", "follow_up", "interested", "converted", "In Progress", "Closed"] }
    });
    const proposalCount = await Enquiry.countDocuments({
      status: { $in: ["interested", "converted", "Closed"] }
    });
    const wonCount = await Enquiry.countDocuments({
      status: { $in: ["converted", "Closed"] }
    });

    const funnel = [
      { stage: '1. New Enquiries Received', count: totalCount, percentage: 100, color: 'bg-emerald-700' },
      { stage: '2. Contacted / Qualifed', count: contactedCount, percentage: totalCount > 0 ? Math.round((contactedCount / totalCount) * 100) : 0, color: 'bg-emerald-600' },
      { stage: '3. Proposal Sent', count: proposalCount, percentage: totalCount > 0 ? Math.round((proposalCount / totalCount) * 100) : 0, color: 'bg-emerald-500' },
      { stage: '4. Closed / Contract Won', count: wonCount, percentage: totalCount > 0 ? Math.round((wonCount / totalCount) * 100) : 0, color: 'bg-emerald-400' }
    ];

    // 5. Source stats
    const websiteCount = await Enquiry.countDocuments({ source: { $in: ["website", "Website"] } });
    const linkedinCount = await Enquiry.countDocuments({ source: { $in: ["LinkedIn", "linkedin"] } });
    const googleCount = await Enquiry.countDocuments({ source: { $in: ["Google", "google"] } });
    const referralCount = await Enquiry.countDocuments({
      source: { $in: ["referral", "Referral", "Direct", "direct", "whatsapp", "phone", "facebook", "instagram", "other"] }
    });

    const totalWithSource = websiteCount + linkedinCount + googleCount + referralCount;

    const sources = {
      totalLeads: totalCount,
      website: {
        count: websiteCount,
        percentage: totalWithSource > 0 ? Math.round((websiteCount / totalWithSource) * 100) : 45
      },
      linkedin: {
        count: linkedinCount,
        percentage: totalWithSource > 0 ? Math.round((linkedinCount / totalWithSource) * 100) : 30
      },
      google: {
        count: googleCount,
        percentage: totalWithSource > 0 ? Math.round((googleCount / totalWithSource) * 100) : 15
      },
      referral: {
        count: referralCount,
        percentage: totalWithSource > 0 ? Math.round((referralCount / totalWithSource) * 100) : 10
      }
    };

    res.status(200).json({
      success: true,
      stats: {
        conversionRate,
        conversionRateTrend,
        avgDealSize,
        avgDealSizeTrend,
        activeSalesCycle,
        activeSalesCycleTrend,
        funnel,
        sources
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate reports statistics",
      error: error.message
    });
  }
};

module.exports = {
  createEnquiry,
  getAllEnquiries,
  getEnquiryById,
  updateEnquiry,
  assignEnquiry,
  addActivity,
  scheduleFollowUp,
  updateStatus,
  getAdminStats,
  getActivityLogs,
  completeFollowUp,
  getReportsStats
};
