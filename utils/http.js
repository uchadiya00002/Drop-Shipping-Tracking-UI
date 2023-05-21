import axios from "axios";

const allowLocal = true;

const devMode = process.env.NEXT_PUBLIC_DEV_MODE;
const isLocal = allowLocal && devMode;

export const $devMode = devMode;
export const $isLocal = isLocal;

//  https://api.integrow.qwickbit.com/

// export const remoteUrl = `https://api.integrow.qwickbit.com`;
// export const $baseUrl = (!isLocal && remoteUrl) || `http://localhost:8000`;
// export const $axios = axios;
export const $hasWindow = typeof window !== "undefined";
