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

console.log(error);

return;

}




let html="";



data.forEach(item=>{


html += `


<div class="gallery-card">


<img

src="${item.image_url}"

alt="${item.title}"

>


<div class="gallery-content">


<h3>
${item.title}
</h3>


<p>
${item.description ?? ""}
</p>


<span>
${item.category}
</span>


</div>


</div>



`;



});




document.getElementById(
"gallery-container"
).innerHTML=html;



}



loadPublicGallery();
