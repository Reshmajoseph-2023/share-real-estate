// // import express from "express";
// // import {authorizeRoles} from "../middleware/roleMiddleware.js";
// // import {verifyToken} from "../middleware/authMiddleware.js";
// // import {
// //   bookVisit,
// //   getAllBookings,
// //   cancelBooking,
// //   Bookmark,
// //   getAllBookmarked,
// // } from "../controllers/userController.js";

// // const router = express.Router();
// // //Only admin can access this router
// // router.get("/admin",verifyToken,authorizeRoles("admin"), (req,res)=>{
// //   res.json({message:"Welcome Admin"});
// // });
// // //All can access this router
// // router.get("/user",verifyToken,authorizeRoles("admin","user"),(req,res)=>{
// //   res.json({message:"Welcome User"});
// // });
         
// // router.post("/bookVisit/:id", bookVisit);
// // router.get("/allBookings", verifyToken, getAllBookings);
// // router.post("/removeBooking/:id", verifyToken, cancelBooking);
// // router.post("/toFav/:rid", verifyToken, Bookmark);
// // router.get("/allFav", verifyToken, getAllBookmarked);

// // export { router as userRoute };

// import express from "express";
// import { authorizeRoles } from "../middleware/roleMiddleware.js";
// import { verifyToken } from "../middleware/authMiddleware.js";
// import {
//   bookVisit,
//   getAllBookings,
//   cancelBooking,
//   Bookmark,
//   getAllBookmarked,
// } from "../controllers/userController.js";

// const router = express.Router();

// // Admin-only test route
// router.get("/admin", verifyToken, authorizeRoles("admin"), (req, res) => {
//   res.json({ message: "Welcome Admin" });
// });

// // User route (example)
// router.get("/user", verifyToken, authorizeRoles("admin", "user"), (req, res) => {
//   res.json({ message: "Welcome User" });
// });

// // IMPORTANT: protect bookVisit with verifyToken
// router.post("/bookVisit/:propertyId", verifyToken, bookVisit);

// router.get("/allBookings", verifyToken, getAllBookings);
// router.post("/removeBooking/:propertyId", verifyToken, cancelBooking);
// router.post("/toFav/:rid", verifyToken, Bookmark);
// router.get("/allFav", verifyToken, getAllBookmarked);

// export { router as userRoute };



import express from "express";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  bookVisit,
  getAllBookings,
  cancelBooking,
  Bookmark,
  getAllBookmarked,
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
router.post("/removeBooking/:id", verifyToken, cancelBooking);
router.post("/toFav/:rid", verifyToken, Bookmark);
router.get("/allFav", verifyToken, getAllBookmarked);

export { router as userRoute };
