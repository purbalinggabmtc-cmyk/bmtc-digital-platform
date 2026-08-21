// ======================================
// BMTC PUBLIC NEWS DISPLAY
// ======================================



async function loadNews(){



    const container =

    document.getElementById("news-container");



    if(!container){

        return;

    }




    const { data, error } =

    await client

    .from("news")

    .select(

        "id,title,summary,image_url,created_at"

    )

    .eq(

        "status",

        "publish"

    )

    .order(

        "created_at",

        {

            ascending:false

        }

    )

    .limit(3);





    if(error){


        console.error(

            "NEWS ERROR:",

            error

        );



        container.innerHTML =

        "<p>Berita gagal dimuat</p>";



        return;


    }





    if(!data || data.length === 0){


        container.innerHTML =

        "<p>Belum ada berita terbaru</p>";



        return;


    }





    container.innerHTML = "";





    data.forEach(news => {



        container.innerHTML += `



        <div class="news-card">



            <img

            src="${news.image_url}"

            alt="${news.title}"

            >




            <h3>

            ${news.title}

            </h3>





            <p>

            ${news.summary ?? ""}

            </p>




        </div>



        `;



    });



}
