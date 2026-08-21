// ======================================
// BMTC STORAGE UPLOAD HELPER
// ======================================


async function uploadImage(file, folder){



    if(!file){

        throw new Error(
            "File belum dipilih"
        );

    }



    const ext =

    file.name

    .split(".")

    .pop();




    const filename =

    Date.now()

    +

    "-"

    +

    Math.random()

    .toString(36)

    .substring(2)

    +

    "."

    +

    ext;





    const filepath =

    folder

    +

    "/"

    +

    filename;







    const {error} =

    await client

    .storage

    .from("bmtc media")

    .upload(

        filepath,

        file

    );





    if(error){

        throw error;

    }





    const {data} =

    client

    .storage

    .from("bmtc media")

    .getPublicUrl(

        filepath

    );





    return data.publicUrl;



}
