// =====================================
// BMTC PUBLIC GALLERY
// =====================================


async function loadPublicGallery(){


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

console.log(error.message);

return;

}




let html="";



data.forEach(item=>{


html += `


<div class="gallery-card">


<img

src="${item.image_url}"

alt="${item.title}"

onclick="openGallery(
'${item.image_url}',
'${item.title}'
)"

>



<h3>

${item.title}

</h3>


</div>



`;



});



document.getElementById(
"gallery-container"
).innerHTML=html;



}








function openGallery(image,title){


document.getElementById(
"gallery-modal"
).style.display="flex";



document.getElementById(
"gallery-modal-image"
).src=image;



document.getElementById(
"gallery-modal-title"
).innerHTML=title;



}








document.getElementById(
"close-gallery"
).onclick=function(){


document.getElementById(
"gallery-modal"
).style.display="none";


}






document.getElementById(
"gallery-modal"
).onclick=function(e){


if(
e.target.id==="gallery-modal"
){

this.style.display="none";

}


}






loadPublicGallery();
