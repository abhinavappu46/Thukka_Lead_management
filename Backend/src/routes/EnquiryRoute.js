const express = require("express");
const router = express.Router();

const AuthMiddleware = require("../middleware/AuthMiddleware");
const roleMiddleware = require("../middleware/RoleAuthMiddleware");

const { createEnquiry, getAllEnquiries, getEnquiryById, updateEnquiry, assignEnquiry, addActivity, scheduleFollowUp, updateStatus, getAdminStats, getActivityLogs, completeFollowUp, getReportsStats, createEnquiryAdmin } = require("../controller/EnquiryController");

router.post(
  "/",
  AuthMiddleware,
  roleMiddleware([
    "admin",
    "sales_manager",
    "sales_executive"
  ]),
  createEnquiry
);
router.post(
  "/manager/enquiry",
  AuthMiddleware,
  roleMiddleware([
    "sales_manager"
  ]),
  createEnquiryAdmin
);

router.get(
  "/admin/stats",
  AuthMiddleware,
  roleMiddleware(["admin"]),
  getAdminStats
);

router.get(
  "/reports/stats",
  AuthMiddleware,
  roleMiddleware(["admin", "sales_manager", "sales_executive"]),
  getReportsStats
);

router.get(
  "/activity-logs",
  AuthMiddleware,
  roleMiddleware(["admin"]),
  getActivityLogs
);

router.get(
  "/enquirys",
  AuthMiddleware,
  roleMiddleware([
    "admin",
    "sales_manager",
    "sales_executive"
  ]),
  getAllEnquiries
);
router.get(
  "/enquiry/:id",
  AuthMiddleware,
  roleMiddleware([
    "admin",
    "sales_manager",
    "sales_executive"
  ]),
  getEnquiryById
);
router.put(
  "/enquiry/:id",
  AuthMiddleware,
  roleMiddleware([
    "admin",
    "sales_manager",
    "sales_executive"
  ]),
  updateEnquiry
);
router.patch(
  "/:id/assign",
  AuthMiddleware,
  roleMiddleware(["admin", "sales_manager"]),
  assignEnquiry
);
router.patch(
  "/enquiry/:id/activity",
  AuthMiddleware,
  roleMiddleware(["admin", "sales_manager", "sales_executive"]),
  addActivity
);
router.patch(
  "/enquiry/:id/followup",
  AuthMiddleware,
  roleMiddleware(["admin", "sales_manager", "sales_executive"]),
  scheduleFollowUp
);
router.patch(
  "/enquiry/:id/status",
  AuthMiddleware,
  roleMiddleware(["admin", "sales_manager", "sales_executive"]),
  updateStatus
);

router.patch(
  "/enquiry/:enquiryNumber/followup/:followupId/complete",
  AuthMiddleware,
  roleMiddleware(["admin", "sales_manager", "sales_executive"]),
  completeFollowUp
);

module.exports = router;