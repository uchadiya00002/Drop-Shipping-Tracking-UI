import React, { useEffect, useRef } from "react";
import { Button, TextField } from "@mui/material";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import TextFieldWrapper from "../components/Input/TextFieldWrapper";
import { useRouter } from "next/router";
import { $axios, $baseURL } from "../components/axios/axios";
import { CgSpinner } from "react-icons/cg";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { resendOTP, verifyUserOTP } from "../store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { signUpUser } from "../store/slices/authSlice";

const formValidation = Yup.object().shape({
  email: Yup.string()
    .email("Enter valid Email Address")
    .required("Email is required"),
  otp: Yup.string().required("OTP is required"),
});

const verifySignup = () => {
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const formikRef = useRef();

  useEffect(() => {
    if (router) {
      const query = router.query;
      if (query.email) {
        const eml = query.email.split(" ");
        let el;
        if (eml.length > 1) {
          el = eml[0] + "+" + eml[1];
        } else {
          el = eml[0];
        }
        formikRef.current.setFieldValue("email", el);
      }
    }
  }, [router]);

  const verifySignUpUser = async (values) => {
    try {
      const res = await dispatch(verifyUserOTP(values));
      if (res) {
        setLoading(true);
        router.push("/signin");
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const resendOtp = async (values) => {
    try {
      const res = await dispatch(resendOTP(values));
      if (res) {
        setOtpSent(true);

        setTimeout(() => {
          setOtpSent(false);
        }, 30000);
        return res;
      }
    } catch (error) {}
  };

  const initialFormValues = {
    email: "",
    otp: "",
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen my-auto mx-5 whitespace-nowrap">
        <div className=" border-2 rounded-md border-[#65748B] border-solid border-opacity-25 px-5 py-10 flex flex-col content-center w-[400px]">
          <h2 className="my-2 text-2xl font-black">Verify User</h2>
          <p className="mb-5 text-[#03045E] font-medium">
            Enter your email address and OTP
          </p>
          <Formik
            initialValues={initialFormValues}
            validationSchema={formValidation}
            onSubmit={(values) => {
              verifySignUpUser(values);
            }}
            innerRef={formikRef}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              setFieldValue,
            }) => (
              <Form>
                <div className="mb-4">
                  <Field
                    name="email"
                    component={TextField}
                    label="Email"
                    className="w-full"
                    size="small"
                    value={values.email}
                    onChange={(e) => setFieldValue("email", e.target.value)}
                  />
                  {errors.email && touched.email ? (
                    <div className="ml-1 text-left text-sm text-red-600">
                      {errors.email}
                    </div>
                  ) : null}
                </div>
                <div className="mb-4">
                  <Field
                    name="otp"
                    component={TextField}
                    label="OTP"
                    className="w-full"
                    size="small"
                    onChange={(e) => setFieldValue("otp", e.target.value)}
                  />
                  {errors.otp && touched.otp ? (
                    <div className="ml-1 text-left text-sm text-red-600">
                      {errors.otp}
                    </div>
                  ) : null}
                </div>

                {!otpSent && (
                  <div
                    className="text-sm flex justify-end mr-1 cursor-pointer text-[#03045E] font-semibold"
                    onClick={() => {
                      resendOtp({ email: values.email });
                    }}
                  >
                    Resend OTP
                  </div>
                )}

                <Button
                  type="submit"
                  fullWidth
                  className=" bg-[#03045E] hover:bg-[#0e106a] my-2 py-2 font-semibold normal-case rounded-lg ml-auto"
                  variant="contained"
                >
                  {loading ? (
                    <span className="animate-spin py-1">
                      <CgSpinner size={20} />
                    </span>
                  ) : (
                    "Verify"
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

export default verifySignup;
