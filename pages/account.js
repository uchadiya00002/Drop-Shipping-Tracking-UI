import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { allCountry } from "../components/axios/axios";
import {
  checkSingleUser,
  setLoading,
  updateAccount,
} from "../store/slices/authSlice";
import { AiOutlineSearch } from "react-icons/ai";
import { getOrganizations } from "../store/slices/orgSlice";
import { toast } from "react-toastify";

const formValidation = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Enter valid Email Address")
    .required("Email is required"),
  phoneNumber: Yup.number().required("Phone Number is required"),
  country: Yup.string().required("Country is required"),
});

const account = () => {
  const hiddenFileInput = useRef(null);
  const formikRef = useRef(null);
  const [userDetails, setUserDetails] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(false);

  const initialFormValues = {
    firstName: "Avinash",
    lastName: "Uchadiya",
    email: "avinashuchadiya786@gmail.com",
    phoneNumber: "6264826150",
    country: "India",
    profilePic: [],
  };

  const handleUpdate = async (values) => {
    setLoading(true);
    try {
      setUserDetails(values);
      toast.success("Account Updated Successfully");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = (event) => {
    hiddenFileInput.current.click();
  };

  const handleDelete = (chipToDelete) => () => {
    const form = formikRef.current;
  };

  return (
    <div className=" bg-[#E5E5E5] flex flex-col px-5 h-full md:h-screen py-2">
      <h2 className="text-xl font-bold mb-1 ">Account</h2>
      <Formik
        initialValues={initialFormValues}
        enableReinitialize
        validationSchema={formValidation}
        innerRef={formikRef}
        onSubmit={(values) => {
          handleUpdate(values);
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
            <div className="flex xs:flex-col w-full h-full ">
              <div className="bg-[white] rounded-lg shadow-sm w-1/3 xs:w-full xs:mb-5 h-72 px-5 py-3 flex flex-col justify-start items-center ">
                {loading ? (
                  <div className="flex justify-center items-center my-40">
                    <CircularProgress />
                  </div>
                ) : (
                  <>
                    <Avatar
                      alt="Profile Picture"
                      //  src={selectedImage?.url}
                      src={selectedImage}
                      className=" w-36 h-36 mb-1 mt-5"
                    />
                    <h2 className="text-2xl font-bold mb-0.5">
                      Avinash Uchadiya
                    </h2>
                    {/* <p className="text-lg font-normal text-[#65748B] mb-0.5">
                      {userDetails?.state && userDetails?.country
                        ? `${userDetails?.state}, ${userDetails?.country}`
                        : "No Data"}
                    </p> */}
                    {/* To upload picture */}
                    <div>
                      <input
                        type="file"
                        className="my-8  mx-5  xs:mx-0 "
                        // value={values.profilePic||{}}
                        ref={hiddenFileInput}
                        style={{ display: "none" }}
                        // onChange={()=>
                        onChange={(e) => {
                          setFieldValue("profilePic", e.target.files[0]);
                          setSelectedImage(
                            URL.createObjectURL(e.target.files[0])
                          );
                        }}
                      />
                    </div>
                    <Button
                      className=" text-[#03045E] hover:text-[#0e106a] py-1.5 mb-0.5 font-semibold normal-case  rounded "
                      variant=""
                      onClick={uploadFile}
                    >
                      Upload picture
                    </Button>
                    {errors.profilePic ? (
                      <div className="ml-1 text-left text-sm text-red-600">
                        {errors.profilePic}
                      </div>
                    ) : null}
                  </>
                )}
              </div>
              <div className="bg-[white] ml-4 xs:mx-0 xs:w-full rounded-lg h-72 shadow-sm w-2/3  px-5 py-2">
                <h2 className="text-xl font-semibold">Profile</h2>
                <p className="text-sm font-normal text-[#65748B] mb-1">
                  The Information can be edited
                </p>
                {loading ? (
                  <div className="flex justify-center items-center my-40">
                    <CircularProgress />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full">
                    <div className="mb-0.25">
                      <label className="text-sm font-medium">First Name</label>
                      <Field
                        name="firstName"
                        component={TextField}
                        // label="First Name"
                        className="w-full"
                        size="small"
                        value={values.firstName || ""}
                        onChange={(e) => {
                          setFieldValue("firstName", e.target.value);
                        }}
                      />
                      {errors.firstName ? (
                        <div className="ml-1 text-left text-sm text-red-600">
                          {errors.firstName}
                        </div>
                      ) : null}
                    </div>

                    <div className="mb-0.25">
                      <label className="text-sm font-medium">Last Name</label>
                      <Field
                        component={TextField}
                        name="lastName"
                        // label="Last Name"
                        className="w-full"
                        size="small"
                        value={values.lastName || ""}
                        onChange={(e) =>
                          setFieldValue("lastName", e.target.value)
                        }
                      />
                      {errors.lastName ? (
                        <div className="ml-1 text-left text-sm text-red-600">
                          {errors.lastName}
                        </div>
                      ) : null}
                    </div>
                    <div className="">
                      <label className="text-sm font-medium">
                        Email Address
                      </label>
                      <Field
                        component={TextField}
                        name="email"
                        // label="Email Address"
                        className="w-full"
                        value={values.email || ""}
                        size="small"
                        onChange={(e) => setFieldValue("email", e.target.value)}
                      />
                      {errors.email ? (
                        <div className="ml-1 text-left text-sm text-red-600">
                          {errors.email}
                        </div>
                      ) : null}
                    </div>
                    <div className="mb-0.25">
                      <label className="text-sm font-medium">
                        Phone Number
                      </label>
                      <Field
                        component={TextField}
                        name="phoneNumber"
                        // label="Phone Number"
                        className="w-full"
                        size="small"
                        value={values.phoneNumber || ""}
                        onChange={(e) =>
                          setFieldValue("phoneNumber", e.target.value)
                        }
                      />
                      {errors.phoneNumber ? (
                        <div className="ml-1 text-left text-sm text-red-600">
                          {errors.phoneNumber}
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}

                <div className="flex flex-col my-3 xs:w-full  ">
                  <Button
                    type="submit"
                    className=" bg-primary-bg hover:bg-primary-bg py-1 xs:w-full xs:ml-0 font-semibold normal-case  rounded ml-auto  "
                    variant="contained"
                  >
                    Save Details
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default account;
