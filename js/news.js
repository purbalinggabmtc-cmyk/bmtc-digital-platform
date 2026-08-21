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



    const image_url =
    document.getElementById("image_url").value;



    const status =
    document.getElementById("status").value;



    const {data:userData} =
    await client.auth.getUser();




    const user =
    userData.user;




    const {error} =

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


        document.getElementById("message").innerHTML =

        "Gagal menyimpan: " + error.message;


        return;

    }




    document.getElementById("message").innerHTML =

    "Berita berhasil disimpan";



    clearForm();


}







function clearForm(){


    document.getElementById("title").value="";

    document.getElementById("summary").value="";

    document.getElementById("content").value="";

    document.getElementById("image_url").value="";


}
