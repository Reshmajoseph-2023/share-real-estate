// import { Suspense } from "react";
// import { useState, useEffect } from 'react';
// import "./App.css";
// import Website from "./pages/Website";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Layout from "./components/Layout/Layout";
// import Properties from "./pages/Properties/Properties"
// import { ReactQueryDevtools } from "react-query/devtools";
// import { QueryClient, QueryClientProvider } from 'react-query';
// import Property from "./pages/Property/Property";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Register from "./pages/Register/Register";
// import Login from "./pages/Login/Login";
// import UserDetailContext from "./context/UserDetailContext";

// function App() {
//   const queryClient = new QueryClient();

//   const [userDetails, setUserDetails] = useState({
//     favourites: [],
//     bookings: [],
//     token: null,
//   });



//   return (
//     <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>

//       <QueryClientProvider client={queryClient}>
//         <BrowserRouter>
//           <Suspense fallback={<div> Loading....</div>}>
//             <Routes>

//               <Route element={<Layout />}>
//                 <Route path="/" element={<Website />} />

//                 <Route path="/properties">
//                   <Route index element={<Properties />} />
//                   <Route path=":propertyId" element={<Property />} />
//                 </Route>
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/register" element={<Register />} />

//               </Route>

//             </Routes>
//           </Suspense>
//         </BrowserRouter>
//         <ToastContainer />
//         <ReactQueryDevtools initialIsOpen={false} />
//       </QueryClientProvider>
//     </UserDetailContext.Provider>

//   );
// }

// export default App;

//
           //       <Route path="/login" element={<Login />} /> 
//Layout--the header and footer is same for all page for other components stay inside using layout
//react-dom router- for routing  // rafce
//const queryClient=new QueryClient()  instance of client
//  <Route path="/properties" element={<Properties />} />
//git fetch origin
//git checkout -b branch-name origin/branch-name

// <Route path=":propertyId" element={<Property />} />   this route enabled when id is appended at the end of the url --http://localhost:5173/properties/68afa2c566f9aaf04a9b3c2b


// src/App.jsx
import { Suspense, useEffect, useState } from "react";
import "./App.css";
import Website from "./pages/Website";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Properties from "./pages/Properties/Properties";
import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClient, QueryClientProvider } from "react-query";
import Property from "./pages/Property/Property";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import UserDetailContext from "./context/UserDetailContext";
import Bookings from "./pages/Bookings/Bookings";

function App() {
  const queryClient = new QueryClient();

  const [userDetails, setUserDetails] = useState({
    favourites: [],
    bookings: [],
    token: null,
    email: null,
  });

  // Hydrate from localStorage on first mount
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      const bookingsStr = localStorage.getItem("bookings"); // Load bookings
      const user = userStr ? JSON.parse(userStr) : null;
      const bookings = bookingsStr ? JSON.parse(bookingsStr) : [];

      setUserDetails((prev) => ({
        ...prev,
        token: token || null,
        email: user?.email || null,
        bookings: bookings || [], // Hydrate bookings
      }));
    } catch (e) {
      console.warn("Failed to hydrate user or bookings", e);
    }
  }, []);

  // Save bookings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("bookings", JSON.stringify(userDetails.bookings));
    } catch (e) {
      console.warn("Failed to save bookings to localStorage", e);
    }
  }, [userDetails.bookings]);

  return (
    <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense fallback={<div>Loading....</div>}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Website />} />
                <Route path="/properties">
                  <Route index element={<Properties />} />
                  <Route path=":propertyId" element={<Property />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/bookings" element={<Bookings />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
        <ToastContainer />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </UserDetailContext.Provider>
  );
}

export default App;