import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./Navbar";
import SideSection from "./SideSection";
import { getMessaging, onMessage, getToken } from "firebase/messaging";
import firebaseApp from "../../utils/firebase-init";
import { $hasWindow } from "../../utils/http";
import { $axios, $baseURL } from "../axios/axios";

export default function Layout({ ...props }) {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [FCMToken, setToken] = useState("");
  const router = useRouter();
  let isNavActive = true;

  const currentRoutes = [
    "/",
    "/signin",
    "/signup",
    "/verify",
    "/forgotPassword",
    "/resetPassword",
    "/resendOtp",
  ];

  const isNavbarVisible = currentRoutes.includes(router.pathname);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="relative font-roboto">
      <div id="main-column">
        <div className={`flex `}>
          {!isNavbarVisible && (
            <SideSection
              drawerOpen={drawerOpen}
              setDrawerOpen={setDrawerOpen}
            />
          )}

          {/* ${!isNavActive ? "w-[50%] " : "w-[90%]"} */}
          <div
            className={`flex flex-col xs:ml-0 flex-1 z-[4] duration-100
            
            ${drawerOpen ? "drawer-open" : "drawer-close"}
            
             `}
          >
            {!isNavbarVisible && <Navbar />}
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
}
