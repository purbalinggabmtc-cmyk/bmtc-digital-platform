// ======================================
// BMTC SUPABASE AUTHENTICATION
// ======================================


// Supabase Configuration

const SUPABASE_URL =
"https://yrvnmmascklkuzpjkwxn.supabase.co";


const SUPABASE_KEY =
"MASUKKAN_PUBLISHABLE_KEY_ANDA";



// Create Supabase Client

const client =
supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);





// ======================================
// LOGIN
// ======================================


async function login(){


    const email =
    document.getElementById("email").value;



    const password =
    document.getElementById("password").value;




    const { data, error } =
    await client.auth.signInWithPassword({

        email: email,

        password: password

    });





    if(error){


        document.getElementById("message").innerHTML =

        "Login gagal: " + error.message;


        return;


    }




    document.getElementById("message").innerHTML =

    "Login berhasil";




    setTimeout(function(){


        window.location.href="admin.html";


    },1000);



}







// ======================================
// LOGOUT
// ======================================


async function logout(){


    await client.auth.signOut();



    window.location.href="login.html";


}







// ======================================
// CHECK LOGIN SESSION
// ======================================


async function checkLogin(){



    const { data } =

    await client.auth.getSession();





    if(!data.session){


        window.location.href="login.html";


        return;


    }



}
