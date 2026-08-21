// Authentication BMTC
const SUPABASE_URL =
"https://yrvnmmascklkuzpjkwxn.supabase.co";


const SUPABASE_KEY =
"MASUKKAN_ANON_KEY";


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



const {data,error} =
await client.auth.signInWithPassword({

email,

password

});



if(error){

document.getElementById("message").innerHTML =
"Login gagal";

return;

}



window.location.href =
"admin.html";


}
