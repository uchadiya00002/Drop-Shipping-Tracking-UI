import { createSlice } from "@reduxjs/toolkit";
import { $axios, $baseURL } from "../../components/axios/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialState = {
  collabs: {
    data: [],
    count: 0,
  },
  loading: false,
  error: false,
};

const collabSlice = createSlice({
  name: "collabs",
  initialState,
  reducers: {
    setcollabs: (state, action) => {
      state.collabs = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

// // export the actions
export const { setLoading, setcollabs } = collabSlice.actions;

export const collabSelector = (state) => state.collabs.collabs;

export const fetchcollabs = (payload) => async (dispatch, getState) => {
  return await $axios
    .post(`${$baseURL}/purchaseItem/getCollaborationRoomItemList`, payload)
    .then((res) => {
      const collabs = res?.data?.data;
      dispatch(setcollabs(collabs));
      return res?.data;
    })
    .catch((error) => {
      // dispatch(setError());
    });
};
export const fetchCriticalOrders = (payload) => async (dispatch, getState) => {
  return await $axios
    .post(`${$baseURL}/purchaseOrder/getCriticalOrders`, payload)
    .then((res) => {
      const data = res?.data?.data;

      // dispatch(setcollabs(collabs));
      return res;
    })
    .catch((error) => {
      // dispatch(setError());
    });
};

export const fetchFuzzyTypes = (payload) => async (dispatch, getState) => {
  return await $axios
    .post(`${$baseURL}/purchaseOrder/getFuzzyList`, payload)
    .then((res) => {
      const data = res?.data?.data;

      // dispatch(setcollabs(collabs));
      return res;
    })
    .catch((error) => {
      // dispatch(setError());
    });
};

export const sendEmailToBuyer = (payload) => async (dispatch, getState) => {
  return await $axios
    .post(`${$baseURL}/purchaseItem/sendEmail`, payload)
    .then((res) => {
      toast.success(res?.data?.message);
      return res?.data;
    })
    .catch((error) => {
      toast.error(error?.response?.data?.message);
    });
};

export const updateItemForSupp =
  ({ poNumber, itemNo, info }) =>
  async (dispatch, getState) => {
    return await $axios
      .post(
        `${$baseURL}/purchaseItem/updateItemForSupplierOnly/${poNumber}/${itemNo}`,
        info
      )
      .then((res) => {
        // const collabs = res?.data?.data;
        toast.success(res?.data?.message);
        return res?.data;
        // dispatch(setcollabs(collabs));
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
        // dispatch(setError());
        //
      });
  };

export default collabSlice.reducer;
