import { createSlice } from "@reduxjs/toolkit";
import { $axios, $baseURL } from "../../components/axios/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialState = {
  orders: {
    data: [],
    count: 0,
  },
  items: {
    data: [],
    count: 0,
  },

  loading: false,
  error: false,
};

export const getPurchaseOrder = (payload) => async (dispatch, getState) => {
  return await $axios
    .post(`${$baseURL}/purchaseOrder/getPurchaseOrderList`, payload)
    .then((res) => {
      const orders = res?.data?.data;
      dispatch(setOrders(orders));
      return res;
    })
    .catch((error) => {
      dispatch(setError());
    });
};

export const getCriticalOrders = (payload) => async (dispatch, getState) => {
  return await $axios
    .post(`${$baseURL}/purchaseOrder/getPoCriticalFollowUpList`, payload)
    .then((res) => {
      const orders = res?.data?.data;
      dispatch(setOrders(orders));
    })
    .catch((error) => {
      dispatch(setError());
    });
};

export const getItems = (payload) => async (dispatch, getState) => {
  return await $axios
    .post(`${$baseURL}/purchaseItem/getPurchaseItemList`, payload)
    .then((res) => {
      const items = res?.data?.data;
      dispatch(setItems(items));
    })
    .catch((error) => {
      dispatch(setError());
      //
    });
};

export const updatePurchaseOrder = (payload) => async (dispatch, getState) => {
  try {
    const { poNumber, criticalParts } = payload;

    const res = await $axios.put(
      `${$baseURL}/purchaseOrder/updatePurchaseOrder/${poNumber}`,

      criticalParts
    );
    toast.success(res?.data?.message);

    return res;
  } catch (error) {
    toast.error(error?.response?.data?.message);

    //
  }
};

export const updatePurchaseItem = (payload) => async (dispatch, getState) => {
  try {
    const { orderNo, itemNo, criticalParts } = payload;

    const res = await $axios.put(
      `${$baseURL}/purchaseItem/updatePurchaseItem/${orderNo}/${itemNo}`,
      criticalParts
    );
    toast.success(res?.data.message);
    return res;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const uploadExcelSheet = (payload) => async (dispatch, getState) => {
  try {
    const res = await $axios.post(
      `${$baseURL}/purchaseOrder/uploadExcelSheet`,
      payload
    );

    toast.success(res?.data.message);
    // const orders = res?.data?.data;
    // dispatch(setOrders(orders));
    return res;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    // console.error(error);
  }
};

export const singlePurchaseOrder = (payload) => async (dispatch, getState) => {
  const poNumber = payload;
  try {
    const res = await $axios.get(
      `${$baseURL}/purchaseOrder/getSinglePurchaseOrder/${poNumber}`
    );

    const singleOrder = res.data?.data;

    return singleOrder;
  } catch (error) {
    console.error(error);
  }
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.orders = payload;
    },
    setItems: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.items = payload;
    },
  },
});

// // export the actions
export const { setLoading, setOrders, setError, setItems } =
  ordersSlice.actions;

export const ordersSelector = (state) => state.order.orders;
export const itemsSelector = (state) => state.order.items;

export const fetchRejectedOrders = (payload) => async (dispatch, getState) => {
  try {
    const res = await $axios.post(
      `${$baseURL}/rejectedOrder/getRejectedOrderList`,
      payload
    );
    // toast.success(res?.data.message);

    return res?.data?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);

    //
  }
};

export const fetchRejectedItems = (payload) => async (dispatch, getState) => {
  try {
    const res = await $axios.post(
      `${$baseURL}/rejectedItem/getRejectedItemList`,
      payload
    );
    // toast.success(res?.data.message);

    return res?.data?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);

    //
  }
};
export const fetchDashboard = (payload) => async (dispatch, getState) => {
  try {
    const res = await $axios.post(
      `${$baseURL}/dashboardAndHome/dashboard`,
      payload
    );
    // toast.success(res?.data.message);
    return res;
  } catch (error) {
    // toast.error(error?.response?.data?.message);
    //
  }
};
export const fetchHome = (payload) => async (dispatch, getState) => {
  try {
    const res = await $axios.post(`${$baseURL}/dashboardAndHome/home`, payload);
    // toast.success(res?.data.message);
    return res;
  } catch (error) {
    // toast.error(error?.response?.data?.message);
    //
  }
};
export const notify = (payload) => async (dispatch, getState) => {
  try {
    const res = await $axios.post(`${$baseURL}/purchaseOrder/notify`, payload);
    toast.success(res?.data.message);
    return res;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export default ordersSlice.reducer;
