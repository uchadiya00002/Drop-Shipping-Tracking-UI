import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import TextFieldWrapper from "../components/Input/TextFieldWrapper";
import { $axios, $baseURL } from "../components/axios/axios";
import { useRouter } from "next/router";
import { CgSpinner } from "react-icons/cg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { forgot_password } from "../store/slices/authSlice";

const formValidation = Yup.object().shape({
  email: Yup.string()
    .email("Enter valid Email Address")
    .required("Email is required"),
});

const forgotPassword = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const forgotPassword = async (values) => {
    try {
      const res = await dispatch(forgot_password(values));
      if (res) {
        setLoading(true);
        router.push(`/resetPassword?email=${values.email}`);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const initialFormValues = {
    email: "",
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen my-auto mx-5 whitespace-nowrap">
        <div className=" border-2 rounded-md border-[#65748B] border-solid border-opacity-25 px-5 py-10 flex flex-col content-center w-[400px]">
          <h2 className="my-2 text-2xl font-black">Forgot Password</h2>
          <p className="mb-5 text-[#03045E] font-medium">
            Use your registered email to reset password
          </p>
          <Formik
            initialValues={initialFormValues}
            validationSchema={formValidation}
            onSubmit={(values) => {
              forgotPassword(values);
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
              setFieldValue,
              /* and other goodies */
            }) => (
              <Form>
                <div className="mb-4">
                  <Field
                    component={TextField}
                    name="email"
                    label="Email Address"
                    className="w-full"
                    size="small"
                    onChange={(e) => setFieldValue("email", e.target.value)}
                  />
                  {errors.email ? (
                    <div className="ml-1 text-left text-sm text-red-600">
                      {errors.email}
                    </div>
                  ) : null}
                </div>

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

export default forgotPassword;
