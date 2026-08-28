"use strict";

/*
 * BMTC CENTRAL ADMIN AUTH GUARD V5
 *
 * Mode 1 — module dibuka di dalam /admin/ iframe:
 *   Session + RBAC diambil dari same-origin BMTC_ADMIN_BRIDGE.
 *
 * Mode 2 — module dibuka langsung:
 *   Session + RBAC dibaca melalui Supabase seperti biasa.
 *
 * Backend tetap wajib memvalidasi JWT + permission.
 */

(function () {

  const SUPABASE_URL =
    "https://yrvnmmascklkuzpjkwxn.supabase.co";

  const SUPABASE_KEY =
    "sb_publishable_YGi3tPBuF9tW4KKnLJ5dDQ_AcBZ19WH";


  const supabaseClient =
    supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    );


  function getParentBridge() {

    try {

      if (
        window.parent &&
        window.parent !== window &&
        window.parent.location.origin ===
          window.location.origin &&
        window.parent.BMTC_ADMIN_BRIDGE
      ) {

        return (
          window.parent
            .BMTC_ADMIN_BRIDGE
        );

      }

    } catch (error) {

      /*
       * Jika iframe bukan same-origin,
       * jangan mencoba membaca parent.
       */

    }


    return null;

  }



  /*
   * Facade client.
   *
   * Modul lama tetap dapat memanggil:
   *
   * BMTC_ADMIN_AUTH.client.auth.getSession()
   * BMTC_ADMIN_AUTH.client.auth.getUser()
   * BMTC_ADMIN_AUTH.client.auth.signOut()
   *
   * Jika embedded, operasi auth tersebut
   * diarahkan ke parent dashboard.
   */

  const client =
    Object.freeze({

      auth:
        Object.freeze({

          getSession:
            async function () {

              const bridge =
                getParentBridge();


              if (bridge) {

                return bridge
                  .getSession();

              }


              return await supabaseClient
                .auth
                .getSession();

            },


          getUser:
            async function () {

              const bridge =
                getParentBridge();


              if (bridge) {

                return bridge
                  .getUser();

              }


              return await supabaseClient
                .auth
                .getUser();

            },


          signOut:
            async function () {

              const bridge =
                getParentBridge();


              if (bridge) {

                return await bridge
                  .signOut();

              }


              return await supabaseClient
                .auth
                .signOut();

            }

        }),


      from:
        function (...args) {

          return supabaseClient
            .from(...args);

        },


      rpc:
        function (...args) {

          return supabaseClient
            .rpc(...args);

        }

    });



  async function loadAccess(
    userId
  ) {

    /*
     * Ambil profil admin.
     */

    const profileResult =
      await supabaseClient
        .from("admin_profiles")
        .select(
          "user_id, full_name, is_active"
        )
        .eq(
          "user_id",
          userId
        )
        .maybeSingle();


    if (profileResult.error) {

      throw profileResult.error;

    }


    const profile =
      profileResult.data;


    if (!profile) {

      throw new Error(
        "Akun ini belum terdaftar sebagai admin BMTC."
      );

    }


    if (
      profile.is_active !== true
    ) {

      throw new Error(
        "Akun admin ini sedang dinonaktifkan."
      );

    }



    /*
     * Ambil role user.
     */

    const roleResult =
      await supabaseClient
        .from("admin_user_roles")
        .select(`
          role_id,
          admin_roles (
            id,
            code,
            name
          )
        `)
        .eq(
          "user_id",
          userId
        );


    if (roleResult.error) {

      throw roleResult.error;

    }


    const roles =
      (
        roleResult.data ||
        []
      )
        .map(
          function (row) {

            return row.admin_roles;

          }
        )
        .filter(
          Boolean
        );


    if (
      !roles.length
    ) {

      throw new Error(
        "Akun admin belum memiliki role."
      );

    }



    /*
     * Ambil seluruh permission role.
     */

    const roleIds =
      roles.map(
        function (role) {

          return role.id;

        }
      );


    const permissionResult =
      await supabaseClient
        .from(
          "admin_role_permissions"
        )
        .select(`
          permission_id,
          admin_permissions (
            code,
            name
          )
        `)
        .in(
          "role_id",
          roleIds
        );


    if (
      permissionResult.error
    ) {

      throw permissionResult.error;

    }


    const permissions =
      new Set(
        (
          permissionResult.data ||
          []
        )
          .map(
            function (row) {

              return (
                row.admin_permissions &&
                row.admin_permissions.code
              );

            }
          )
          .filter(
            Boolean
          )
      );


    return {

      profile,

      roles,

      permissions

    };

  }



  /*
   * Validasi permission module.
   */

  async function requirePermission(
    permission
  ) {

    /*
     * Jika module berada di iframe /admin/,
     * gunakan session + RBAC milik dashboard.
     */

    const bridge =
      getParentBridge();


    if (bridge) {

      const context =
        bridge.getContext(
          permission
        );


      return {

        client,

        session:
          context.session,

        user:
          context.user,

        profile:
          context.profile,

        roles:
          context.roles,

        permissions:
          context.permissions

      };

    }



    /*
     * Jika module dibuka langsung,
     * gunakan Supabase Auth lokal.
     */

    const sessionResult =
      await supabaseClient
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



    /*
     * Validasi user ke Supabase Auth server.
     */

    const userResult =
      await supabaseClient
        .auth
        .getUser();


    if (
      userResult.error ||
      !userResult.data ||
      !userResult.data.user
    ) {

      throw new Error(
        "AUTH_REQUIRED"
      );

    }


    const user =
      userResult.data.user;



    /*
     * Ambil role dan permission.
     */

    const access =
      await loadAccess(
        user.id
      );


    if (
      permission &&
      !access.permissions.has(
        permission
      )
    ) {

      throw new Error(
        "FORBIDDEN"
      );

    }


    return {

      client,

      session,

      user,

      profile:
        access.profile,

      roles:
        access.roles,

      permissions:
        access.permissions

    };

  }



  /*
   * Redirect menuju admin dashboard.
   */

  function redirectToAdmin() {

    const returnTo =
      window.location.pathname +
      window.location.search;


    const target =
      "/admin/?returnTo=" +
      encodeURIComponent(
        returnTo
      );


    /*
     * Jika sedang berada di dalam iframe,
     * redirect parent/top dashboard,
     * bukan membuka /admin/ di dalam iframe.
     */

    try {

      if (
        window.top &&
        window.top !== window &&
        window.top.location.origin ===
          window.location.origin
      ) {

        window.top.location.replace(
          target
        );

        return;

      }

    } catch (error) {

      /*
       * fallback ke redirect lokal
       */

    }


    window.location.replace(
      target
    );

  }



  /*
   * Expose global API.
   */

  window.BMTC_ADMIN_AUTH =
    Object.freeze({

      client,

      requirePermission,

      redirectToAdmin

    });

})();
