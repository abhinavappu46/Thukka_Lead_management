const User = require("../model/user");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message
    });
  }
};


const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    if (name) {
      user.name = name;
    }

    if (email) {
      user.email = email;
    }

    if (role) {
      user.role = role;
    }
    await user.save();
    const updatedUser = user.toObject();
    delete updatedUser.password;
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message
    });
  }
}



const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.isActive = !user.isActive;

    await user.save();

    res.status(200).json({
      success: true,
      message: user.isActive
        ? "User activated successfully"
        : "User deactivated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user status",
      error: error.message
    });
  }
};

const getExecutives = async (req, res) => {
  try {
    const executives = await User.find({ role: "sales_executive", isActive: true }).select("name email role isActive");
    res.status(200).json({
      success: true,
      executives
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch sales managers",
      error: error.message
    });
  }
};

const getManagers = async (req, res) => {
  try {
    const managers = await User.find({ role: "sales_manager", isActive: true }).select("name email role isActive");
    res.status(200).json({
      success: true,
      managers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch sales executives",
      error: error.message,
    });
    console.log(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  toggleUserStatus,
  getExecutives,
  getManagers
};