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

console.log(
"Gallery Error:",
error.message
);

return;

}




let html="";



if(!data || data.length === 0){


html = `

<p style="text-align:center">

Belum ada dokumentasi galeri.

</p>

`;


}

else{


data.forEach(item=>{


html += `


<div class="gallery-card">



<img

src="${item.image_url}"

alt="${item.title}"

>



<h3>

${item.title}

</h3>


${item.description ? `

<p>

${item.description}

</p>

` : ""}



${item.category ? `

<span>

${item.category}

</span>

` : ""}



</div>



`;



});


}




document.getElementById(
"gallery-container"
).innerHTML = html;



}







// jalankan saat halaman selesai dibuka

loadPublicGallery();
