// ======================================
// BMTC DETAIL NEWS
// ======================================



async function loadDetailNews(){


const params =
new URLSearchParams(
window.location.search
);


const id =
params.get("id");



const {data,error}=

await client

.from("news")

.select("*")

.eq(
"id",
id
)

.single();





if(error){

console.log(error);

return;

}





document.getElementById(
"detail-image"
).src =
data.image_url;




document.getElementById(
"detail-title"
).innerHTML =
data.title;



document.getElementById(
"detail-date"
).innerHTML =

new Date(
data.created_at
)
.toLocaleDateString(
"id-ID"
);



document.getElementById(
"detail-content"
).innerHTML =
data.content;



}



loadDetailNews();
