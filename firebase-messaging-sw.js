// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Your Firebase configuration - REPLACE WITH YOUR ACTUAL CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyCb7E8Igy9fA0Px2Hzfwnke4fojiLECK50",
  authDomain: "hsha-a1b25.firebaseapp.com",
  projectId: "hsha-a1b25",
  storageBucket: "hsha-a1b25.firebasestorage.app",
  messagingSenderId: "958765527043",
  appId: "1:958765527043:web:ca9b352f137b0b67829e36"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Customize background message handler
messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  
  // Customize notification here
  const notificationTitle = payload.data?.title || 'Mentor Shaurya';
  const notificationOptions = {
    body: payload.data?.body || 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    image: payload.data?.image,
    data: payload.data?.url || '/',
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ],
    tag: 'mentor-notification',
    renotify: true,
    requireInteraction: true,
    vibrate: [200, 100, 200]
  };

  // Show notification
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', function(event) {
  console.log('[firebase-messaging-sw.js] Notification click received:', event);
  
  event.notification.close();

  const clickAction = event.action;
  const notificationData = event.notification.data;

  if (clickAction === 'close') {
    // User clicked close, do nothing
    return;
  }

  // Default action - open the app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clientList) {
        // Check if app is already open
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
        
        // If app not open, open it
        if (clients.openWindow) {
          return clients.openWindow(notificationData || '/');
        }
      })
  );
});

// Handle notification close
self.addEventListener('notificationclose', function(event) {
  console.log('[firebase-messaging-sw.js] Notification closed:', event);
});

// Optional: Handle push subscription change
self.addEventListener('pushsubscriptionchange', function(event) {
  console.log('[firebase-messaging-sw.js] Push subscription changed:', event);
  
  event.waitUntil(
    self.registration.pushManager.subscribe(event.oldSubscription.options)
      .then(function(subscription) {
        console.log('[firebase-messaging-sw.js] New subscription:', subscription);
        // Here you would typically send the new subscription to your server
      })
      .catch(function(error) {
        console.error('[firebase-messaging-sw.js] Error renewing subscription:', error);
      })
  );
});
