// ======================================
// BMTC STORAGE UPLOAD HELPER
// ======================================



async function uploadImage(file, folder){



    if(!file){

        throw new Error(
            "File belum dipilih"
        );

    }





    const fileExt =

    file.name

    .split(".")

    .pop();





    const fileName =

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

    fileExt;





    const filePath =

    folder

    +

    "/"

    +

    fileName;







    const {data,error} =

    await client

    .storage

    .from("bmtc media")

    .upload(

        filePath,

        file

    );







    if(error){


        console.error(
            "UPLOAD ERROR:",
            error
        );


        throw error;


    }







    const {data:urlData}=

    client

    .storage

    .from("bmtc media")

    .getPublicUrl(

        filePath

    );






    return urlData.publicUrl;



}
