const firebaseConfig = {
  apiKey: "AIzaSyCBLutITiYKJK3gn4ph-hQ4KyVlOOj14y4",
  authDomain: "erp-app-fa9f8.firebaseapp.com",
  projectId: "erp-app-fa9f8",
  storageBucket: "erp-app-fa9f8.appspot.com",
  messagingSenderId: "711160258641",
  appId: "1:711160258641:web:a680b2d478b0fee3da5870",
  measurementId: "G-ZTC2STKJ9V",
};

//  * Here is is the code snippet to initialize Firebase Messaging in the Service
//  * Worker when your app is not hosted on Firebase Hosting.
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js"
);
// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp(firebaseConfig);
// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// Keep in mind that FCM will still show notification messages automatically
// and you should use data messages for custom notifications.
// For more info see:
// https://firebase.google.com/docs/cloud-messaging/concept-options
messaging.onBackgroundMessage(function (payload) {
  // Customize notification here
  const title = payload.title || "Notification";
  const notificationTitle = title;
  const notificationOptions = {
    body: payload.body || "",
    icon: "/firebase-logo.png",
    URL,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
