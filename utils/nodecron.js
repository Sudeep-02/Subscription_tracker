import cron from "node-cron";
import Subscription from "../models/subscription.model.js"; // Use .js extension
import User from "../models/user.model.js"; // Use .js extension
import sendExpiredEmail from "./new/expiredemail.js";
import sendReminderEmail from "./old/send-email.js";
// Set up a cron job to run every day at midnight (0 0 * * * for daily at midnight)

const checkSubscriptionRenewals = async () => {
  try {
    console.log("Checking subscription renewals...");

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to midnight for accurate comparison

    // Convert `today` to UTC midnight for comparison
    const todayUTC = new Date(today.toISOString()); // Convert to UTC

    const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000;

    // console.log("Today (UTC Midnight):", todayUTC);
    // const test = await Subscription.find({ isActive: true }).limit(1);
    // console.log(test);

    // Find subscriptions that have a renewal date matching today
    const subscriptions = await Subscription.find({
      renewalDate: { $gte: todayUTC },
      isActive: true,
    }).populate("user");

    for (const filter of subscriptions) {
      if (filter.renewalDate - todayUTC <= sevenDaysInMillis) {
        // Send renewal emails and update subscription status

        const daysleft = filter.renewalDate - todayUTC;
        await sendReminderEmail({ subscription: filter, daysleft });
      }
      // Check if the subscription has expired (renewal date in the past)
      if (filter.renewalDate - todayUTC < 0) {
        // Optionally, send an expired notification email
        await sendExpiredEmail(
          filter.user.email,
          filter.name,
          filter.renewalDate
        );
        filter.isActive = false; // Mark as expired
        await filter.save();
      }
    }
  } catch (error) {
    console.error("Error in subscription renewal job:", error);
  }
};

export default checkSubscriptionRenewals;
