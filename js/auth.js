const SUPABASE_URL =
"https://yrvnmmascklkuzpjkwxn.supabase.co";



const SUPABASE_KEY =
"MASUKKAN_PUBLISHABLE_KEY_DISINI";



const client =
supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);




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



setTimeout(()=>{


window.location.href="admin.html";


},1000);



}
