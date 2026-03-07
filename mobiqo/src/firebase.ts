// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// TODO: Replace the following with your app's Firebase project configuration
// 1. Go to Firebase Console -> Project Settings
// 2. Scroll down to "Your apps" and select the Web app (or register one)
// 3. Copy the firebaseConfig object here:
const firebaseConfig = {
    apiKey: "AIzaSyDK7WfDq4ZXK2Tb-X46p2WtpFqhhCNRabk",
    authDomain: "smartelectroai.firebaseapp.com",
    projectId: "smartelectroai",
    storageBucket: "smartelectroai.firebasestorage.app",
    messagingSenderId: "597956729932",
    appId: "YOUR_WEB_APP_ID", // TODO: REPLACE WITH FIREBASE WEB APP ID
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log('Notification permission granted.');
            // TODO: Replace with your VAPID key (from Firebase Console -> Cloud Messaging -> Web configuration)
            const token = await getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY_HERE' });
            console.log("Firebase FCM Token:", token);
            // Optionally, send this token to your backend to save it against the user
            return token;
        } else {
            console.warn('Notification permission denied.');
            return null;
        }
    } catch (error) {
        console.error('An error occurred while requesting notification permission:', error);
        return null;
    }
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });

export default messaging;
