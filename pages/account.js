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
  IconButton,
  InputAdornment,
  InputLabel,
  inputLabelClasses,
  Menu,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { allCountry } from "../components/axios/axios";
import {
  checkSingleUser,
  selectUser,
  setLoading,
  updateAccount,
} from "../store/slices/authSlice";
import { AiOutlineSearch } from "react-icons/ai";
import { getOrganizations } from "../store/slices/orgSlice";

const formValidation = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Enter valid Email Address")
    .required("Email is required"),
  phoneNumber: Yup.number().required("Phone Number is required"),
  country: Yup.string().required("Country is required"),
  state: Yup.string().required("State is required"),
  // city: Yup.string().required("City is required"),
  // profilePic: Yup.filename().required("State is required"),
});

const companyCode = ["A001"];
const procurrmentGroup = ["AB1", "AB2"];
const plantName = ["BDC India", "MES Global"];
const orgCode = ["P01", "P02"];

const account = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const hiddenFileInput = useRef(null);
  const formikRef = useRef(null);
  const [userDetails, setUserDetails] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentOrg, setCurrentOrg] = useState([]);

  useEffect(async () => {
    if (user) {
      handleCheckUser();
      fetchOrg();
    }
  }, [
    user,
    formikRef,
    setUserDetails,
    setSelectedCountry,
    setSelectedImage,
    setCurrentOrg,
  ]);

  useEffect(() => {
    if (user) {
      fetchOrg();
    }
  }, [user]);

  const initialFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    country: "",
    state: "",
    // city: "",
    companyCodes: [],
    plantNames: [],
    groupCodes: [],
    orgCodes: [],
    profilePic: [],
  };

  const fetchOrg = async () => {
    try {
      const res = await dispatch(getOrganizations());
      if (res) {
        setCurrentOrg(res?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(currentOrg);
  const handleCheckUser = async () => {
    setLoading(true);
    try {
      const form = formikRef.current;
      const payload = { _id: user?._id };
      const res = await dispatch(checkSingleUser(payload));
      if (res) {
        const userInfo = res?.data?.data;
        const newUser = { ...userInfo };
        setUserDetails(userInfo);
        form.setFieldValue("firstName", newUser.firstName);
        form.setFieldValue("lastName", newUser.lastName);
        form.setFieldValue("email", newUser.email);
        form.setFieldValue("phoneNumber", newUser.phoneNumber);
        form.setFieldValue("country", newUser.country);
        form.setFieldValue("state", newUser.state);
        // form.setFieldValue('city', newUser.city);
        form.setFieldValue("profilePic", newUser.profilePic);
        form.setFieldValue("companyCodes", newUser.companyCodes);
        form.setFieldValue("groupCodes", newUser.groupCodes);
        form.setFieldValue("orgCodes", newUser.orgCodes);
        form.setFieldValue("plantNames", newUser.plantNames);
        setSelectedCountry(newUser.country);
        setSelectedImage("");
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (values) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        country,
        state,
        city,
        profilePic,
      } = values;
      const formData = new FormData();
      if (values.profilePic && !values?.profilePic?.url) {
        formData.append("profilePic", values?.profilePic);
        delete values?.profilePic;
      } else if (values?.profilePic) {
        delete values?.profilePic;
      }
      for (let x in values) {
        if (
          x == "plantNames" ||
          x == "companyCodes" ||
          x == "groupCodes" ||
          x == "orgCodes"
        ) {
          formData.append([x], JSON.stringify(values[x]));
        } else {
          formData.append([x], values[x]);
        }
      }
      const res = await dispatch(updateAccount(formData, user._id));
      if (res.data) {
        handleCheckUser();
        fetchOrg();
      }
    } catch (error) {}
  };

  const uploadFile = (event) => {
    hiddenFileInput.current.click();
  };

  const handleDelete = (chipToDelete) => () => {
    const form = formikRef.current;
  };
  handleDelete();

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
              <div className="bg-[white] rounded-lg shadow-sm w-1/3 xs:w-full xs:mb-5 min-h-72 h-fit px-5 py-3 flex flex-col justify-start items-center ">
                {loading ? (
                  <div className="flex justify-center items-center my-40">
                    <CircularProgress />
                  </div>
                ) : (
                  <>
                    <Avatar
                      alt="Profile Picture"
                      //  src={selectedImage?.url}
                      src={
                        !selectedImage == ""
                          ? selectedImage
                          : userDetails?.profilePic?.url
                      }
                      className=" w-36 h-36 mb-1 mt-5"
                    />
                    <h2 className="text-2xl font-bold mb-0.5">
                      {userDetails?.firstName && userDetails?.lastName
                        ? `${userDetails?.firstName} ${userDetails?.lastName}`
                        : "User Name"}
                    </h2>
                    <p className="text-lg font-normal text-[#65748B] mb-0.5">
                      {userDetails?.state && userDetails?.country
                        ? `${userDetails?.state}, ${userDetails?.country}`
                        : "No Data"}
                    </p>
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
              <div className="bg-[white] ml-4 xs:mx-0 xs:w-full rounded-lg shadow-sm w-2/3 h-fit px-5 py-2">
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
                    <div className="mb-0.25">
                      <label className="text-sm font-medium">Country</label>
                      <Select
                        select
                        MenuProps={{
                          style: {
                            height: "300px",
                          },
                        }}
                        name="country"
                        // label="Country"
                        className="w-full"
                        size="small"
                        value={values.country || ""}
                        onChange={(e) => {
                          setFieldValue("country", e.target.value);
                          setSelectedCountry(e.target.value);
                        }}
                      >
                        {allCountry.map((option) => (
                          <MenuItem
                            className=""
                            key={option}
                            value={option?.country_name}
                          >
                            <div>{option?.country_name}</div>
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.country ? (
                        <div className="ml-1 text-left text-sm text-red-600">
                          {errors.country}
                        </div>
                      ) : null}
                    </div>
                    <div className="mb-0.25">
                      <label className="text-sm font-medium">State</label>
                      <Select
                        MenuProps={{
                          style: {
                            height: "300px",
                          },
                        }}
                        name="state"
                        select
                        className="w-full"
                        size="small"
                        value={values.state || ""}
                        onChange={(e) => setFieldValue("state", e.target.value)}
                      >
                        {allCountry
                          .filter(
                            (option) => option?.country_name == selectedCountry
                          )
                          .map((option) =>
                            option?.states.map((val) => (
                              <MenuItem
                                classes={{
                                  selected: { style: { color: "red" } },
                                }}
                                key={val}
                                value={val?.state_name}
                              >
                                {val?.state_name}
                              </MenuItem>
                            ))
                          )}
                      </Select>
                      {errors.state ? (
                        <div className="ml-1 text-left text-sm text-red-600">
                          {errors.state}
                        </div>
                      ) : null}
                    </div>
                    <div className="mb-0.25">
                      <label className="text-sm font-medium">
                        Company Codes
                      </label>
                      <Select
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {selected.map((value) => (
                              <Chip
                                onMouseDown={(event) => {
                                  event.stopPropagation();
                                }}
                                className="bg-light-gray font-semibold"
                                // color="primary"
                                size="small"
                                variant="outlined"
                                key={value}
                                label={value}
                                onDelete={() => {
                                  const res =
                                    formikRef.current.values.companyCodes.filter(
                                      (companyCode) => companyCode !== value
                                    );
                                  formikRef.current.setFieldValue(
                                    "companyCodes",
                                    res
                                  );
                                }}
                              />
                            ))}
                          </Box>
                        )}
                        MenuProps={{
                          style: {
                            height: "300px",
                          },
                        }}
                        name="companyCodes"
                        className="w-full"
                        size="small"
                        multiple={true}
                        value={values.companyCodes || []}
                        onChange={(e) => {
                          setFieldValue("companyCodes", e.target.value);
                        }}
                      >
                        {currentOrg?.data?.length > 0
                          ? currentOrg?.data?.map((val) => (
                              <MenuItem
                                className=""
                                key={val?._id}
                                value={val?.companyCode}
                              >
                                {val?.companyCode}
                              </MenuItem>
                            ))
                          : ""}
                      </Select>
                      {errors.companyCodes ? (
                        <div className="ml-1 text-left text-sm text-red-600">
                          {errors.companyCodes}
                        </div>
                      ) : null}
                    </div>
                    <div className="mb-0.25">
                      <label className="text-sm font-medium">Plant Names</label>
                      <Select
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {selected.map((value) => (
                              <Chip
                                onMouseDown={(event) => {
                                  event.stopPropagation();
                                }}
                                className="bg-light-gray font-semibold"
                                size="small"
                                variant="outlined"
                                key={value}
                                label={value}
                                onDelete={() => {
                                  const res =
                                    formikRef.current.values.plantNames.filter(
                                      (plantName) => plantName !== value
                                    );
                                  formikRef.current.setFieldValue(
                                    "plantNames",
                                    res
                                  );
                                }}
                              />
                            ))}
                          </Box>
                        )}
                        MenuProps={{
                          style: {
                            height: "300px",
                          },
                        }}
                        name="plantNames"
                        multiple={true}
                        className="w-full"
                        size="small"
                        value={values.plantNames || []}
                        onChange={(e) =>
                          setFieldValue("plantNames", e.target.value)
                        }
                      >
                        {currentOrg?.data?.length > 0
                          ? currentOrg?.data?.map((val) => (
                              <MenuItem
                                className=""
                                key={val?._id}
                                value={val?.plantName}
                              >
                                {val?.plantName}
                              </MenuItem>
                            ))
                          : ""}
                      </Select>
                      {errors.plantNames ? (
                        <div className="ml-1 text-left text-sm text-red-600">
                          {errors.plantNames}
                        </div>
                      ) : null}
                    </div>
                    <div className="mb-0.25">
                      <label className="text-sm font-medium">Group Codes</label>
                      <Select
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {selected.map((value) => (
                              <Chip
                                onMouseDown={(event) => {
                                  event.stopPropagation();
                                }}
                                className="bg-light-gray font-semibold"
                                size="small"
                                variant="outlined"
                                key={value}
                                label={value}
                                onDelete={() => {
                                  const res =
                                    formikRef.current.values.groupCodes.filter(
                                      (groupCode) => groupCode !== value
                                    );
                                  formikRef.current.setFieldValue(
                                    "groupCodes",
                                    res
                                  );
                                }}
                              />
                            ))}
                          </Box>
                        )}
                        MenuProps={{
                          style: {
                            height: "300px",
                          },
                        }}
                        name="groupCodes"
                        multiple={true}
                        className="w-full"
                        size="small"
                        value={values.groupCodes || []}
                        onChange={(e) =>
                          setFieldValue("groupCodes", e.target.value)
                        }
                      >
                        {currentOrg?.data?.length > 0
                          ? currentOrg?.data?.map((val) => (
                              <MenuItem
                                className=""
                                key={val?._id}
                                value={val?.groupCode}
                              >
                                {val?.groupCode}
                              </MenuItem>
                            ))
                          : ""}
                      </Select>
                      {errors.groupCodes ? (
                        <div className="ml-1 text-left text-sm text-red-600">
                          {errors.groupCodes}
                        </div>
                      ) : null}
                    </div>

                    <div className="  ">
                      <label className="text-sm font-medium">Org Codes</label>
                      <Select
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {selected.map((value) => (
                              <Chip
                                onMouseDown={(event) => {
                                  event.stopPropagation();
                                }}
                                className="bg-light-gray font-semibold"
                                size="small"
                                variant="outlined"
                                key={value}
                                label={value}
                                onDelete={() => {
                                  const res =
                                    formikRef.current.values.orgCodes.filter(
                                      (orgCode) => orgCode !== value
                                    );
                                  formikRef.current.setFieldValue(
                                    "orgCodes",
                                    res
                                  );
                                }}
                              />
                            ))}
                          </Box>
                        )}
                        MenuProps={{
                          style: {
                            minHeight: "500px",
                            height: "300px",
                          },
                        }}
                        name="orgCodes"
                        // label="orgCodes"
                        // placeholder="orgCodes"
                        multiple={true}
                        className="w-full"
                        size="small"
                        value={values.orgCodes || []}
                        onChange={(e) =>
                          setFieldValue("orgCodes", e.target.value)
                        }
                      >
                        {currentOrg?.data?.length > 0
                          ? currentOrg?.data?.map((val) => (
                              <MenuItem
                                className=""
                                key={val?._id}
                                value={val?.orgCode}
                              >
                                {val?.orgCode}
                              </MenuItem>
                            ))
                          : ""}
                      </Select>
                      {errors.orgCodes ? (
                        <div className="ml-1 text-left text-sm text-red-600">
                          {errors.orgCodes}
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}

                <div className="flex flex-col my-3 xs:w-full  ">
                  <Button
                    type="submit"
                    className=" bg-[#03045E] hover:bg-[#0e106a] py-1 xs:w-full xs:ml-0 font-semibold normal-case  rounded ml-auto  "
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
