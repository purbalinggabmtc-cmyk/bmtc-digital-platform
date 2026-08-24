// =====================================
// BMTC FINANCE MANAGEMENT
// =====================================



let categories = [];




// =====================================
// LOAD CATEGORIES
// =====================================


async function loadCategories(type = null){


    let query = client
        .from("categories")
        .select("*")
        .order("id");


    if(type){

        query = query.eq(
            "type",
            type
        );

    }



    const {data,error} = await query;



    if(error){

        console.log(error.message);

        return;

    }



    categories = data;



    const select = document.getElementById(
        "category-id"
    );



    select.innerHTML = `

    <option value="">
    Pilih Kategori
    </option>

    `;



    data.forEach(item=>{


        select.innerHTML += `

        <option value="${item.id}">

        ${item.code} - ${item.name}

        </option>

        `;


    });


}







// =====================================
// CHANGE TRANSACTION TYPE
// =====================================


document
.getElementById(
"transaction-type"
)
.addEventListener(
"change",
function(){


    loadCategories(
        this.value
    );


});







// =====================================
// LOAD FINANCE SUMMARY
// =====================================


async function loadFinanceSummary(){



const {data,error}=

await client

.from("transactions")

.select(`

amount,

categories(
type
)

`);




if(error){

console.log(error.message);

return;

}





let income=0;

let expense=0;



data.forEach(item=>{


if(
item.categories.type==="income"
){

income += Number(
item.amount
);


}



if(
item.categories.type==="expense"
){

expense += Number(
item.amount
);


}



});




const balance =
income-expense;



document
.getElementById(
"total-income"
)
.innerHTML =
formatMoney(income);



document
.getElementById(
"total-expense"
)
.innerHTML =
formatMoney(expense);



document
.getElementById(
"current-balance"
)
.innerHTML =
formatMoney(balance);



}







// =====================================
// SUBMIT TRANSACTION
// =====================================


document
.getElementById(
"finance-form"
)
.addEventListener(
"submit",
async function(e){


e.preventDefault();




const user =
await client.auth.getUser();




const userId =
user.data.user.id;





let proofUrl = null;



const file =
document
.getElementById(
"proof-file"
)
.files[0];





// UPLOAD FILE


if(file){



const filename =

`finance/${Date.now()}-${file.name}`;




const upload =

await client

.storage

.from(
"bmtc media"
)

.upload(
filename,
file
);





if(upload.error){

alert(
upload.error.message
);

return;

}




const url =

client

.storage

.from(
"bmtc media"
)

.getPublicUrl(
filename
);



proofUrl =
url.data.publicUrl;



}







// INSERT TRANSACTION



const transaction = {


created_by:userId,


category_id:

document

.getElementById(
"category-id"
)

.value,



transaction_date:

document

.getElementById(
"transaction-date"
)

.value,



amount:

Number(

document

.getElementById(
"amount"
)

.value

),



description:

document

.getElementById(
"description"
)

.value,



proof_url:

proofUrl,



status:

"approved"


};







const {error}=

await client

.from(
"transactions"
)

.insert(
transaction
);





if(error){


alert(
error.message
);


return;


}





alert(
"Transaksi berhasil disimpan"
);




this.reset();



loadFinanceSummary();


loadTransactions();



});







// =====================================
// LOAD TRANSACTION LIST
// =====================================



async function loadTransactions(){



const {data,error}=

await client

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





if(error){

console.log(error.message);

return;

}





const table =

document

.getElementById(
"transaction-list"
);





table.innerHTML="";





data.forEach(item=>{



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

${formatMoney(item.amount)}

</td>


<td>

${item.categories.type}

</td>


<td>


<button

onclick="deleteTransaction(${item.id})"

>

Hapus

</button>


</td>


</tr>


`;



});



}







// =====================================
// DELETE TRANSACTION
// =====================================



async function deleteTransaction(id){



if(
!confirm(
"Hapus transaksi ini?"
)

){

return;

}




const {error}=

await client

.from(
"transactions"
)

.delete()

.eq(
"id",
id
);




if(error){

alert(
error.message
);

return;

}



loadFinanceSummary();

loadTransactions();



}







// =====================================
// FORMAT MONEY
// =====================================



function formatMoney(value){



return new Intl.NumberFormat(
"id-ID",
{

style:"currency",

currency:"IDR"

}

)

.format(value);



}







// =====================================
// INIT
// =====================================



loadFinanceSummary();

loadTransactions();

loadCategories();
