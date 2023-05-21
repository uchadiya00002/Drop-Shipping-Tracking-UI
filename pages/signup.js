import {
  Button,
  Checkbox,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import * as Yup from "yup";
import Link from "next/link";
import { Formik, Form, Field } from "formik";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { useState } from "react";
import { useRouter } from "next/router";
import { CgSpinner } from "react-icons/cg";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { signUpUser } from "../store/slices/authSlice";

const roles = [
  { name: "Buyer", value: "BUYER" },
  { name: "Supplier", value: "SUPPLIER" },
];
const signup = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(false);
  let formValidation;

  let initialFormValues;

  switch (selectedRole) {
    case "BUYER":
      formValidation = Yup.object().shape({
        firstName: Yup.string().required("First name is required"),
        lastName: Yup.string().required("Last name is required"),
        email: Yup.string()
          .email("Enter valid Email Address")
          .required("Email is required"),
        role: Yup.string().required("Role is required"),
        phoneNumber: Yup.string().required("Phone Number is required"),
        password: Yup.string().required("Password is required"),
        termsAndConditions: Yup.bool().oneOf(
          [true],
          "Accept Terms & Conditions"
        ),
      });

      initialFormValues = {
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        phoneNumber: "",
        password: "",
        termsAndConditions: false,
      };
      break;
    case "SUPPLIER":
      formValidation = Yup.object().shape({
        firstName: Yup.string().required("First name is required"),
        lastName: Yup.string().required("Last name is required"),
        email: Yup.string()
          .email("Enter valid Email Address")
          .required("Email is required"),
        role: Yup.string().required("Role is required"),
        phoneNumber: Yup.string().required("Phone Number is required"),
        supplierId: Yup.string().required("Supplier Id is required"),
        password: Yup.string().required("Password is required"),
        termsAndConditions: Yup.bool().oneOf(
          [true],
          "Accept Terms & Conditions"
        ),
      });

      initialFormValues = {
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        phoneNumber: "",
        supplierId: "",
        password: "",
        termsAndConditions: false,
      };

      break;

    default:
      formValidation = Yup.object().shape({
        firstName: Yup.string().required("First name is required"),
        lastName: Yup.string().required("Last name is required"),
        email: Yup.string()
          .email("Enter valid Email Address")
          .required("Email is required"),
        role: Yup.string().required("Role is required"),
        phoneNumber: Yup.string().required("Phone Number is required"),
        password: Yup.string().required("Password is required"),
        termsAndConditions: Yup.bool().oneOf(
          [true],
          "Accept Terms & Conditions"
        ),
      });

      initialFormValues = {
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        phoneNumber: "",
        password: "",
        termsAndConditions: false,
      };
      break;
  }

  const SignUpUser = async (values) => {
    delete values.termsAndConditions;
    try {
      const res = await dispatch(signUpUser(values));

      if (res) {
        setLoading(true);
        router.push(`/verify?email=${values.email}`);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen py-2 my-auto mx-5 whitespace-nowrap">
        <div className=" border-2 rounded-md border-[#65748B] border-solid border-opacity-25 px-5  pb-4 flex flex-col w-[400px]">
          <h2 className="my-1 text-lg font-black">Create a new account</h2>
          <p className="mb-1 text-xs text-[#03045E] font-medium">
            Use your email to create new account
          </p>
          <Formik
            initialValues={initialFormValues}
            validationSchema={formValidation}
            onSubmit={(values) => {
              SignUpUser(values);
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
                <div className="mb-2">
                  <Field
                    name="firstName"
                    component={TextField}
                    label="First Name"
                    className="w-full"
                    size="small"
                    onChange={(e) => setFieldValue("firstName", e.target.value)}
                  />
                  {errors.firstName ? (
                    <div className="ml-1 text-left text-xs text-red-600">
                      {errors.firstName}
                    </div>
                  ) : null}
                </div>
                <div className="mb-2">
                  <Field
                    component={TextField}
                    name="lastName"
                    label="Last Name"
                    className="w-full"
                    size="small"
                    onChange={(e) => setFieldValue("lastName", e.target.value)}
                  />
                  {errors.lastName ? (
                    <div className="ml-1 text-left text-xs text-red-600">
                      {errors.lastName}
                    </div>
                  ) : null}
                </div>
                <div className="mb-2">
                  <Field
                    component={TextField}
                    name="email"
                    label="Email Address"
                    className="w-full"
                    size="small"
                    onChange={(e) => setFieldValue("email", e.target.value)}
                  />
                  {errors.email ? (
                    <div className="ml-1 text-left text-xs text-red-600">
                      {errors.email}
                    </div>
                  ) : null}
                </div>
                <div className="mb-2">
                  <Field
                    component={TextField}
                    name="phoneNumber"
                    label="Phone Number"
                    className="w-full"
                    size="small"
                    onChange={(e) =>
                      setFieldValue("phoneNumber", e.target.value)
                    }
                  />
                  {errors.phoneNumber ? (
                    <div className="ml-1 text-left text-xs text-red-600">
                      {errors.phoneNumber}
                    </div>
                  ) : null}
                </div>
                <div className="mb-2">
                  <Field
                    select
                    MenuProps={{
                      style: {
                        height: "300px",
                      },
                    }}
                    component={TextField}
                    label="Role"
                    name="role"
                    // label="Country"
                    className="w-full"
                    size="small"
                    // value={values.role || ""}
                    onChange={(e) => {
                      setFieldValue("role", e.target.value);
                      setSelectedRole(e.target.value);
                    }}
                  >
                    {roles.map((rol, idx) => (
                      <MenuItem
                        className=""
                        key={rol?.value}
                        value={rol?.value}
                      >
                        {rol?.name}
                      </MenuItem>
                    ))}
                  </Field>
                  {errors.role ? (
                    <div className="ml-1 text-left text-xs text-red-600">
                      {errors.role}
                    </div>
                  ) : null}
                </div>
                {selectedRole == "SUPPLIER" && (
                  <div className="mb-2">
                    <Field
                      component={TextField}
                      name="supplierId"
                      label="Supplier Id"
                      className="w-full"
                      size="small"
                      onChange={(e) =>
                        setFieldValue("supplierId", e.target.value)
                      }
                    />
                    {errors.supplierId ? (
                      <div className="ml-1 text-left text-xs text-red-600">
                        {errors.supplierId}
                      </div>
                    ) : null}
                  </div>
                )}
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
                    <div className="ml-1 text-left text-xs text-red-600">
                      {errors.password}
                    </div>
                  ) : null}
                </div>
                <div className="text-sm text-[#65748B] my-1 flex items-center">
                  <Checkbox
                    size="small"
                    checked={values.termsAndConditions}
                    onClick={() =>
                      setFieldValue(
                        "termsAndConditions",
                        !values.termsAndConditions
                      )
                    }
                    style={{
                      paddingLeft: 0,
                    }}
                  />
                  I have read the Terms and Conditions
                </div>
                {errors.termsAndConditions ? (
                  <div className="ml-1 text-xs text-left text-red-600">
                    {errors.termsAndConditions}
                  </div>
                ) : null}
                <Button
                  type="submit"
                  className=" bg-[#03045E] hover:bg-[#0e106a] my-2 py-1.5 font-semibold normal-case rounded-md"
                  variant="contained"
                  fullWidth
                >
                  {loading ? (
                    <span className="animate-spin py-1">
                      <CgSpinner size={20} />
                    </span>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
                <p className=" text-[#65748B] text-sm">
                  Have an account?{" "}
                  <Link href="/signin">
                    <a className="text-[#03045E] font-semibold">Sign in</a>
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default signup;
