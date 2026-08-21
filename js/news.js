// BMTC NEWS MODULE

async function addNews(){


    const title =
    document.getElementById("title").value;


    const content =
    document.getElementById("content").value;


    const image_url =
    document.getElementById("image_url").value;



    const {data,error} =

    await client

    .from("news")

    .insert([

        {

            title:title,

            content:content,

            image_url:image_url

        }

    ]);



    if(error){


        document.getElementById("message").innerHTML =

        error.message;


        return;

    }



    document.getElementById("message").innerHTML =

    "Berita berhasil disimpan";


}
