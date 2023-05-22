import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { useState } from "react";
import { useRouter } from "next/router";
import { CgSpinner } from "react-icons/cg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formValidation = Yup.object().shape({
  email: Yup.string().email("Invalid Email").required("Email required"),
  password: Yup.string().required("Password required"),
});

const signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const initialFormValues = {
    email: "",
    password: "",
  };

  return (
    <>
      <div className="flex items-center justify-center  h-screen my-auto mx-5 whitespace-nowrap ">
        <div className="w-[400px] border-2 rounded-md border-[#65748B] border-solid border-opacity-25 px-5 py-10 ">
          <h2 className="my-2 mb-6 text-2xl font-bold">Sign In</h2>
          <Formik
            initialValues={initialFormValues}
            validationSchema={formValidation}
            onSubmit={(values) => {
              router.push("/dashboard");
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
                <div className="mb-2">
                  <Field
                    component={TextField}
                    name="password"
                    label="Password"
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
                    onChange={(e) => setFieldValue("password", e.target.value)}
                  />
                  {errors.password ? (
                    <div className="ml-1 text-left text-sm text-red-600">
                      {errors.password}
                    </div>
                  ) : null}
                </div>
                <Button
                  type="submit"
                  className=" bg-primary-bg hover:bg-primary-bg relative  my-2 py-1.5 font-semibold normal-case rounded-lg"
                  variant="contained"
                  fullWidth
                >
                  {loading ? (
                    <span className="animate-spin py-1">
                      <CgSpinner size={18} />
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>
                <ToastContainer />
              </Form>
            )}
          </Formik>
          {/* <div className="flex justify-between items-start">
            <p className="my-2 text-[#65748B] text-sm">
              Don’t have an account? <br />
              <Link href="/signup">
                <a className="text-[#03045E] font-semibold">Sign up</a>
              </Link>
            </p>
            <p className="my-2 text-[#65748B] text-sm">
              <Link href="/forgotPassword">
                <a className="">Forgot password?</a>
              </Link>
            </p>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default signin;
