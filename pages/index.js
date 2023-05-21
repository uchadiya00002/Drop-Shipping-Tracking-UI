import Link from "next/link";
import Head from "next/head";
import Navbar from "../components/UI/Navbar";
import SideSection from "../components/UI/SideSection";
import signup from "./signup";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const usr = JSON.parse(localStorage.getItem("user"));

    if (usr) {
      usr?.role === "SUPPLIER"
        ? router.push("/collaborationRoom")
        : router.push("/home");
    } else {
      router.push("/signin");
    }
  }, [router]);

  return (
    <div className="w-full h-full">
      <Head>
        <title>Erp Portal</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex justify-center items-center h-full my-[25%]">
        <CircularProgress />
      </div>
    </div>
  );
}
