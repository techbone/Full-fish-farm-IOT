import { subscribeToPush } from '../services/api';

const VAPID_PUBLIC_KEY = 'BE7CS27DFYqU4MKx3_M2lO_EPEhtrazn8gq4Aa6dEkbKdJP00Pv7BpVP5OJqvTVfXL_5WIceWEiYwscN-kG0B9Y'; // Replace with your generated VAPID public key

export async function subscribeUserToPush() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
    // Send subscription to your backend using axios and api.js
    await subscribeToPush(subscription);
    return subscription;
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
} 