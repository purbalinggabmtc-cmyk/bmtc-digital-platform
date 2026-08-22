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



loadAdminNews();



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









// ======================================
// IMAGE PREVIEW
// ======================================



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









// ======================================
// LOAD ADMIN NEWS
// ======================================



async function loadAdminNews(){



const {data,error}=

await client

.from("news")

.select("*")

.order(

"created_at",

{

ascending:false

}

);






if(error){



console.log(error);


return;


}





let html="";





data.forEach(news=>{



html += `


<tr>



<td>


<img

src="${news.image_url}"

style="width:80px;height:60px;object-fit:cover;border-radius:8px"

>


</td>




<td>

${news.title}

</td>




<td>

${news.status}

</td>




<td>

${new Date(news.created_at).toLocaleDateString("id-ID")}

</td>




<td>


<button>

Edit

</button>



<button>

Hapus

</button>



</td>



</tr>



`;



});






document

.getElementById("news-table")

.innerHTML = html;



}








// LOAD DATA SAAT HALAMAN DIBUKA


loadAdminNews();
