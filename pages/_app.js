import "../styles/globals.css";
import { $axios } from "../components/axios/axios";
import { store } from "../store/store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import Layout from "../components/UI/Layout";
import { StyledEngineProvider } from "@mui/material";
import { useEffect, useState } from "react";
import firebase from "firebase/app";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>ERP</title>
      </Head>
      <Provider store={store}>
        <StyledEngineProvider injectFirst>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </StyledEngineProvider>
      </Provider>
      <ToastContainer />
    </>
  );
}

$axios.interceptors.response.use(
  (res) => res,

  (error) => {
    const resp = error.response;
    const status = resp && resp.status;
    return Promise.reject({ ...error, response: resp });
    // if (error.response && error.response.status === 401)
    // {
    //   store.dispatch(logout())

    //   const data = error.response.data || {}
    //   let message = data.message
    //   if(!message || message !== 'Invalid credentials'){
    //     message = "User doesn't exist or is deleted"
    //   }
    //   error.response.data= {...data,message}
    //   // location.reload();
    //   return Promise.reject({...error,status:401});
    // }
    // return Promise.reject(error);
  }
);
