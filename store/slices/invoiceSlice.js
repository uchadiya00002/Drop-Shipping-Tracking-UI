import { createSlice } from "@reduxjs/toolkit";
import { $axios, $baseURL } from "../../components/axios/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialState = {
  invoices: {
    data: [],
    count: 0,
  },
  loading: false,
  error: false,
};

const invoiceSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    setInvoices: (state, action) => {
      state.invoices = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

// // export the actions
export const { setLoading, setInvoices } = invoiceSlice.actions;

export const invoiceSelector = (state) => state.invoices.invoices;

export const fetchInvoices = (payload) => async (dispatch, getState) => {
  return await $axios
    .post(`${$baseURL}/invoice/getInvoiceList`, payload)
    .then((res) => {
      const invoices = res?.data?.data;
      dispatch(setInvoices(invoices));
    })
    .catch((error) => {
      dispatch(setError());
    });
};

export const invoiceReport = (payload) => async (dispatch, getState) => {
  return await $axios
    .post(`${$baseURL}/agingReport/agingReportForInvoice`, payload)
    .then((res) => {
      const result = res?.data?.data;

      return result;
    })
    .catch((error) => {
      dispatch(setError());
    });
};

export const deliveryReport = (payload) => async (dispatch, getState) => {
  return await $axios
    .post(`${$baseURL}/agingReport/agingReportForDelivery`, payload)
    .then((res) => {
      const result = res?.data?.data;

      return result;
    })
    .catch((error) => {
      dispatch(setError());
    });
};

export default invoiceSlice.reducer;
