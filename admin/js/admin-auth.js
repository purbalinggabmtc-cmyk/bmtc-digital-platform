"use strict";

/*
 * BMTC CENTRAL ADMIN AUTH GUARD
 * Shared by admin modules under bmtc.my.id.
 *
 * Requires:
 *   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
 *   <script src="/admin/js/admin-auth.js"></script>
 */

(function () {

  const SUPABASE_URL =
    "https://yrvnmmascklkuzpjkwxn.supabase.co";

  const SUPABASE_KEY =
    "sb_publishable_YGi3tPBuF9tW4KKnLJ5dDQ_AcBZ19WH";


  const client =
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


  async function loadAccess(userId) {

    /*
     * Ambil profil admin.
     */

    const profileResult =
      await client
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
      await client
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
     * Ambil seluruh permission dari role.
     */

    const roleIds =
      roles.map(
        function (role) {

          return role.id;

        }
      );


    const permissionResult =
      await client
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
   * Digunakan setiap modul admin.
   *
   * Contoh:
   *
   * await BMTC_ADMIN_AUTH.requirePermission(
   *   "registration.view"
   * );
   */

  async function requirePermission(
    permission
  ) {

    /*
     * Pastikan ada session login.
     */

    const sessionResult =
      await client.auth.getSession();


    const session =
      sessionResult.data &&
      sessionResult.data.session;


    if (!session) {

      throw new Error(
        "AUTH_REQUIRED"
      );

    }



    /*
     * Validasi user dari Supabase server.
     */

    const userResult =
      await client.auth.getUser();


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
     * Ambil role + permission.
     */

    const access =
      await loadAccess(
        user.id
      );


    /*
     * Jika modul meminta permission tertentu,
     * cek apakah user memilikinya.
     */

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
   * Redirect ke halaman admin utama.
   *
   * returnTo disimpan agar nanti dashboard
   * bisa dikembangkan untuk kembali ke modul
   * yang sebelumnya diminta.
   */

  function redirectToAdmin() {

    const returnTo =
      window.location.pathname +
      window.location.search;


    window.location.replace(

      "/admin/?returnTo=" +
      encodeURIComponent(
        returnTo
      )

    );

  }



  /*
   * Expose API global.
   */

  window.BMTC_ADMIN_AUTH =
    Object.freeze({

      client,

      requirePermission,

      redirectToAdmin

    });

})();
