// ======================================
// BMTC SUPABASE AUTHENTICATION
// ======================================



// ======================================
// LOGIN
// ======================================


async function login(){



    const email =

    document
    .getElementById("email")
    .value;



    const password =

    document
    .getElementById("password")
    .value;





    const { data, error } =

    await client.auth.signInWithPassword({

        email: email,

        password: password

    });





    if(error){


        document
        .getElementById("message")
        .innerHTML =

        "Login gagal: " + error.message;


        return;


    }






    document
    .getElementById("message")
    .innerHTML =

    "Login berhasil";





    setTimeout(()=>{


        window.location.href =
        "admin.html";


    },1000);



}









// ======================================
// LOGOUT
// ======================================


async function logout(){



    await client.auth.signOut();



    window.location.href =
    "login.html";



}









// ======================================
// CHECK LOGIN SESSION
// ======================================


async function checkLogin(){



    const {

        data

    } =

    await client.auth.getSession();






    if(!data.session){



        window.location.href =
        "login.html";



        return;



    }




}









// ======================================
// GET CURRENT USER
// ======================================


async function getCurrentUser(){



    const {

        data

    } =

    await client.auth.getUser();




    return data.user;



}
