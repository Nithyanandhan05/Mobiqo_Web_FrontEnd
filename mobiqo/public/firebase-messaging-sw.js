// public/firebase-messaging-sw.js

// Import Firebase worker scripts
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfZOLHvRWMfC3mXjxbCy_2wEEc3HZd0zw",
  authDomain: "smartelectroai.firebaseapp.com",
  projectId: "smartelectroai",
  storageBucket: "smartelectroai.firebasestorage.app",
  messagingSenderId: "597956729932",
  appId: "1:597956729932:web:762e33a7084216375e68e9",
  measurementId: "G-Q78YTPS2M5"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// This runs when the browser receives a push notification while the tab is closed
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title || "Modiqo Update";
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png', // Add a small logo image in your public folder
    badge: '/logo192.png',
    data: payload.data // For deep linking if needed
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});