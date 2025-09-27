
import express from "express";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  bookVisit,
  getAllBookings,
  cancelBooking,
  Bookmark,
  AllBookmarked,
  AllMyProperties
} from "../controllers/userController.js";

const router = express.Router();

// admin check
router.get("/admin", verifyToken, authorizeRoles("admin"), (_req, res) => {
  res.json({ message: "Welcome Admin" });
});

// user check
router.get("/user", verifyToken, authorizeRoles("admin", "user"), (_req, res) => {
  res.json({ message: "Welcome User" });
});

// PROTECTED endpoints
router.post("/bookVisit/:id", verifyToken, bookVisit); 
router.get("/allBookings", verifyToken, getAllBookings);
router.get("/properties", verifyToken, AllMyProperties);
router.post("/removeBooking/:id", verifyToken, cancelBooking);
router.post("/toFav/:rid", verifyToken, Bookmark);
router.post("/allFav", verifyToken, AllBookmarked);

export { router as userRoute };
