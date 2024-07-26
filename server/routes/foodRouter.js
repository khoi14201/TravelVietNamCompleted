import { Router } from "express";

import {
  createFood,
  deleteFood,
  getFoods,
  updateFood,
} from "../controllers/food.js";
import auth from "../middleware/auth.js";
import checkAccess from "../middleware/checkAccess.js";
import foodPermissions from "../middleware/permissions/food/foodPermissions.js";

const foodRouter = Router();
foodRouter.post("/", auth, createFood);
foodRouter.get("/", getFoods);
foodRouter.delete(
  "/:foodId",
  auth,
  checkAccess(foodPermissions.delete),
  deleteFood
);
foodRouter.patch(
  "/:foodId",
  auth,
  checkAccess(foodPermissions.update),
  updateFood
);
export default foodRouter;
