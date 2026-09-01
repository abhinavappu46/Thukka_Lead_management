const express = require("express");
const router = express.Router();
const AuthMiddleware = require("../middleware/AuthMiddleware");
const roleMiddleware = require("../middleware/RoleAuthMiddleware");

const { getAllUsers, getUserById, updateUser, toggleUserStatus, getExecutives, getManagers } = require("../controller/UserController");

router.get(
    "/executives",
    AuthMiddleware,
    roleMiddleware(["admin", "sales_manager"]),
    getExecutives
);

router.get(
    "/users",
    AuthMiddleware,
    roleMiddleware(["admin"]),
    getAllUsers
);
router.get(
    "/users/:id",
    AuthMiddleware,
    roleMiddleware(["admin"]),
    getUserById
);
router.put(
    "/users/:id",
    AuthMiddleware,
    roleMiddleware(["admin"]),
    updateUser
);
router.put(
    "/users/:id/status",
    AuthMiddleware,
    roleMiddleware(["admin"]),
    toggleUserStatus
);
router.get(
    "/managers",
    AuthMiddleware,
    roleMiddleware(["admin"]),
    getManagers
);
module.exports = router;