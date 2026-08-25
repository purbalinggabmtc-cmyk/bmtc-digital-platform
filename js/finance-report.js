// ======================================
// BMTC FINANCE REPORT SYSTEM V2
// WITH PDF EXPORT
// ======================================


let reportUser = null;

let currentReportData = [];




// ======================================
// CHECK FINANCE ACCESS
// ======================================


async function checkReportAccess(){


    const {data} =

    await client.auth.getUser();



    if(!data.user){

        window.location.href="login.html";

        return false;

    }



    reportUser = data.user;



    const {data:profile,error}=

    await client

    .from("profiles")

    .select("finance_role")

    .eq(
        "id",
        reportUser.id
    )

    .single();





    if(
        error ||
        !profile ||
        profile.finance_role !== "finance_admin"
    ){


        alert(
            "Anda tidak memiliki akses laporan keuangan"
        );


        window.location.href="admin.html";


        return false;


    }



    return true;


}








// ======================================
// FORMAT MONEY
// ======================================


function formatMoney(value){


    return new Intl.NumberFormat(
        "id-ID",
        {

            style:"currency",

            currency:"IDR"

        }

    ).format(value);


}








// ======================================
// LOAD YEAR FILTER
// ======================================


async function loadYearFilter(){



    const {data,error}=

    await client

    .from("transactions")

    .select(
        "transaction_date"
    );




    if(error){

        console.log(error);

        return;

    }




    let years=[];




    data.forEach(item=>{


        const year =

        new Date(
            item.transaction_date
        )
        .getFullYear();



        if(!years.includes(year)){

            years.push(year);

        }


    });





    const select =

    document.getElementById(
        "year-filter"
    );




    years

    .sort(
        (a,b)=>b-a
    )

    .forEach(year=>{


        select.innerHTML += `

        <option value="${year}">
        ${year}
        </option>

        `;


    });


}









// ======================================
// LOAD REPORT
// ======================================


async function loadReport(){



    let query =

    client

    .from("transactions")

    .select(`

        *,

        categories(
            name,
            type
        )

    `)

    .order(
        "transaction_date",
        {
            ascending:false
        }
    );





    const month =

    document

    .getElementById(
        "month-filter"
    )
    .value;





    const year =

    document

    .getElementById(
        "year-filter"
    )
    .value;






    if(year){


        query = query

        .gte(
            "transaction_date",
            `${year}-01-01`
        )

        .lte(
            "transaction_date",
            `${year}-12-31`
        );


    }






    if(
        month &&
        year
    ){



        const lastDay =

        new Date(
            year,
            month,
            0
        )

        .getDate();




        query = query

        .gte(
            "transaction_date",
            `${year}-${month}-01`
        )

        .lte(
            "transaction_date",
            `${year}-${month}-${lastDay}`
        );


    }






    const {data,error}=

    await query;





    if(error){

        console.log(error);

        return;

    }





    currentReportData = data;




    let income = 0;

    let expense = 0;




    const table =

    document

    .getElementById(
        "report-table"
    );



    table.innerHTML="";





    data.forEach(item=>{



        let masuk="-";

        let keluar="-";




        if(
            item.categories.type === "income"
        ){


            income += Number(
                item.amount
            );


            masuk =
            formatMoney(
                item.amount
            );


        }





        if(
            item.categories.type === "expense"
        ){


            expense += Number(
                item.amount
            );


            keluar =
            formatMoney(
                item.amount
            );


        }






        table.innerHTML += `

        <tr>

        <td>
        ${item.transaction_date}
        </td>


        <td>
        ${item.categories.name}
        </td>


        <td>
        ${item.description ?? "-"}
        </td>


        <td>
        ${masuk}
        </td>


        <td>
        ${keluar}
        </td>


        </tr>


        `;



    });







    document

    .getElementById(
        "report-income"
    )

    .innerHTML =

    formatMoney(
        income
    );






    document

    .getElementById(
        "report-expense"
    )

    .innerHTML =

    formatMoney(
        expense
    );






    document

    .getElementById(
        "report-balance"
    )

    .innerHTML =

    formatMoney(
        income-expense
    );





}









// ======================================
// EXPORT PDF
// ======================================


function exportPDF(){



    if(
        currentReportData.length === 0
    ){

        alert(
            "Tidak ada data laporan"
        );

        return;

    }






    const {
        jsPDF
    } = window.jspdf;





    const doc =

    new jsPDF();





    doc.setFontSize(16);


    doc.text(
        "Laporan Keuangan BMTC",
        14,
        20
    );





    doc.setFontSize(11);


    doc.text(
        "Bralink Motor Tiger Club",
        14,
        28
    );







    let rows=[];



    currentReportData.forEach(item=>{


        let income="";

        let expense="";




        if(
            item.categories.type==="income"
        ){

            income =
            item.amount.toLocaleString(
                "id-ID"
            );


        }



        if(
            item.categories.type==="expense"
        ){

            expense =
            item.amount.toLocaleString(
                "id-ID"
            );


        }





        rows.push([

            item.transaction_date,

            item.categories.name,

            item.description ?? "-",

            income,

            expense

        ]);



    });







    doc.autoTable({


        startY:40,


        head:[

            [

            "Tanggal",

            "Kategori",

            "Deskripsi",

            "Masuk",

            "Keluar"

            ]

        ],


        body:rows


    });






    doc.save(
        "Laporan-Keuangan-BMTC.pdf"
    );



}









// ======================================
// INIT
// ======================================


(async()=>{



    const access =

    await checkReportAccess();




    if(access){


        await loadYearFilter();


        loadReport();


    }



})();
