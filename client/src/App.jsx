import { Suspense } from "react";
import "./App.css";
import Website from "./pages/Website";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Properties from "./pages/Properties/Properties"
import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClient, QueryClientProvider } from 'react-query';
import Property from "./pages/Property/Property";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<div> Loading....</div>}>
          <Routes>

            <Route element={<Layout />}>
              <Route path="/" element={<Website />} />

              <Route path="/properties">
                <Route index element={<Properties />} />
                <Route path=":propertyId" element={<Property />} />
              </Route>

              <Route path="/register" element={<Register />} /> 
                 <Route path="/login" element={<Login />} /> 
              </Route>
              
          </Routes>
        </Suspense>
      </BrowserRouter>
      <ToastContainer />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;


//Layout--the header and footer is same for all page for other components stay inside using layout
//react-dom router- for routing  // rafce
//const queryClient=new QueryClient()  instance of client
//  <Route path="/properties" element={<Properties />} />
//git fetch origin
//git checkout -b branch-name origin/branch-name

// <Route path=":propertyId" element={<Property />} />   this route enabled when id is appended at the end of the url --http://localhost:5173/properties/68afa2c566f9aaf04a9b3c2b
