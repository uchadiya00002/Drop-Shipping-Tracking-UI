import {
  Autocomplete,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import {
  addInfoRecord,
  editInfoRecord,
  fetchSupplierItems,
  fetchSuppliersForInfoRecord,
} from "../../store/slices/infoRecordSlice";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Info } from "@mui/icons-material";
import ToolTip from "../UI/Tooltip";

const formValidation = Yup.object().shape({
  supplierName: Yup.string().required("Supplier Name is required").nullable(),
  materialNumber: Yup.string()
    .required("Material Number is required")
    .nullable(),
  deliveryLeadTime: Yup.string().required("Delivery Lead Time is required"),
  followUpStart: Yup.string().required("Followup start is required"),
  followUpFrequency: Yup.string().required("Followup frequency is required"),
  supplierContactEmail: Yup.string()
    .email("Enter valid Email Address")
    .required("Supplier Email is required")
    .notOneOf(
      [Yup.ref("buyerContactEmail")],
      "Supplier and Buyer email can't be same"
    ),
  buyerContactEmail: Yup.string()
    .email("Enter valid Email Address")
    .required("Buyer Email is required")
    .notOneOf(
      [Yup.ref("supplierContactEmail")],
      "Supplier and Buyer email can't be same"
    ),
  supplierEscalationEmail: Yup.string().email("Enter valid Email Address"),
  buyerEscalationEmail: Yup.string().email("Enter valid Email Address"),
  apContactEmail: Yup.string().email("Enter valid Email Address"),
  qualityContactEmail: Yup.string().email("Enter valid Email Address"),
});

function AddInfoRecord({ onCancel, onSubmit, selectedRecord }) {
  const [saving, setSaving] = useState(true);
  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);
  const dispatch = useDispatch();
  const formRef = useRef();

  useEffect(() => {
    getSuppliers();
  }, []);

  const getSuppliers = async () => {
    try {
      let results = await dispatch(fetchSuppliersForInfoRecord());
      setSuppliers(results?.data?.map((s) => s?.supplierName));
    } catch (error) {}
  };

  const getSupplierItems = async (value) => {
    try {
      let payload = {
        conditions: {
          supplierName: value,
        },
      };
      let results = await dispatch(fetchSupplierItems(payload));

      setItems(results?.data?.map((item) => item?.itemNo));
    } catch (error) {}
  };

  const initialValues = {
    supplierName: selectedRecord ? selectedRecord.supplierName : null,
    materialNumber: selectedRecord ? selectedRecord.materialNumber : null,
    deliveryLeadTime: selectedRecord ? selectedRecord.deliveryLeadTime : "",
    followUpStart: selectedRecord ? selectedRecord.followUpStart : "",
    followUpFrequency: selectedRecord ? selectedRecord.followUpFrequency : "",
    supplierContactEmail: selectedRecord
      ? selectedRecord.supplierContactEmail
      : "",
    buyerContactEmail: selectedRecord ? selectedRecord.buyerContactEmail : "",
    supplierEscalationEmail: selectedRecord
      ? selectedRecord.supplierEscalationEmail
      : "",
    buyerEscalationEmail: selectedRecord
      ? selectedRecord.buyerEscalationEmail
      : "",
    apContactEmail: selectedRecord ? selectedRecord.apContactEmail : "",
    qualityContactEmail: selectedRecord
      ? selectedRecord.qualityContactEmail
      : "",
  };

  const addRecord = async (values) => {
    setSaving(true);
    try {
      let payload = { ...values };

      const res = await dispatch(addInfoRecord(payload));
      if (res) {
        onSubmit();
      }
    } catch (error) {
    } finally {
      setSaving(false);
    }
  };

  const editRecord = async (values) => {
    setSaving(true);
    try {
      let payload = { ...values };
      payload.materialNumber = selectedRecord.materialNumber;

      const res = await dispatch(editInfoRecord(payload));
      if (res) {
        onSubmit();
      }
    } catch (error) {
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className=" ">
      <DialogTitle className="lg:py-1.5">
        <div className="font-semibold text-xl ">
          {selectedRecord ? "Edit" : "Add"} Info Record
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="">
          <Formik
            initialValues={initialValues}
            validationSchema={formValidation}
            onSubmit={(values) => {
              if (selectedRecord) {
                editRecord(values);
              } else {
                addRecord(values);
              }
            }}
            innerRef={formRef}
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
                <div className=" grid grid-cols-2 gap-y-1 lg:gap-y-0.5 gap-x-6">
                  <div className="mb-1.5 lg:mb-0">
                    <label className="text-sm lg:text-xs font-medium">
                      Supplier Name*
                    </label>

                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      size="small"
                      options={suppliers}
                      value={values.supplierName}
                      sx={{ width: 256 }}
                      onChange={(e, value) => {
                        if (value) {
                          setFieldValue("supplierName", value);
                          setFieldValue("materialNumber", null);
                          getSupplierItems(value);
                        } else {
                          setFieldValue("supplierName", null);
                          setFieldValue("materialNumber", null);
                        }
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                    {errors.supplierName && touched.supplierName && (
                      <p className="text-red-500 pl-1 pt-1">
                        {errors.supplierName}
                      </p>
                    )}
                  </div>
                  <div className="mb-1.5 lg:mb-0">
                    <label className="text-sm lg:text-xs font-medium">
                      Material Number*
                    </label>

                    <Autocomplete
                      disabled={!values.supplierName}
                      id="combo-box-demo"
                      size="small"
                      options={items}
                      value={values.materialNumber}
                      sx={{ width: 256 }}
                      onChange={(e, value) => {
                        setFieldValue("materialNumber", value);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                    {errors.materialNumber && touched.materialNumber && (
                      <p className="text-red-500 pl-1 pt-1">
                        {errors.materialNumber}
                      </p>
                    )}
                  </div>
                  <div className="mb-1.5  ">
                    <div className=" lg:mb-0">
                      <label className="text-sm lg:text-xs font-medium">
                        Delivery Lead Time (days)*
                      </label>
                      <ToolTip title="Leadtime = No of days interval between PO and Goods Receipt.">
                        <Info
                          className="text-orange-500 ml-auto mr-2"
                          fontSize="12"
                        />
                      </ToolTip>
                    </div>
                    <Field
                      component={TextField}
                      name="deliveryLeadTime"
                      className="w-64 mt-0.5 mr-1 whitespace-nowrap"
                      size="small"
                      value={values.deliveryLeadTime}
                      onChange={(e) =>
                        setFieldValue("deliveryLeadTime", e.target.value)
                      }
                    />
                    {errors.deliveryLeadTime && touched.deliveryLeadTime && (
                      <p className="text-red-500 pl-1 pt-1">
                        {errors.deliveryLeadTime}
                      </p>
                    )}
                  </div>
                  <div className="mb-1.5">
                    <div className=" lg:mb-0">
                      <label className="text-sm lg:text-xs font-medium">
                        Follow Up Start Day*
                      </label>
                      <ToolTip title="When the first follow up will start prior to Lead time.">
                        <Info
                          className="text-orange-500 ml-auto mr-2"
                          fontSize="12"
                        />
                      </ToolTip>
                    </div>
                    <Field
                      component={TextField}
                      name="followUpStart"
                      className="w-64 mt-0.5 mr-1"
                      size="small"
                      value={values.followUpStart}
                      onChange={(e) =>
                        setFieldValue("followUpStart", e.target.value)
                      }
                    />
                    {errors.followUpStart && touched.followUpStart && (
                      <p className="text-red-500 pl-1 pt-1">
                        {errors.followUpStart}
                      </p>
                    )}
                  </div>
                  <div className="mb-1.5">
                    <div className=" lg:mb-0">
                      <label className="text-sm lg:text-xs font-medium">
                        Follow Up Frequency*
                      </label>
                      <ToolTip
                        title="Number of times follow up mails will be sent before the Lead

                                time and Follow up start Date."
                      >
                        <Info
                          className="text-orange-500 ml-auto mr-2"
                          fontSize="12"
                        />
                      </ToolTip>
                    </div>
                    <Field
                      component={TextField}
                      name="followUpFrequency"
                      className="w-64 mt-0.5 mr-1"
                      size="small"
                      value={values.followUpFrequency}
                      onChange={(e) =>
                        setFieldValue("followUpFrequency", e.target.value)
                      }
                    />
                    {errors.followUpFrequency && touched.followUpFrequency && (
                      <p className="text-red-500 pl-1 pt-1">
                        {errors.followUpFrequency}
                      </p>
                    )}
                  </div>
                  <div className="mb-1.5 lg:mb-0">
                    <label className="text-sm lg:text-xs font-medium">
                      Supplier Contact (Email)*
                    </label>
                    <Field
                      component={TextField}
                      name="supplierContactEmail"
                      className="w-64 mt-0.5"
                      size="small"
                      value={values.supplierContactEmail}
                      onChange={(e) =>
                        setFieldValue("supplierContactEmail", e.target.value)
                      }
                    />
                    {errors.supplierContactEmail &&
                      touched.supplierContactEmail && (
                        <p className="text-red-500 pl-1 pt-1">
                          {errors.supplierContactEmail}
                        </p>
                      )}
                  </div>
                  <div className="mb-1.5 lg:mb-0">
                    <label className="text-sm lg:text-xs font-medium">
                      Buyer Contact (Email)*
                    </label>
                    <Field
                      component={TextField}
                      name="buyerContactEmail"
                      className="w-64 mt-0.5"
                      size="small"
                      value={values.buyerContactEmail}
                      onChange={(e) =>
                        setFieldValue("buyerContactEmail", e.target.value)
                      }
                    />
                    {errors.buyerContactEmail && touched.buyerContactEmail && (
                      <p className="text-red-500 pl-1 pt-1">
                        {errors.buyerContactEmail}
                      </p>
                    )}
                  </div>
                  <div className="mb-1.5 lg:mb-0">
                    <label className="text-sm lg:text-xs font-medium">
                      Supplier escalation (Email)
                    </label>
                    <Field
                      component={TextField}
                      name="supplierEscalationEmail"
                      className="w-64 mt-0.5"
                      size="small"
                      value={values.supplierEscalationEmail}
                      onChange={(e) =>
                        setFieldValue("supplierEscalationEmail", e.target.value)
                      }
                    />
                    {errors.supplierEscalationEmail &&
                      touched.supplierEscalationEmail && (
                        <p className="text-red-500 pl-1 pt-1">
                          {errors.buyerContactEmail}
                        </p>
                      )}
                  </div>
                  <div className="mb-1.5 lg:mb-0">
                    <label className="text-sm lg:text-xs font-medium">
                      Buyer escalation (Email)
                    </label>
                    <Field
                      component={TextField}
                      name="buyerEscalationEmail"
                      className="w-64 mt-0.5"
                      size="small"
                      value={values.buyerEscalationEmail}
                      onChange={(e) =>
                        setFieldValue("buyerEscalationEmail", e.target.value)
                      }
                    />
                    {errors.buyerEscalationEmail &&
                      touched.buyerEscalationEmail && (
                        <p className="text-red-500 pl-1 pt-1">
                          {errors.buyerContactEmail}
                        </p>
                      )}
                  </div>
                  <div className="mb-1.5 lg:mb-0">
                    <label className="text-sm lg:text-xs font-medium">
                      AP contact (Email)
                    </label>
                    <Field
                      component={TextField}
                      name="apContactEmail"
                      className="w-64 mt-0.5"
                      size="small"
                      value={values.apContactEmail}
                      onChange={(e) =>
                        setFieldValue("apContactEmail", e.target.value)
                      }
                    />
                    {errors.apContactEmail && touched.apContactEmail && (
                      <p className="text-red-500 pl-1 pt-1">
                        {errors.buyerContactEmail}
                      </p>
                    )}
                  </div>
                  <div className="mb-1.5 lg:mb-0">
                    <label className="text-sm lg:text-xs font-medium ">
                      Quality contact (Email)
                    </label>
                    <Field
                      component={TextField}
                      name="qualityContactEmail"
                      className="w-64 mt-0.5"
                      size="small"
                      value={values.qualityContactEmail}
                      onChange={(e) =>
                        setFieldValue("qualityContactEmail", e.target.value)
                      }
                    />
                    {errors.qualityContactEmail &&
                      touched.qualityContactEmail && (
                        <p className="text-red-500 pl-1 pt-1">
                          {errors.buyerContactEmail}
                        </p>
                      )}
                  </div>
                </div>
                <div>
                  <DialogActions>
                    <div
                      className="text-[#979797] mr-4 lg:text-xs cursor-pointer"
                      onClick={onCancel}
                    >
                      Cancel
                    </div>
                    <div>
                      <Button
                        style={{
                          background: "#03045E",
                          color: "white",
                          fontWeight: "400",
                        }}
                        className="lg:text-xs"
                        type="submit"
                      >
                        {selectedRecord ? "Edit" : "Add"}
                      </Button>
                    </div>
                  </DialogActions>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </DialogContent>
    </div>
  );
}

export default AddInfoRecord;
