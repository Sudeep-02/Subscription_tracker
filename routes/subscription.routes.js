import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import {
  createSubscription,
  getUserSubscriptions,
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.post("/", authorize, createSubscription);

subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions); // this fetches all subs for user

// subscriptionRouter.put("/:id", (req, res) =>
//   res.send({ title: "UPDATE subscription" })
// );
// subscriptionRouter.delete("/:id", (req, res) =>
//   res.send({ title: "DELETE subscription" })
// );
export default subscriptionRouter;
