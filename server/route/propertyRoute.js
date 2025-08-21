import express from "express";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {verifyToken} from "../middleware/authMiddleware.js";
import {
  createProperty,
  getAllProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  searchProperties
} from "../controllers/propertyController.js";


const router = express.Router();



router.get("/search", searchProperties);
router.post("/create", verifyToken, createProperty);
router.get("/allproperties", getAllProperties);
router.get("/:id", getProperty);
router.put("/:id",verifyToken, updateProperty);
router.delete("/:id",verifyToken, authorizeRoles("admin"), deleteProperty);

export { router as propertyRoute };