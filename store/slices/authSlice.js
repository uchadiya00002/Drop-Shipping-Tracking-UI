import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { $axios, $baseURL } from "../../components/axios/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { useRouter } from "next/router";

// const router = useRouter();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    notificationList: [],
    chatDetails: [],
    loading: false,
  },
  reducers: {
    setUser: (state, action) => {
      const payload = action.payload;
      if (payload) {
        state.loading = false;
        localStorage.setItem("user", JSON.stringify(payload));
        const { token, ...user } = payload;
        // $axios.defaults.headers.Authorization = `Bearer ${token}`
        $axios.defaults.headers.Authorization = `${token}`;
        state.user = user;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUserNotifications: (state, action) => {
      state.notificationList = action.payload;
    },
    pushNotification: (state, action) => {
      state.notifications = [...state.notifications, action.payload];
    },
    setChatDetails: (state, action) => {
      state.chatDetails = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      window.location = "/";
      $axios.defaults.headers.Authorization = ``;
    },
  },
});

export const {
  setUser,
  setLoading,
  logoutUser,
  setChatDetails,
  setUsageMode,
  setUserNotifications,
  pushNotification,
} = authSlice.actions;

export const selectUser = (state) => state?.auth?.user;
export const selectUserNotifications = (state) =>
  state?.auth?.user?.notificationList;
export const selectUserLoading = (state) => state.auth.loading;
export const selectUsageMode = (state) => state.auth.usage_mode;
export const selectChatDetails = (state) => state.auth.chatDetails;

export const loginUser = (payload) => async (dispatch, getState) => {
  try {
    const res = await $axios.post(`${$baseURL}/auth/login`, payload);
    const { token, ...userData } = res?.data?.data;
    const user = userData;

    toast.success(res?.data.message);
    dispatch(setUser({ ...user, token }));
    return res;
  } catch (error) {
    // throw error;
    toast.error(error?.response?.data?.message);
  }
};

export const signUpUser = (payload) => async (dispatch, getState) => {
  try {
    const res = await $axios.post(`${$baseURL}/auth/signup`, payload);

    if (res) {
      toast.success(res?.data.message);

      return res;
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.error(error);
  }
};

export const verifyUserOTP = (payload) => async (dispatch, getState) => {
  try {
    const res = await $axios.post(`${$baseURL}/auth/verify-otp`, payload);

    toast.success(res?.data.message);
    return res;
  } catch (error) {
    // throw error;
    toast.error(error?.response?.data?.message);
    console.error(error);
  }
};

export const resendOTP = (payload) => async (dispatch, getState) => {
  try {
    const res = await $axios.post(`${$baseURL}/auth/resend-otp`, payload);
    // const {token,...userData} = res?.data?.data

    toast.success(res?.data.message);
    return res;
  } catch (error) {
    // throw error;
    toast.error(error?.response?.data?.message);
    console.error(error);
  }
};

export const forgot_password = (payload) => async (dispatch, getState) => {
  try {
    const res = await $axios.post(`${$baseURL}/auth/forgot-password`, payload);
    // const data = res?.data?.data
    toast.success(res?.data.message);

    // dispatch(setUser({...user,token}))
    return res;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    // throw error;
  }
};

export const reset_password = (payload) => async (dispatch, getState) => {
  try {
    const res = await $axios.post(`${$baseURL}/auth/reset-password`, payload);
    // const data = res?.data?.data

    toast.success(res?.data.message);
    // dispatch(setUser({...user,token}))
    return res;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    // throw error;
  }
};

export const getAllNotification = (payload) => async (dispatch, getState) => {
  try {
    // const id = payload?._id || payload?.id
    let url;
    if (payload && payload?.searchTerm) {
      const value = payload.searchTerm;
      url = `${$baseURL}/users/getAllNotifications?searchTerm=${value}`;
    } else {
      url = `${$baseURL}/users/getAllNotifications`;
    }
    const res = await $axios.get(url);

    const data = res.data?.data;

    dispatch(setUserNotifications(data || []));
    return res;
  } catch (error) {
    throw error;
  }
};

export const checkSingleUser = (payload) => async (dispatch, getState) => {
  try {
    const { _id } = payload;

    const res = await $axios.get(`${$baseURL}/users/users/${_id}`);
    // toast.success(res?.data?.message);
    return res;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const updateAccount = (payload, _id) => async (dispatch, getState) => {
  try {
    const res = await $axios.put(`${$baseURL}/users/users/${_id}`, payload);
    toast.success(res?.data?.message);

    return res;
  } catch (error) {
    toast.error(error?.response?.data?.message);

    //
  }
};
export const updatePassword = (payload) => async (dispatch, getState) => {
  try {
    const { _id, oldPassword, newPassword } = payload;

    const res = await $axios.put(`${$baseURL}/users/updatePassword/${_id}`, {
      oldPassword,
      newPassword,
    });
    toast.success(res?.data?.message);

    return res;
  } catch (error) {
    toast.error(error?.response?.data?.message);

    //
  }
};

export const fetchChatDetails = (payload) => async (dispatch, getState) => {
  try {
    const res = await $axios.post(`${$baseURL}/message/getMessages`, payload);
    const data = res.data.data;
    dispatch(setChatDetails(data || []));
    return res;
  } catch (error) {
    throw error;
  }
};

// {{baseUrl}}/users/users/:id

export default authSlice.reducer;
