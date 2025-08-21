import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";



export const createProperty = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    address,
    city,
    country,
    image,
    facilities,
  } = req.body;

  const userId = req.user.id;
  //const  {id }=req.params;
  // Check if address already exists
  const existingResidency = await prisma.residency.findFirst({
    where: { address: address.trim() },
  });

  if (existingResidency) {
    if (existingResidency.ownerId === userId) {
      return res.status(409).json({ comment: "Already exists" });
    } else {
      return res.status(409).json({ comment: "Address should be different" });
    }
  }

  // Create property
  const residency = await prisma.residency.create({
    data: {
      title,
      description,
      price: parseInt(price),
      address: address.trim(),
      city,
      country,
      image,
      facilities,
      ownerId: userId,
    },
  });

  res.status(201).json({
    comment: "Property created successfully",
    data: residency,
  });
});

//To get all properties
export const getAllProperties = asyncHandler(async (req, res) => {
  const residencies = await prisma.residency.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
  res.status(200).json({
    message: "Properties fetched successfully",
    count: residencies.length,
    data: residencies,
  });
});

// To get a specific property
export const getProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const residency = await prisma.residency.findUnique({ where: { id } });

  if (!residency) {
    res.status(404).json({ message: "Property you are looking not found" });
    return;
  }

  res.json(residency);
});


const isValidObjectId = (v) => /^[0-9a-fA-F]{24}$/.test(v);

export const updateProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const authUser = req.user;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  const {
    title,
    description,
    price,
    address,
    city,
    country,
    image,
    facilities,
  } = req.body;

  try {
    // 1) Load the property
    const residency = await prisma.residency.findUnique({ where: { id } });
    if (!residency) {
      return res.status(404).json({ message: "Residency not found." });
    }

    // 2) Authorize (admin OR owner)
    const isAdmin = authUser.role === "admin";
    const isOwner = residency.ownerId === authUser.id;
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Not authorized to update this listing." });
    }

    // 3) If address is changing, ensure it’s unique
    if (address && address.trim() !== residency.address) {
      const clash = await prisma.residency.findFirst({
        where: { address: address.trim(), id: { not: id } },
        select: { id: true },
      });
      if (clash) {
        return res.status(409).json({ message: "Address already exists on another listing." });
      }
    }

    // 4) Build update data (skip undefineds)
    const data = {
      title,
      description,
      city,
      country,
      image,
      facilities,
      updatedAt: new Date(),
    };

    if (address) data.address = address.trim();
    if (price !== undefined && price !== null) {
      const p = parseInt(price, 10);
      if (Number.isNaN(p)) return res.status(400).json({ message: "Invalid price" });
      data.price = p;
    }

    // 5) Update by PROPERTY id
    const updated = await prisma.residency.update({ where: { id }, data });

    return res.status(200).json({
      message: "Residency updated successfully",
      data: updated,
    });
  } catch (err) {
    if (err.code === "P2025") {
      // record not found (e.g., id wrong/doesn’t exist anymore)
      return res.status(404).json({ message: "Residency not found for update." });
    }
    if (err.code === "P2002") {
      // unique address collision (extra guard)
      return res.status(409).json({ message: "Address already exists on another listing." });
    }
    console.error("Error updating residency:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});



// Delete a property (Admins only)
export const deleteProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 1) Check if ID format is valid
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    // 2) Check if property exists
    const residency = await prisma.residency.findUnique({
      where: { id },
    });

    if (!residency) {
      return res.status(404).json({ message: "Residency not found" });
    }

    // 3) Delete
    await prisma.residency.delete({
      where: { id },
    });

    res.status(200).json({ message: "Residency deleted successfully" });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Residency not found for deletion." });
    }
    console.error("Error deleting residency:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



// Search properties by title or city
export const searchProperties = async (req, res) => {
  const { q } = req.query;

  try {
    const results = await prisma.residency.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { city: { contains: q, mode: "insensitive" } },
        ],
      },
    });

    res.status(200).json({
      message: "Search completed",
      count: results.length,
      data: results,
    });
  } catch (error) {
    res.status(500).json({ message: "Search failed", error: error.message });
  }
};
