import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import thunk from "redux-thunk";

import authReducer from "../store/slices/authSlice";
import orderReducer from "../store/slices/orderSlice";
import infoRecordReducer from "../store/slices/infoRecordSlice";
import invoiceReducer from "../store/slices/invoiceSlice";
import collabReducer from "../store/slices/collabSlice";
import organizationsReducer from "../store/slices/orgSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    order: orderReducer,
    infoRecords: infoRecordReducer,
    invoices: invoiceReducer,
    collabs: collabReducer,
    organizations: organizationsReducer,
    //  middleware: applyMiddleware(thunk)
    middleware: applyMiddleware(thunk),
  },
});
