// =====================================
// BMTC GALLERY CMS
// =====================================


function clearGalleryForm(){

document.getElementById("gallery_id").value="";
document.getElementById("old_image_url").value="";

document.getElementById("title").value="";
document.getElementById("description").value="";
document.getElementById("image_file").value="";

document.getElementById("image-preview").style.display="none";

document.getElementById("form-title").innerHTML=
"Tambah Foto";

}






async function saveGallery(){


const id =
document.getElementById("gallery_id").value;


const old_image_url =
document.getElementById("old_image_url").value;



const title =
document.getElementById("title").value;


const description =
document.getElementById("description").value;


const category =
document.getElementById("category").value;



const file =
document.getElementById("image_file").files[0];



try{


let image_url = old_image_url;



if(file){


image_url =
await uploadImage(
file,
"gallery"
);


}





if(id){


const {error}=

await client

.from("galleries")

.update({

title:title,

description:description,

category:category,

image_url:image_url

})

.eq(
"id",
id
);



if(error)
throw error;



if(
file &&
old_image_url &&
old_image_url !== image_url
){

await deleteStorageImage(
old_image_url
);

}



}

else{


const {error}=

await client

.from("galleries")

.insert([{


title:title,

description:description,

category:category,

image_url:image_url


}]);



if(error)
throw error;


}




document.getElementById("message").innerHTML=
"Gallery berhasil disimpan";


clearGalleryForm();

loadGallery();



}

catch(error){


document.getElementById("message").innerHTML=
"Gagal : "+error.message;


}



}









async function loadGallery(){


const {data,error}=

await client

.from("galleries")

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



data.forEach(item=>{


html += `


<tr>


<td>

<img

src="${item.image_url}"

style="
width:80px;
height:60px;
object-fit:cover;
">

</td>



<td>

${item.title}

</td>



<td>

${item.category}

</td>



<td>


<button onclick="editGallery('${item.id}')">

Edit

</button>


<button onclick="deleteGallery('${item.id}','${item.image_url}')">

Hapus

</button>



</td>


</tr>


`;



});



document.getElementById(
"gallery-table"
).innerHTML=html;



}









async function editGallery(id){


const {data,error}=

await client

.from("galleries")

.select("*")

.eq(
"id",
id
)

.single();



if(error){

alert(error.message);

return;

}



document.getElementById("gallery_id").value=data.id;

document.getElementById("old_image_url").value=data.image_url;

document.getElementById("title").value=data.title;

document.getElementById("description").value=data.description;

document.getElementById("category").value=data.category;



let img =
document.getElementById("image-preview");


img.src=data.image_url;

img.style.display="block";



document.getElementById("form-title").innerHTML=
"Edit Foto";



window.scrollTo({

top:0,

behavior:"smooth"

});



}









async function deleteGallery(id,image_url){


if(
!confirm("Hapus foto ini?")
)
return;



const {error}=

await client

.from("galleries")

.delete()

.eq(
"id",
id
);



if(error){

alert(error.message);

return;

}



if(image_url){

await deleteStorageImage(image_url);

}



loadGallery();


}








async function deleteStorageImage(url){


const path =
url.split("/bmtc media/")[1];



if(path){


await client

.storage

.from("bmtc media")

.remove([path]);


}


}








loadGallery();
