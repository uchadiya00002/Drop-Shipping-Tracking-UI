import { createSlice } from "@reduxjs/toolkit";
import { $axios, $baseURL } from "../../components/axios/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialState = {
  infoRecords: {
    data: [],
    count: 0,
  },
  loading: false,
  error: false,
};

const infoRecordSlice = createSlice({
  name: "infoRecords",
  initialState,
  reducers: {
    setInfoRecords: (state, action) => {
      state.infoRecords = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

// // export the actions
export const { setLoading, setInfoRecords } = infoRecordSlice.actions;

export const infoRecordSelector = (state) => state.infoRecords.infoRecords;

export const fetchInfoRecords = (payload) => async (dispatch, getState) => {
  return await $axios
    .post(`${$baseURL}/infoRecord/getInfoRecordList`, payload)
    .then((res) => {
      const infoRecords = res?.data?.data;

      dispatch(setInfoRecords(infoRecords));
    })
    .catch((error) => {
      dispatch(setError());
    });
};

export const fetchSuppliersForInfoRecord =
  (payload) => async (dispatch, getState) => {
    return await $axios
      .post(`${$baseURL}/purchaseOrder/getSupplierList`, payload)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        dispatch(setError());
      });
  };

export const fetchSupplierItems = (payload) => async (dispatch, getState) => {
  return await $axios
    .post(`${$baseURL}/purchaseItem/getSupplierItems`, payload)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      dispatch(setError());
    });
};

export const updatePurchaseOrder = (payload) => async (dispatch, getState) => {
  try {
    const { poNumber, criticalParts } = payload;

    const res = await $axios.put(
      `${$baseURL}/purchaseOrder/updatePurchaseOrder/${poNumber}`,

      criticalParts
    );

    toast.success(res?.data.message);

    return res;
  } catch (error) {
    toast.error(error?.response?.data?.message);

    //
  }
};

export const addInfoRecord = (payload) => async (dispatch, getState) => {
  try {
    const res = await $axios.post(
      `${$baseURL}/infoRecord/createInfoRecord`,
      payload
    );

    toast.success(res?.data.message);

    return res;
  } catch (error) {
    toast.error(error?.response?.data?.message);

    //
  }
};

export const editInfoRecord = (payload) => async (dispatch, getState) => {
  try {
    const { materialNumber } = payload;
    delete payload.materialNumber;
    const res = await $axios.put(
      `${$baseURL}/infoRecord/updateInfoRecord/${materialNumber}`,
      payload
    );

    toast.success(res?.data.message);

    return res;
  } catch (error) {
    toast.error(error?.response?.data?.message);

    //
  }
};
export const markForPaymentInfoRecord =
  (payload) => async (dispatch, getState) => {
    try {
      const { materialNumber } = payload;
      delete payload.materialNumber;
      const res = await $axios.put(
        `${$baseURL}/infoRecord/markForPayments/${materialNumber}`,
        payload
      );

      toast.success(res?.data.message);

      return res;
    } catch (error) {
      toast.error(error?.response?.data?.message);

      //
    }
  };

export const deleteInfoRecord = (payload) => async (dispatch, getState) => {
  try {
    const { materialNumber } = payload;
    delete payload.materialNumber;
    const res = await $axios.delete(
      `${$baseURL}/infoRecord/deleteInfoRecord/${materialNumber}`
    );

    toast.success(res?.data.message);

    return res;
  } catch (error) {
    toast.error(error?.response?.data?.message);

    //
  }
};

export const fetchTransactionalData =
  (payload) => async (dispatch, getState) => {
    return await $axios
      .post(`${$baseURL}/invoice/getTransactionalDataList`, payload)
      .then((res) => {
        const result = res?.data?.data;

        return result;
      })
      .catch((error) => {
        dispatch(setError());
      });
  };
export const updateTransactionalData =
  (payload) => async (dispatch, getState) => {
    const { _id, newDeliveryDate, reason } = payload;
    delete payload._id;
    return await $axios
      .put(`${$baseURL}/invoice/updateTransactionalDataList/${_id}`, payload)
      .then((res) => {
        toast.success(res?.data.message);
        return res;
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
      });
  };

export const updateTransactionalDataItems =
  (payload) => async (dispatch, getState) => {
    const { _id, newDeliveryDate, reason } = payload;

    // delete payload._id;
    return await $axios
      .put(`${$baseURL}/invoice/updateTransactionalDataItems/${_id}`, payload)
      .then((res) => {
        toast.success(res?.data.message);
        return res;
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
      });
  };

export default infoRecordSlice.reducer;
