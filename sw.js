const CACHE_NAME = "gunluk-plan-v1";

self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    self.clients.claim()
  );
});

self.addEventListener("push", event => {

  let data = {
    title: "Günlük Plan",
    body: "Bir görevin var.",
    url: "/"
  };

  try {

    if (event.data) {
      data = {
        ...data,
        ...event.data.json()
      };
    }

  } catch (error) {

    console.error(
      "Push verisi okunamadı:",
      error
    );

  }

  event.waitUntil(

    self.registration.showNotification(
      data.title || "Günlük Plan",
      {
        body:
          data.body ||
          "Bir görevin var.",

        icon:
          "/icon.svg",

        badge:
          "/icon.svg",

        tag:
          data.tag ||
          "gunluk-plan",

        renotify:
          true,

        vibrate:
          [200,100,200],

        data:{
          url:
            data.url ||
            "/"
        }
      }
    )

  );

});


self.addEventListener(
  "notificationclick",
  event => {

    event.notification.close();

    const url =
      event.notification.data?.url ||
      "/";

    event.waitUntil(

      self.clients.matchAll({
        type:"window",
        includeUncontrolled:true
      }).then(
        clientList => {

          for(
            const client
            of clientList
          ){

            if(
              "focus" in client
            ){

              client.navigate(url);

              return client.focus();

            }

          }

          if(
            self.clients.openWindow
          ){

            return self.clients.openWindow(
              url
            );

          }

        }
      )

    );

  }
);
