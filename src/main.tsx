// import React from "react";
// import ReactDOM from "react-dom/client";
// import { ClerkProvider } from "@clerk/clerk-react";
// import { BrowserRouter } from "react-router-dom";
// import App from "./App";
// import "./index.css";

// const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// // src/main.tsx
// console.log(
//   "MODE:",
//   import.meta.env.MODE,
//   "CLERK KEY:",
//   import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
// );

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <ClerkProvider
//       publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string}
//       tokenCache={{ template: "aws" }} // auto‑memoise the JWT
//     >
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </ClerkProvider>
//   </React.StrictMode>
// );

// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

/* ------------------------------------------------------------------ */
/* 1.  Read the publishable key from Vite env and fail fast if empty. */
/* ------------------------------------------------------------------ */
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as
  | string
  | undefined;

if (!clerkPubKey) {
  throw new Error(
    "❌  VITE_CLERK_PUBLISHABLE_KEY is missing. " +
      "Add it to your .env.local or .env file."
  );
}

/* ------------------------------------------------------------------ */
/* 2.  Grab #root safely.                                              */
/* ------------------------------------------------------------------ */
const rootElem = document.getElementById("root");

if (!rootElem) {
  throw new Error('❌  Could not find <div id="root" /> in index.html');
}

/* ------------------------------------------------------------------ */
/* 3.  Boot the React tree.                                            */
/* ------------------------------------------------------------------ */
ReactDOM.createRoot(rootElem).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);

/* Optional: helpful console ping while developing */
if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.log("🟢 Dev mode – Clerk key:", clerkPubKey);
}
