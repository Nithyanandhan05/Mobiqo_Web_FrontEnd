// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import type { Messaging } from 'firebase/messaging';

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

const app = initializeApp(firebaseConfig);
let messaging: Messaging | null = null;

// Only initialize messaging if supported (i.e. we are in a secure context / localhost)
isSupported().then((supported: boolean) => {
    if (supported) {
        messaging = getMessaging(app);
    } else {
        console.warn("Firebase Messaging is not supported in this browser/context (e.g. non-HTTPS).");
    }
});

// Replace with the key you generated in Step 1
const VAPID_KEY = "BMyY3U2WNDT3tvUW1TWKe6RvqSE1TvNmWjar2fvrxXaZHS63drc17uSenyWe7nxqjQLwFXYrUOxipcPpTer1HGg";

export const requestNotificationPermission = async (jwtToken: string) => {
    if (!messaging) {
        console.warn('Messaging is not initialized. Notifications are currently disabled.');
        return;
    }

    try {
        console.log("Requesting notification permission...");
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
            console.log("Permission granted! Fetching token...");
            const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });

            if (currentToken) {
                console.log("Web FCM Token generated:", currentToken);
                // SEND THIS TOKEN TO OUR NEW FLASK ROUTE
                await sendTokenToBackend(currentToken, jwtToken);
            } else {
                console.log("No registration token available. Request permission to generate one.");
            }
        } else {
            console.log("Notification permission denied by user.");
        }
    } catch (err) {
        console.error("An error occurred while retrieving token:", err);
    }
};

const sendTokenToBackend = async (fcmToken: string, jwtToken: string) => {
    try {
        const response = await fetch('/api/update_fcm_token', { // Ensure your Vite proxy routes /api to Flask
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            // WE EXPLICITLY TELL FLASK THIS IS THE WEB TOKEN
            body: JSON.stringify({ fcm_token: fcmToken, platform: 'web' })
        });

        const data = await response.json();
        console.log("Backend response to token update:", data);
    } catch (error) {
        console.error("Failed to send token to backend:", error);
    }
};

// Listen for messages while the app is open on the screen
export const onMessageListener = () =>
    new Promise((resolve) => {
        if (!messaging) return;
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });

export default messaging;