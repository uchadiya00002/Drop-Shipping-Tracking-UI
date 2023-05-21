import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "../../store/slices/authSlice";
import Navbar from "./Navbar";
import SideSection from "./SideSection";
import { getMessaging, onMessage, getToken } from "firebase/messaging";
import firebaseApp from "../../utils/firebase-init";
import { $hasWindow } from "../../utils/http";
import { $axios, $baseURL } from "../axios/axios";

export default function Layout({ ...props }) {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [FCMToken, setToken] = useState("");
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const router = useRouter();
  let isNavActive = true;

  async function sendTokenToServer(token, user) {
    try {
      const userId = user._id;

      const payload = {
        fcmToken: token,
      };
      const res = await $axios.put(
        `${$baseURL}/users/users/setFCM/${userId}`,
        payload
      );
      if (res) {
      }
    } catch (err) {}
  }

  useEffect(() => {
    initFCM({ dispatch }).then((token) => {
      if (token) {
        setToken(token);
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (user && FCMToken) {
      sendTokenToServer(FCMToken, user);
    }
  }, [user, FCMToken]);

  useEffect(() => {
    const usr = JSON.parse(localStorage.getItem("user"));
    setLoggedInUser(usr);
    dispatch(setUser(usr));
  }, []);

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
          {!isNavbarVisible && user && (
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
            {!isNavbarVisible && user && <Navbar />}
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
}

async function initFCM({ dispatch }) {
  if ($hasWindow) {
    const messaging = getMessaging(firebaseApp);

    try {
      const currentToken = await getToken(messaging, {});
      onMessage(messaging, (payload) => {
        // dispatch(getAllNotification());
        // const qId = localStorage.getItem("queryId");
        // if (qId) {
        //   // dispatch(fetchChatDetails(qId));
        // }
        // ...
      });
      return currentToken;
    } catch (error) {}

    onMessage(messaging, (payload) => {
      // dispatch(getAllNotification());
      // ...
    });
  }
}
