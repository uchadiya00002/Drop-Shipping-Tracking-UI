import { useRouter } from "next/router";
import { useState } from "react";
import Navbar from "./Navbar";
import SideSection from "./SideSection";

export default function Layout({ ...props }) {
  const router = useRouter();

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
