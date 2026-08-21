// ======================================
// BMTC NEWS CMS
// ======================================



function createSlug(text){


return text

.toLowerCase()

.replace(/[^a-z0-9]+/g,'-')

.replace(/^-+|-+$/g,'');


}







async function saveNews(){



const title =

document.getElementById("title").value;



const summary =

document.getElementById("summary").value;



const content =

document.getElementById("content").value;



const status =

document.getElementById("status").value;




const file =

document

.getElementById("image_file")

.files[0];





try {



let image_url="";




if(file){



image_url =

await uploadImage(

file,

"news"

);



}





const {data:userData}=

await client.auth.getUser();




const user=

userData.user;







const {error}=

await client

.from("news")

.insert([

{


title:title,


slug:createSlug(title),


summary:summary,


content:content,


image_url:image_url,


status:status,


created_by:user.id


}


]);







if(error){

throw error;

}





document.getElementById("message").innerHTML=

"Berita berhasil disimpan";





clearForm();





}

catch(error){



document.getElementById("message").innerHTML=

"Gagal menyimpan: "

+

error.message;



}



}








function clearForm(){


document.getElementById("title").value="";


document.getElementById("summary").value="";


document.getElementById("content").value="";


document.getElementById("image_file").value="";


document.getElementById("image-preview").style.display="none";


}









document

.getElementById("image_file")

.addEventListener(

"change",

function(){



const file=this.files[0];



if(file){



const preview=

document.getElementById("image-preview");



preview.src=

URL.createObjectURL(file);



preview.style.display="block";


}



}

);
