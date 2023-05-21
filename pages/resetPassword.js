import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import TextFieldWrapper from "../components/Input/TextFieldWrapper";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { $axios, $baseURL } from "../components/axios/axios";
import Link from "next/link";
import { CgSpinner } from "react-icons/cg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { resendOTP, reset_password } from "../store/slices/authSlice";

const formValidation = Yup.object().shape({
  email: Yup.string()
    .email("Enter valid Email Address")
    .required("Email is required"),
  newPassword: Yup.string().required("New password is required"),
  otp: Yup.number().required("OTP is required"),
  // confirmPassword: Yup.string()
  //   .required("Confirm password is required")
  //   .when("password", {
  //     is: (val) => (val && val.length > 0 ? true : false),
  //     then: Yup.string().oneOf(
  //       [Yup.ref("password")],
  //       "Both password need to be the same"
  //     ),
  //   }),
});

const resetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();
  const formikRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (router) {
      const query = router.query;
      formikRef.current.setFieldValue("email", query.email);
    }
  }, [router]);

  const verifyResetPassword = async (values) => {
    try {
      const res = await dispatch(reset_password(values));
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
    newPassword: "",
    otp: "",
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen my-auto mx-5 whitespace-nowrap">
        <div className=" border-2 rounded-md border-[#65748B] border-solid border-opacity-25 px-5 py-10 flex flex-col w-[400px]">
          <h2 className="my-2 text-2xl font-black">Reset Password</h2>
          <p className="mb-5 text-[#03045E] font-medium">
            OTP is sent to your registered Email Address
          </p>
          <Formik
            initialValues={initialFormValues}
            validationSchema={formValidation}
            onSubmit={(values) => {
              verifyResetPassword(values);
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
                    value={values.email}
                    onChange={(e) => setFieldValue("email", e.target.value)}
                  />
                  {errors.email ? (
                    <div className="ml-1 text-left text-sm text-red-600">
                      {errors.email}
                    </div>
                  ) : null}
                </div>
                <div className="mb-4">
                  <Field
                    component={TextField}
                    name="newPassword"
                    label="New Password"
                    className="w-full"
                    size="small"
                    type={showPassword ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    onChange={(e) =>
                      setFieldValue("newPassword", e.target.value)
                    }
                  />
                  {errors.newPassword ? (
                    <div className="ml-1 text-left text-sm text-red-600">
                      {errors.newPassword}
                    </div>
                  ) : null}
                </div>
                <div className="mb-4">
                  <Field
                    component={TextField}
                    name="otp"
                    label="OTP"
                    className="w-full"
                    size="small"
                    onChange={(e) => setFieldValue("otp", e.target.value)}
                  />
                  {errors.otp ? (
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
                  className=" bg-[#03045E] hover:bg-[#0e106a] my-2 py-2 font-semibold normal-case rounded-lg"
                  variant="contained"
                >
                  {loading ? (
                    <span className="animate-spin py-1">
                      <CgSpinner size={20} />
                    </span>
                  ) : (
                    "Submit"
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

export default resetPassword;
