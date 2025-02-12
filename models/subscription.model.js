import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription name is required"],
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    price: {
      type: Number,
      required: [true, "Subscription price is required"],
      min: [0, "Price must be greater than 0"],
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP"],
      default: "USD",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
    category: {
      type: String,
      enum: [
        "sports",
        "news",
        "entertainment",
        "lifestyle",
        "technology",
        "finance",
        "politics",
        "other",
      ],
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    renewalDate: {
      type: Date,
      validate: {
        validator: function (value) {
          //Arrow function doesn't work
          return value > this.createdAt;
        },
        message: "Renewal date must be after the start date",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Auto-calculate renewal date if missing.
subscriptionSchema.pre("save", function (next) {
  if (!this.renewalDate) {
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: "month", // Special case for monthly
      yearly: "year", // Special case for yearly
    };

    this.renewalDate = new Date(this.createdAt);

    const frequency = this.frequency;
    const period = renewalPeriods[frequency];

    if (frequency === "monthly") {
      // Add 1 month to the current date
      this.renewalDate.setMonth(this.renewalDate.getMonth() + 1);
    } else if (frequency === "yearly") {
      // Add 1 year to the current date
      this.renewalDate.setFullYear(this.renewalDate.getFullYear() + 1);
    } else {
      // For daily and weekly, simply add the number of days
      this.renewalDate.setDate(this.renewalDate.getDate() + period);
    }
  }

  // Auto-update the status if renewal date has passed
  if (this.renewalDate < new Date()) {
    this.status = "expired";
  }

  next();
});
const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
