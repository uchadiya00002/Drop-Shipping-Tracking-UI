import { CircularProgress } from "@mui/material";
import Link from "../components/UI/Link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, selectUserLoading } from "../store/slices/authSlice";

export function useAuth(ref,clickedOutside) {
    // const {user,loading} = useContext(UserContext)
    const user = useSelector(selectUser)
    const loading = useSelector(selectUserLoading)


    useEffect(() => {
   
    }, [user]);

    const fallBack = loading ? <CircularProgress /> : 
    <div className="flex-grow flex flex-col justify-center -translate-y-12 my-40">
        <p className="flex items-center justify-center mt-10">
            Please 
            <div
                className="bg-[#03045E] py-1 px-4 rounded-md mx-3 text-white font-semibold"  
            >
                <Link href='/signin' className={`text-white`}>
                    Sign in
                </Link>
            </div>
             to continue
        </p>
    </div>

    return {user,fallBack}
}