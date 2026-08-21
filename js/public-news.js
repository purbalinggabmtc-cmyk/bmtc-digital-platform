// ======================================
// BMTC PUBLIC NEWS DISPLAY
// ======================================


async function loadNews(){


    const container =
    document.getElementById("news-container");



    if(!container){

        return;

    }




    const {data,error}=

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


        console.error(error);


        container.innerHTML =
        "<p>Berita gagal dimuat</p>";


        return;


    }





    if(data.length===0){


        container.innerHTML =
        "<p>Belum ada berita</p>";


        return;


    }





    container.innerHTML="";





    data.forEach(news=>{


        const date =
        new Date(news.created_at)
        .toLocaleDateString(
            "id-ID"
        );



        container.innerHTML += `


        <article class="news-card">


            <img

            src="${news.image_url}"

            alt="${news.title}"

            >



            <div class="news-content">


            <small>
            ${date}
            </small>


            <h3>
            ${news.title}
            </h3>



            <p>
            ${news.summary ?? ""}
            </p>



            <a

            href="detail-berita.html?id=${news.id}"

            class="news-button"

            >

            Baca Selengkapnya

            </a>



            </div>


        </article>


        `;



    });



}
