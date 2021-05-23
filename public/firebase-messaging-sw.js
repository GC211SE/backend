importScripts('https://www.gstatic.com/firebasejs/8.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyAhnFtGj2rBKI4XaawLPyCYxVK4_ihYTv4",
    authDomain: "gcse211.firebaseapp.com",
    projectId: "gcse211",
    storageBucket: "gcse211.appspot.com",
    messagingSenderId: "878956815003",
    appId: "1:878956815003:web:aba829cced52049f739c3e",
    measurementId: "G-SL9PCXRB88"
});

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {
    const promiseChain = clients
        .matchAll({
            type: "window",
            includeUncontrolled: true
        })
        .then(windowClients => {
            for (let i = 0; i < windowClients.length; i++) {
                const windowClient = windowClients[i];
                windowClient.postMessage(payload);
            }
        })
        .then(() => {
            return registration.showNotification("New Message");
        });
    return promiseChain;
});
self.addEventListener('notificationclick', function (event) {
    console.log('notification received: ', event)
});