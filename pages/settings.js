import {
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { VisibilityOff, Visibility, Notifications } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  checkSingleUser,
  selectUser,
  setLoading,
  updateAccount,
  updatePassword,
} from "../store/slices/authSlice";

const formValidation = Yup.object().shape({
  oldPassword: Yup.string().required("Password is required"),
  newPassword: Yup.string().required("New Password is required"),
});

const settings = () => {
  const formikRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState("");
  const [receiveMails, setReceiveEmails] = useState(null);
  const [receiveNotifications, setReceiveNotifications] = useState(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const user = useSelector(selectUser);
  useEffect(() => {
    if (user) {
      handleCheckUser();
    }
  }, [user]);

  const handleUpdatePassword = async (values, fn) => {
    try {
      const { oldPassword, newPassword } = values;

      const payload = { _id: user?._id, oldPassword, newPassword };
      const res = await dispatch(updatePassword(payload));
      if (res) {
        const form = formikRef.current;
        form.resetForm({ values: "" });
      }
    } catch (error) {}
  };

  const handleCheckUser = async () => {
    setLoading(true);
    try {
      const payload = { _id: user?._id };
      const res = await dispatch(checkSingleUser(payload));
      if (res) {
        const userInfo = res?.data?.data;
        setReceiveEmails(userInfo.receiveMails);
        setReceiveNotifications(userInfo.receiveNotifications);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (values) => {
    try {
      let payload = {};

      if (values.receiveMails || !values.receiveMails) {
        payload.receiveMails = values.receiveMails;
      }

      if (values.receiveNotifications || !values.receiveNotifications) {
        payload.receiveNotifications = values.receiveNotifications;
      }
      const res = await dispatch(updateAccount(payload, user._id));
      if (res.data) {
        handleCheckUser();
      }
    } catch (error) {}
  };

  const initialFormValues = {
    oldPassword: "",
    newPassword: "",
  };

  return (
    <div className=" bg-[#E5E5E5] flex flex-col px-5  h-full md:h-screen xs:h-screen py-3  ">
      <h2 className="text-2xl font-bold">Settings</h2>
      <div className="flex w=full flex-col ">
        <div className="bg-[white] rounded-lg shadow-sm w-full my-4 px-4">
          {loading ? (
            <div className="flex justify-center items-center my-16">
              <CircularProgress />
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold mt-2">Notifications</h2>
              <p className="text-base font-normal text-[#65748B] my-1">
                Manage the notifications
              </p>

              <div className="flex flex-row">
                <div className="flex flex-col mr-16">
                  <div className="mb-1">
                    <label>
                      <Checkbox
                        className="mr-3 "
                        color="primary"
                        size="small"
                        checked={receiveMails}
                        onClick={() => {
                          setReceiveEmails(!receiveMails);
                        }}
                      />
                      Email
                    </label>
                  </div>

                  <div>
                    <label>
                      <Checkbox
                        className="mr-3 "
                        color="primary"
                        size="small"
                        checked={receiveNotifications}
                        onClick={() => {
                          setReceiveNotifications(!receiveNotifications);
                        }}
                      />
                      Push Notifications
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex flex-col pt-1 pb-2  ">
                <Button
                  className=" bg-[#03045E] hover:bg-[#0e106a] py-1 font-semibold normal-case  rounded ml-auto  "
                  variant="contained"
                  onClick={() =>
                    handleUpdate({
                      receiveMails: receiveMails,
                      receiveNotifications: receiveNotifications,
                    })
                  }
                >
                  Save
                </Button>
              </div>
            </>
          )}
        </div>
        <div className="bg-[white]  rounded-lg shadow-sm w-full px-4">
          <div className="mb-5">
            <h2 className="text-xl font-semibold mt-2">Password</h2>
            <p className="text-base font-normal text-[#65748B] my-1">
              Update password
            </p>
          </div>
          <Formik
            initialValues={initialFormValues}
            validationSchema={formValidation}
            innerRef={formikRef}
            enableReinitialize
            onSubmit={(values, { resetForm }) => {
              handleUpdatePassword(values);
            }}
          >
            {({
              values,
              resetForm,
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
                <div className="flex flex-col ">
                  <div className="mb-4">
                    <Field
                      component={TextField}
                      name="oldPassword"
                      label="Password"
                      className="w-96 xs:w-full"
                      autoComplete="off"
                      size="small"
                      type={showPassword ? "text" : "password"}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="Toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      value={values.oldPassword || ""}
                      onChange={(e) =>
                        setFieldValue("oldPassword", e.target.value)
                      }
                    />
                    {errors.oldPassword ? (
                      <div className="ml-1 text-left text-sm text-red-600">
                        {errors.oldPassword}
                      </div>
                    ) : null}
                  </div>
                  <div className="mb-4">
                    <Field
                      component={TextField}
                      name="newPassword"
                      label="New Password"
                      className="w-96  xs:w-full"
                      size="small"
                      autoComplete="off"
                      type={showNewPassword ? "text" : "password"}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="Toggle password visibility"
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                            >
                              {showNewPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      value={values.newPassword || ""}
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
                  <div className="flex flex-col pt-1 pb-2 xs:w-full  ">
                    <Button
                      className=" bg-[#03045E] hover:bg-[#0e106a] py-1 xs:w-full font-semibold normal-case  rounded ml-auto  "
                      variant="contained"
                      type="submit"
                    >
                      Confirm
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default settings;
