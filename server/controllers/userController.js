import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";
import jwt from "jsonwebtoken";


// function to requestviewing for a property
export const RequestViewing = asyncHandler(async (req, res) => {
  const { email, date } = req.body;
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Please log in to book a visit" });
    }
    // Check if the user already requested viewing for the property , checks if any visit in the list matches the given property id.
    const alreadyRequested = user.alreadyRequested && user.alreadyRequested.some(visit => visit.id === id);

    if (alreadyRequested) {
      return res.status(400).json({ message: "You have already requested viewing for this property" });
    }

    await prisma.user.update({
      where: { email },
      data: {
        alreadyRequested
          : { push: { id, date } },
      },
    });

    res.status(200).json({ message: "Viewing booked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Function to get all bookings of a user
export const getAllBookings = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { alreadyRequested: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.alreadyRequested);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Function to cancel a booking
export const cancelBooking = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { alreadyRequested: true },
    });


    const updatedRequests = user.alreadyRequested.filter(visit => visit.id !== id);

    if (updatedRequests.length === user.alreadyRequested.length) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await prisma.user.update({
      where: { email },
      data: { alreadyRequested: updatedRequests },
    });

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//  property in user's favourites
export const Bookmark = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { rid } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
   
    //If the property is already in the user’s bookmarkedPropertiesID array then remove it or add it
       if (user.bookmarkedPropertiesID.includes(rid)) //check fav properties id,here its
        {
      const updateUser = await prisma.user.update({
        where: { email },
        data: {
          bookmarkedPropertiesID: {
            set: user.bookmarkedPropertiesID.filter((id) => id !== rid),
          },
        },
      });

      res.send({ message: "Removed from favorites", user: updateUser });
    } else {
      const updateUser = await prisma.user.update({
        where: { email },
        data: {
          bookmarkedPropertiesID: {
            push: rid,
          },
        },
      });
      res.send({ message: "Updated favorites", user: updateUser });
    }
  } catch (err) {
    throw new Error(err.message);
  }
});


// Get all favorite properties of a user
export const getAllBookmarked = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { bookmarkedPropertiesID: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.bookmarkedPropertiesID);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
