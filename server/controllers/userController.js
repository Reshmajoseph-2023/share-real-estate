import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

// function to book a visit to resd
const asArray = (v) => (Array.isArray(v) ? v : []);

// POST /api/user/bookVisit/:id  (token required)
export const bookVisit = asyncHandler(async (req, res) => {
  // TEMP LOGS (remove after you’re done debugging)
  console.log("bookVisit params:", req.params);
  console.log("bookVisit user:", req.user);
  console.log("bookVisit body:", req.body);

  // Accept either :id or :propertyId
  const propertyId = req.params.id ?? req.params.propertyId;
  const { email, date } = req.body;

  if (!req.user?.id) return res.status(401).json({ message: "Unauthenticated" });
  if (!propertyId) return res.status(400).json({ message: "property id is required" });
  if (!date) return res.status(400).json({ message: "date is required" });

  // robust date coercion
  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return res.status(400).json({ message: "Invalid date format" });
  }
  const iso = parsed.toISOString();

  // look up the user by id from JWT
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) return res.status(404).json({ message: "User not found" });

  const current = asArray(user.alreadyRequested);

  // Support either JSON array of objects OR String[] of JSON-strings
  const duplicate = current.some((v) => {
    if (!v) return false;
    if (typeof v === "string") {
      try {
        return JSON.parse(v)?.id === propertyId;
      } catch {
        return false;
      }
    }
    return v?.id === propertyId;
  });
  if (duplicate) {
    return res
      .status(400)
      .json({ message: "You have already requested viewing for this property" });
  }

  const isScalarStringList = current.length > 0 && typeof current[0] === "string";

  if (isScalarStringList) {
    // alreadyRequested: String[]
    const entry = JSON.stringify({ id: propertyId, date: iso });
    await prisma.user.update({
      where: { id: req.user.id },
      data: { alreadyRequested: { set: [...current, entry] } },
    });
  } else {
    // alreadyRequested: Json? (recommended)
    await prisma.user.update({
      where: { id: req.user.id },
      data: { alreadyRequested: [...current, { id: propertyId, date: iso }] },
    });
  }

  return res.status(200).json({ message: "Viewing booked successfully" });
});

// GET /api/user/allBookings  (token required)
export const getAllBookings = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const bookings = await prisma.user.findUnique({
      where: { email },
      select: { alreadyRequested: true },
    });
    res.status(200).send(bookings);
  } catch (err) {
    throw new Error(err.message);
  }
});


// POST /api/user/removeBooking/:id  (token required)
// POST /api/user/removeBooking/:id  (token required)
export const cancelBooking = asyncHandler(async (req, res) => {
  const propertyId = req.params.id;

  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
  if (!propertyId) {
    return res.status(400).json({ message: "property id is required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { alreadyRequested: true }, // <-- same field used in bookVisit
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const list = Array.isArray(user.alreadyRequested) ? user.alreadyRequested : [];

    const isScalarStringList = list.length > 0 && typeof list[0] === "string";

    let updated;
    if (isScalarStringList) {
      // alreadyRequested: String[] (each item JSON string like {"id": "...", "date": "..."} )
      updated = list.filter((s) => {
        try {
          return String(JSON.parse(s)?.id) !== String(propertyId);
        } catch {
          // keep malformed entries rather than deleting everything
          return true;
        }
      });

      if (updated.length === list.length) {
        return res.status(404).json({ message: "Booking not found" });
      }

      await prisma.user.update({
        where: { id: req.user.id },
        data: { alreadyRequested: { set: updated } },
      });
    } else {
      // alreadyRequested: array of objects { id, date }
      updated = list.filter((v) => String(v?.id) !== String(propertyId));

      if (updated.length === list.length) {
        return res.status(404).json({ message: "Booking not found" });
      }

      await prisma.user.update({
        where: { id: req.user.id },
        data: { alreadyRequested: updated },
      });
    }

    return res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
});

// POST /api/user/toFav/:rid  (token required)
export const Bookmark = asyncHandler(async (req, res) => {
  const { rid } = req.params;
  if (!req.user?.id) return res.status(401).json({ message: "Unauthenticated" });
  if (!rid) return res.status(400).json({ message: "rid is required" });

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) return res.status(404).json({ message: "User not found" });

  const existing = asArray(user.bookmarkedPropertiesID);
  const already = existing.includes(rid);
  const updated = already ? existing.filter((x) => x !== rid) : [...existing, rid];

  // bookmarkedPropertiesID should be String[] -> use set for overwrite
  const result = await prisma.user.update({
    where: { id: req.user.id },
    data: { bookmarkedPropertiesID: { set: updated } },
  });

  return res
    .status(200)
    .json({ message: already ? "Removed from favorites" : "Updated favorites", user: result });
});

// GET /api/user/allFav  (token required)
export const getAllBookmarked = asyncHandler(async (req, res) => {
  if (!req.user?.id) return res.status(401).json({ message: "Unauthenticated" });

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { bookmarkedPropertiesID: true },
  });
  if (!user) return res.status(404).json({ message: "User not found" });

  return res.status(200).json(asArray(user.bookmarkedPropertiesID));
});
