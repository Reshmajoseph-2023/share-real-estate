import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
 // <React.StrictMode>
 
  <MantineProvider defaultColorScheme="light">
    <Auth0Provider
      domain="dev-vzvvwlhmjf47re2h.us.auth0.com"
      clientId="KQRZchN49XXZpZfs0WadPUZj0fKInntv"
      authorizationParams={{
        redirect_uri: "http://localhost:5173"
      }}
      audience="http://localhost:8001"
      scope="openid profile email"
    >
      <App />
    </Auth0Provider>
    </MantineProvider>
  //</React.StrictMode>
);

//MantineProvider withGlobalStyles withNormalizeCSS>
//import "@mantine/core/styles.css";  for getting profile option