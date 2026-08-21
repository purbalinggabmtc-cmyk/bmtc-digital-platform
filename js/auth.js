const SUPABASE_URL =
"https://yrvnmmascklkuzpjkwxn.supabase.co";



const SUPABASE_KEY =
"sb_publishable_YGi3tPBuF9tW4KKnLJ5dDQ_AcBZ19WH";



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
async function logout(){

    await client.auth.signOut();

    window.location.href="login.html";

}
