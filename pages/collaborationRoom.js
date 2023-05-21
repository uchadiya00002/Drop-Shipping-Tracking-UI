import React, { useEffect } from "react";
import { useAuth } from "../utils/hooks";
import { $windowExists } from "../utils";
import CollabTableForBuyer from "../components/Tables/CollabTableForBuyer";
import CollabTableForSupplier from "../components/Tables/CollabTableForSupplier";

const collaborationRoom = () => {
  const { user, fallBack } = useAuth();

  useEffect(() => {
    if (user) {
    }
  }, [user]);

  if (!$windowExists) {
    return fallBack;
  } else if (!user) {
    // router.push('/')
    return fallBack;
  }
  return (
    <div
      className="w-full bg-[#E5E5E5] flex flex-col grow z-[5] px-5"
      // style={{ minHeight: "calc(100vh - 64px)" }}
    >
      <div className="flex py-3 bg-[#E5E5E5] w-full  z-[5] drawer-open reduce-wid xs:static drawer-close smooth   fixed ">
        <h1 className="text-xl font-bold xs:w-full">Collaboration Room</h1>
      </div>
      <>
        <CollabTableForBuyer />
      </>
    </div>
  );
};

export default collaborationRoom;
