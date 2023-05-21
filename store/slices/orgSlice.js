import { createSlice } from "@reduxjs/toolkit";
import { $axios, $baseURL } from "../../components/axios/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialState = {
  organizations: {
    data: [],
    count: 0,
  },
  loading: false,
  error: false,
};

const organizationsSlice = createSlice({
  name: "organizations",
  initialState,
  reducers: {
    setOrg: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.organizations = payload;
    },
  },
});
export const getOrganizations = (payload) => async (dispatch, getState) => {
  return await $axios
    .post(`${$baseURL}/organization/getOrganizationList`, payload)
    .then((res) => {
      const org = res?.data?.data;
      dispatch(setOrg(org));
      return res;
    })
    .catch((error) => {
      // dispatch(setError());
      console.log(error);
    });
};

export const { setLoading, setOrg, setError } = organizationsSlice.actions;
export const organizationsSelector = (state) =>
  state?.organizations?.organizations;
export default organizationsSlice.reducer;
