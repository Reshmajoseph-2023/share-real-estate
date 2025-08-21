import express from "express";
import {authorizeRoles} from "../middleware/roleMiddleware.js";
import {verifyToken} from "../middleware/authMiddleware.js";
import {
  RequestViewing,
  getAllBookings,
  cancelBooking,
  Bookmark,
  getAllBookmarked,
} from "../controllers/userController.js";

const router = express.Router();
//Only admin can access this router
router.get("/admin",verifyToken,authorizeRoles("admin"), (req,res)=>{
  res.json({message:"Welcome Admin"});
});
//All can access this router
router.get("/user",verifyToken,authorizeRoles("admin","user"),(req,res)=>{
  res.json({message:"Welcome User"});
});
         
router.post("/requestViewing/:id", verifyToken, RequestViewing);
router.get("/allBookings", verifyToken, getAllBookings);
router.post("/removeBooking/:id", verifyToken, cancelBooking);
router.post("/toFav/:rid", verifyToken, Bookmark);
router.get("/allFav", verifyToken, getAllBookmarked);

export { router as userRoute };
