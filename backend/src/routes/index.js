import userAuthRoute from "./userAuthRoute.js";
import userRoute from "./userRoute.js";
import claimRoute from "./claimRoute.js";
import garageRoute from "./garageRoute.js";
import feedbackRoute from "./feedbackRoute.js";

const routes = [
  {
    path: "/auth",
    route: userAuthRoute,
  },
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/claim",
    route: claimRoute,
  },
  {
    path: "/garage",
    route: garageRoute,
  },
  {
    path: "/feedback",
    route: feedbackRoute,
  },
];

export default routes;
