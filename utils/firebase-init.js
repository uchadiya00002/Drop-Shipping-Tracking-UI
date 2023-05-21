// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { $hasWindow, $devMode } from "../utils/http";
import 'firebase/messaging';
import { getMessaging, onMessage } from "firebase/messaging";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyCBLutITiYKJK3gn4ph-hQ4KyVlOOj14y4",
    authDomain: "erp-app-fa9f8.firebaseapp.com",
    projectId: "erp-app-fa9f8",
    storageBucket: "erp-app-fa9f8.appspot.com",
    messagingSenderId: "711160258641",
    appId: "1:711160258641:web:a680b2d478b0fee3da5870",
    measurementId: "G-ZTC2STKJ9V"
  };
  

const apps= getApps()
export const firstTime = !apps.length 
const firebaseApp =  apps.length ? getApp() :initializeApp(firebaseConfig);

// Initialize Firebase

export const analytics = ($hasWindow && !$devMode) ? getAnalytics() : null;
// export const logEvent = $devMode ? () => {console.log('Analytics event!')}:$logEvent
export default firebaseApp;
