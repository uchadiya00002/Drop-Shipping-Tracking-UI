import "../styles/globals.css";
import { $axios } from "../components/axios/axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import Layout from "../components/UI/Layout";
import { StyledEngineProvider } from "@mui/material";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>DROP SHIP</title>
      </Head>
      {/* <Provider store={store}> */}
      <StyledEngineProvider injectFirst>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </StyledEngineProvider>
      {/* </Provider> */}
      <ToastContainer />
    </>
  );
}
