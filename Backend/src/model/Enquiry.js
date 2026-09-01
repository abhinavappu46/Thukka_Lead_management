const mongoose = require("mongoose");


const EnquirySchema = new mongoose.Schema({
  enquiryNumber: {
    type: String,
    unique: true
  },

  customerName: {
    type: String,
    required: true,
    trim: true
  },

  companyName: {
    type: String,
    default: ""
  },

  phone: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    trim: true,
    lowercase: true
  },

  source: {
    type: String,
    enum: [
      "website",
      "whatsapp",
      "phone",
      "facebook",
      "instagram",
      "referral",
      "other",
      "Website",
      "LinkedIn",
      "Google",
      "Referral",
      "Direct"
    ],
    default: "other"
  },
  status: {
    type: String,
    enum: [
      "new",
      "contacted",
      "follow_up",
      "interested",
      "converted",
      "not_interested",
      "lost",
      "New",
      "In Progress",
      "Closed"
    ],
    default: "new"
  },
  priority: {
    type: String,
    enum: ["Hot", "Warm", "Cold", "hot", "warm", "cold"],
    default: "Warm"
  },
  dealSize: {
    type: Number,
    default: function () {
      // Default to a random deal size between 5000 and 15000 in steps of 500
      return 5000 + Math.floor(Math.random() * 21) * 500;
    }
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  assignedManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  assignedExecutive: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  notes: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  lastContacted: {
    type: Date,
    default: null
  },
  nextFollowUp: {
    type: Date,
    default: null
  },
  activities: [{
    activityType: {
      type: String,
      enum: ["Call", "Email", "WhatsApp", "Meeting", "Note", "Status Change", "Follow-up Scheduled"],
      default: "Note"
    },
    notes: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  followUps: [{
    followUpDate: Date,
    followUpTime: String,
    followUpType: String,
    notes: String,
    reminder: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ["pending", "completed", "overdue"],
      default: "pending"
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
},
  {
    timestamps: true
  });
const Enquiry = mongoose.model("Enquiry", EnquirySchema);
module.exports = Enquiry;