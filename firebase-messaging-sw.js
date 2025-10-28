importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyCb7E8Igy9fA0Px2Hzfwnke4fojiLECK50",
  authDomain: "hsha-a1b25.firebaseapp.com",
  projectId: "hsha-a1b25",
  storageBucket: "hsha-a1b25.firebasestorage.app",
  messagingSenderId: "958765527043",
  appId: "1:958765527043:web:ca9b352f137b0b67829e36"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  
  const notificationTitle = payload.data?.title || 'Mentor Shaurya';
  const notificationOptions = {
    body: payload.data?.body || 'You have a new notification',
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23FF9A76' rx='20'/><text x='50' y='65' font-family='Arial, sans-serif' font-size='50' text-anchor='middle' fill='white'>👨‍🏫</text></svg>",
    badge: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23FF6B6B' rx='50'/><text x='50' y='65' font-family='Arial, sans-serif' font-size='50' text-anchor='middle' fill='white'>👨‍🏫</text></svg>",
    tag: 'mentor-notification',
    requireInteraction: true,
    vibrate: [200, 100, 200],
    data: {
      url: payload.data?.url || '/',
      type: payload.data?.type || 'general'
    },
    actions: [
      {
        action: 'open',
        title: 'Open App'
      }
    ]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification click received:', event);
  
  event.notification.close();

  const clickAction = event.action;
  const notificationData = event.notification.data;

  if (clickAction === 'open' || !clickAction) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(function(clientList) {
          for (const client of clientList) {
            if (client.url.includes(self.location.origin) && 'focus' in client) {
              client.focus();
              client.postMessage({
                type: 'NOTIFICATION_CLICK',
                data: notificationData
              });
              return;
            }
          }
          
          if (clients.openWindow) {
            return clients.openWindow(notificationData.url || '/');
          }
        })
    );
  }
});
