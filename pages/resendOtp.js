import React from "react";
import { Button } from "@mui/material";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import TextFieldWrapper from "../components/Input/TextFieldWrapper";
import { $axios, $baseURL } from "../components/axios/axios";
import { useRouter } from "next/router";
import { CgSpinner } from "react-icons/cg";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { resendOTP } from "../store/slices/authSlice";

const FORM_VALIDATION = Yup.object().shape({
  email: Yup.string()
    .email("Enter valid Email Address")
    .required("Email is required"),
});

const resentOtp = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const router = useRouter();

  const resentOtpToResetPassword = (values) => {
    const { email } = values;

    try {
      const res = dispatch(resendOTP(values));

      if (res) {
        setLoading(true);
        router.push("/resetPassword");
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const INITIAL_FORM_VALUES = {
    email: "",
  };

  return (
    <>
      <Head>
        <title>Resend OTP</title>
      </Head>
      <div className="flex items-center justify-center h-screen my-auto mx-5 whitespace-nowrap">
        <div className=" border-2 rounded-md border-[#65748B] border-solid border-opacity-25 px-5 py-10 flex flex-col content-center w-[450px]">
          <h2 className="my-2 text-2xl font-black">Resend OTP</h2>
          <p className="mb-5 text-[#03045E] font-medium">
            Use your registered email to reset password
          </p>
          <Formik
            initialValues={{ ...INITIAL_FORM_VALUES }}
            validationSchema={FORM_VALIDATION}
            onSubmit={(values) => {
              resendOTP(values);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              /* and other goodies */
            }) => (
              <Form>
                <TextFieldWrapper
                  name="email"
                  label="Email Address"
                  className="mb-5"
                />

                <Button
                  type="submit"
                  fullWidth
                  className=" bg-[#03045E] hover:bg-[#0e106a] my-2 py-2 font-semibold normal-case rounded-lg ml-auto"
                  variant="contained"
                  onClick={() => resentOtpToResetPassword(values)}
                >
                  {loading ? (
                    <span className="animate-spin py-1">
                      <CgSpinner size={20} />
                    </span>
                  ) : (
                    "Send Email"
                  )}
                </Button>
                <ToastContainer />
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default resentOtp;
