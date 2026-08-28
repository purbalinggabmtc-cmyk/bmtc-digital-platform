"use strict";

const DEFAULT_ADMIN_URL =
  "/admin/?returnTo=%2Fbold-after-dark%2Fpurchase-admin.html";

self.addEventListener(
  "push",
  function(event) {

    let data = {};

    try {
      data =
        event.data
          ? event.data.json()
          : {};
    } catch {
      data = {
        title:
          "BMTC ADMIN",
        body:
          event.data
            ? event.data.text()
            : "Ada notifikasi baru.",
      };
    }

    const title =
      String(
        data.title ||
        "BMTC ADMIN"
      );

    const options = {
      body:
        String(
          data.body ||
          "Bukti pembayaran baru diterima."
        ),

      tag:
        data.tag ||
        "bmtc-payment-notification",

      renotify:
        true,

      data: {
        url:
          data.url ||
          DEFAULT_ADMIN_URL,
      },
    };

    event.waitUntil(
      self.registration
        .showNotification(
          title,
          options
        )
    );
  }
);


self.addEventListener(
  "notificationclick",
  function(event) {

    event.notification.close();

    const targetUrl =
      event.notification &&
      event.notification.data &&
      event.notification.data.url
        ? event.notification.data.url
        : DEFAULT_ADMIN_URL;

    event.waitUntil(
      clients
        .matchAll(
          {
            type: "window",
            includeUncontrolled: true,
          }
        )
        .then(
          function(clientList) {

            for (
              const client
              of clientList
            ) {
              try {
                const url =
                  new URL(
                    client.url
                  );

                if (
                  url.origin ===
                  self.location.origin
                ) {
                  client.navigate(
                    targetUrl
                  );

                  return client.focus();
                }

              } catch {
                // lanjut cari window lain
              }
            }

            return clients.openWindow(
              targetUrl
            );
          }
        )
    );
  }
);
