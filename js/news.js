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



const id =

document.getElementById("news_id").value;



const old_image_url =

document.getElementById("old_image_url").value;



const title =

document.getElementById("title").value;



const summary =

document.getElementById("summary").value;



const content =

document.getElementById("content").value;



const status =

document.getElementById("status").value;



const file =

document.getElementById("image_file").files[0];






try {



let new_image_url = old_image_url;





if(file){



new_image_url =

await uploadImage(

file,

"news"

);



}







if(id){



const {error}=

await client

.from("news")

.update({


title:title,


slug:createSlug(title),


summary:summary,


content:content,


status:status,


image_url:new_image_url



})

.eq(

"id",

id

);






if(error){

throw error;

}







// hapus foto lama jika diganti


if(

file &&

old_image_url &&

old_image_url !== new_image_url

){



await deleteStorageImage(

old_image_url

);



}





}

else{





const {data:userData}=

await client.auth.getUser();



const user=userData.user;







const {error}=

await client

.from("news")

.insert([


{


title:title,


slug:createSlug(title),


summary:summary,


content:content,


image_url:new_image_url,


status:status,


created_by:user.id


}


]);





if(error){

throw error;

}



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


document.getElementById("news_id").value="";


document.getElementById("old_image_url").value="";


document.getElementById("title").value="";


document.getElementById("summary").value="";


document.getElementById("content").value="";


document.getElementById("image_file").value="";


document.getElementById("image-preview").style.display="none";


document.getElementById("form-title").innerHTML="Tambah Berita";


}









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

style="width:80px;height:60px;object-fit:cover"

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


<button onclick="editNews('${news.id}')">

Edit

</button>



<button onclick="deleteNews('${news.id}','${news.image_url}')">

Hapus

</button>



</td>


</tr>



`;



});






document.getElementById("news-table").innerHTML=html;



}









async function editNews(newsId){



const {data,error}=

await client

.from("news")

.select("*")

.eq("id",newsId)

.single();





if(error){

alert(error.message);

return;

}





document.getElementById("news_id").value=data.id;


document.getElementById("old_image_url").value=data.image_url;


document.getElementById("title").value=data.title;


document.getElementById("summary").value=data.summary;


document.getElementById("content").value=data.content;


document.getElementById("status").value=data.status;





if(data.image_url){


let img=

document.getElementById("image-preview");


img.src=data.image_url;


img.style.display="block";


}





document.getElementById("form-title").innerHTML=

"Edit Berita";



window.scrollTo({

top:0,

behavior:"smooth"

});



}









async function deleteNews(id,image_url){



if(!confirm("Yakin ingin menghapus berita ini?")){

return;

}




await client

.from("news")

.delete()

.eq(

"id",

id

);




if(image_url){

await deleteStorageImage(image_url);

}




loadAdminNews();



}









async function deleteStorageImage(url){



const path =

url.split("/bmtc media/")[1];





if(path){



await client

.storage

.from("bmtc media")

.remove([

path

]);



}



}









loadAdminNews();
