"use strict";

/*
 * BMTC ADMIN WEB PUSH V1
 *
 * VAPID PUBLIC KEY boleh berada di frontend.
 * VAPID PRIVATE KEY wajib hanya berada di Supabase Secrets.
 */

(function () {

  const VAPID_PUBLIC_KEY =
    "BMdYTtOC-dk4ibYLJmMq5kGLIoTfVR4Gxd9O29S3FSiXcJKU-HYAAWAwvDzOP1AFS6wBiNdjatQUPXfvUn2e5YE";

  const PUSH_SERVICE_URL =
    "https://yrvnmmascklkuzpjkwxn.supabase.co/functions/v1/admin-push-subscription-service";

  const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_YGi3tPBuF9tW4KKnLJ5dDQ_AcBZ19WH";


  function base64UrlToUint8Array(
    base64UrlString
  ) {

    const padding =
      "=".repeat(
        (
          4 -
          base64UrlString.length % 4
        ) % 4
      );

    const base64 =
      (
        base64UrlString +
        padding
      )
        .replace(
          /-/g,
          "+"
        )
        .replace(
          /_/g,
          "/"
        );


    const rawData =
      atob(
        base64
      );


    const outputArray =
      new Uint8Array(
        rawData.length
      );


    for (
      let i = 0;
      i < rawData.length;
      i++
    ) {

      outputArray[i] =
        rawData.charCodeAt(
          i
        );

    }


    return outputArray;

  }


  function supported() {

    return (
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window
    );

  }


  async function getAdminHeaders() {

    if (
      !window.BMTC_ADMIN_AUTH
    ) {

      throw new Error(
        "BMTC_ADMIN_AUTH belum tersedia."
      );

    }


    const sessionResult =
      await window
        .BMTC_ADMIN_AUTH
        .client
        .auth
        .getSession();


    const session =
      sessionResult.data &&
      sessionResult.data.session;


    if (!session) {

      throw new Error(
        "AUTH_REQUIRED"
      );

    }


    return {

      "Accept":
        "application/json",

      "Content-Type":
        "application/json",

      "apikey":
        SUPABASE_PUBLISHABLE_KEY,

      "Authorization":
        "Bearer " +
        session.access_token

    };

  }


  async function registerWorker() {

    if (!supported()) {

      throw new Error(
        "Browser ini tidak mendukung Web Push."
      );

    }


    return await navigator
      .serviceWorker
      .register(
        "/service-worker.js",
        {
          scope: "/",
        }
      );

  }


  async function getSubscription() {

    const registration =
      await registerWorker();


    return await registration
      .pushManager
      .getSubscription();

  }


  async function subscribe() {

    const permission =
      await Notification
        .requestPermission();


    if (
      permission !==
      "granted"
    ) {

      throw new Error(
        "Izin notifikasi tidak diberikan."
      );

    }


    const registration =
      await registerWorker();


    let subscription =
      await registration
        .pushManager
        .getSubscription();


    if (!subscription) {

      subscription =
        await registration
          .pushManager
          .subscribe(
            {
              userVisibleOnly:
                true,

              applicationServerKey:
                base64UrlToUint8Array(
                  VAPID_PUBLIC_KEY
                ),
            }
          );

    }


    const payload =
      subscription.toJSON();


    const response =
      await fetch(
        PUSH_SERVICE_URL,
        {
          method: "POST",

          headers:
            await getAdminHeaders(),

          body:
            JSON.stringify(
              {
                endpoint:
                  payload.endpoint,

                keys:
                  payload.keys,

                deviceName:
                  navigator.userAgent
                    .includes(
                      "Android"
                    )
                    ? "Android"
                    : "Browser Admin",
              }
            ),
        }
      );


    const raw =
      await response.text();


    let data;

    try {

      data =
        JSON.parse(
          raw
        );

    } catch {

      throw new Error(
        "Response subscription tidak valid."
      );

    }


    if (
      !response.ok ||
      data.success !== true
    ) {

      throw new Error(
        data.message ||
        "Gagal menyimpan subscription."
      );

    }


    return subscription;

  }


  async function unsubscribe() {

    const subscription =
      await getSubscription();


    if (!subscription) {

      return true;

    }


    const endpoint =
      subscription.endpoint;


    const response =
      await fetch(
        PUSH_SERVICE_URL,
        {
          method: "DELETE",

          headers:
            await getAdminHeaders(),

          body:
            JSON.stringify(
              {
                endpoint,
              }
            ),
        }
      );


    if (!response.ok) {

      throw new Error(
        "Gagal menonaktifkan subscription."
      );

    }


    await subscription
      .unsubscribe();


    return true;

  }


  async function getStatus() {

    if (!supported()) {

      return {
        supported:
          false,

        permission:
          "unsupported",

        subscribed:
          false,
      };

    }


    const subscription =
      await getSubscription();


    return {

      supported:
        true,

      permission:
        Notification.permission,

      subscribed:
        Boolean(
          subscription
        ),

    };

  }


  window.BMTC_PUSH =
    Object.freeze(
      {

        supported,

        getStatus,

        subscribe,

        unsubscribe,

      }
    );

})();
