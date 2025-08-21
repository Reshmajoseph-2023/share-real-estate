import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { userRoute } from './route/userRoute.js'
import { propertyRoute } from './route/propertyRoute.js'
import { uploadRoutes } from './route/uploadRoutes.js' 
import { authRoutes } from './route/authRoutes.js' 

//const express =require("express");
//const dotenv=require("dotenv").config();

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors())

// Route mounting
app.use('/api/auth',authRoutes);
app.use('/api/user', userRoute);
app.use('/api/property', propertyRoute);
app.use('/api/upload', uploadRoutes);

// Static files for uploaded images
app.use('/uploads', express.static('uploads'));



// Start server
app.listen(PORT, () => {
  console.log(`server starting on port ${PORT}`)
});
