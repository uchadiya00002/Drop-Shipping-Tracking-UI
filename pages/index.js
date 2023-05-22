import Head from "next/head";

import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { CircularProgress } from "@mui/material";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/signin");
  }, []);

  return (
    <div className="w-full h-full">
      <Head>
        <title>DROP SHIP</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex justify-center items-center h-full my-[25%]">
        <CircularProgress />
      </div>
    </div>
  );
}
