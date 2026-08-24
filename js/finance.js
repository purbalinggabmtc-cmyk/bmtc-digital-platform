// ======================================
// BMTC FINANCE SYSTEM V2
// WITH AUDIT LOG
// ======================================



let currentUser = null;



// ======================================
// CHECK FINANCE ACCESS
// ======================================


async function checkFinanceAccess(){


    const {

        data

    } = await client.auth.getUser();



    if(!data.user){

        window.location.href="login.html";

        return false;

    }



    currentUser = data.user;



    const {data:profile,error} =

    await client

    .from("profiles")

    .select("finance_role")

    .eq(
        "id",
        currentUser.id
    )

    .single();




    if(error || !profile || profile.finance_role !== "finance_admin"){


        alert(
            "Anda tidak memiliki akses keuangan"
        );


        window.location.href="admin.html";


        return false;


    }



    return true;


}







// ======================================
// LOAD CATEGORY
// ======================================


async function loadCategories(type=null, target="category-id"){



    let query =

    client

    .from("categories")

    .select("*")

    .order("id");




    if(type){

        query=query.eq(
            "type",
            type
        );

    }



    const {data,error}=

    await query;



    if(error){

        console.log(error);

        return;

    }



    const select =

    document.getElementById(target);



    select.innerHTML="";



    data.forEach(item=>{


        select.innerHTML += `

        <option value="${item.id}">

        ${item.code} - ${item.name}

        </option>

        `;


    });


}







// ======================================
// TYPE CHANGE
// ======================================


document
.getElementById("transaction-type")
?.addEventListener(
"change",
function(){


    loadCategories(
        this.value
    );


});







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

)

.format(value);



}







// ======================================
// SUMMARY
// ======================================


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

console.log(error);

return;

}




let income=0;

let expense=0;



data.forEach(item=>{


if(item.categories.type==="income"){

income += Number(item.amount);

}



if(item.categories.type==="expense"){

expense += Number(item.amount);

}


});




document
.getElementById("total-income")
.innerHTML =
formatMoney(income);



document
.getElementById("total-expense")
.innerHTML =
formatMoney(expense);



document
.getElementById("current-balance")
.innerHTML =
formatMoney(
income-expense
);



}







// ======================================
// ADD TRANSACTION
// ======================================


document
.getElementById("finance-form")
?.addEventListener(
"submit",
async function(e){


e.preventDefault();




const file =

document
.getElementById("proof-file")
.files[0];



let proofUrl=null;




if(file){


const filename =

`finance/${Date.now()}-${file.name}`;



const upload =

await client

.storage

.from("bmtc media")

.upload(
filename,
file
);



if(upload.error){

alert(upload.error.message);

return;

}




const url =

client

.storage

.from("bmtc media")

.getPublicUrl(filename);



proofUrl =
url.data.publicUrl;


}






const transaction={


created_by:
currentUser.id,


category_id:

document
.getElementById("category-id")
.value,



transaction_date:

document
.getElementById("transaction-date")
.value,



amount:

Number(
document
.getElementById("amount")
.value
),



description:

document
.getElementById("description")
.value,



proof_url:

proofUrl,



status:
"approved"



};





const {error}=

await client

.from("transactions")

.insert(transaction);




if(error){

alert(error.message);

return;

}



alert(
"Transaksi berhasil"
);



this.reset();



loadFinanceSummary();

loadTransactions();



});







// ======================================
// LOAD TRANSACTIONS
// ======================================


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
"created_at",
{
ascending:false
}
);





if(error){

console.log(error);

return;

}




const table =

document
.getElementById("transaction-list");



table.innerHTML="";




data.forEach(item=>{


table.innerHTML += `


<tr>


<td>${item.transaction_date}</td>


<td>${item.categories.name}</td>


<td>${item.description ?? "-"}</td>


<td>${formatMoney(item.amount)}</td>


<td>${item.categories.type}</td>



<td>


<button onclick="openEditModal(${item.id})">

Edit

</button>



<button onclick="deleteTransaction(${item.id})">

Hapus

</button>



</td>


</tr>


`;



});



}







// ======================================
// OPEN EDIT MODAL
// ======================================


async function openEditModal(id){



const {data,error}=

await client

.from("transactions")

.select("*")

.eq("id",id)

.single();





if(error){

alert(error.message);

return;

}



document
.getElementById("edit-id")
.value=id;



document
.getElementById("edit-date")
.value=data.transaction_date;



document
.getElementById("edit-amount")
.value=data.amount;



document
.getElementById("edit-description")
.value=data.description;



await loadCategories(
null,
"edit-category"
);



document
.getElementById("edit-category")
.value=data.category_id;



document
.getElementById("edit-modal")
.style.display="flex";



}







function closeEditModal(){


document
.getElementById("edit-modal")
.style.display="none";


}







// ======================================
// UPDATE TRANSACTION + LOG
// ======================================


async function updateTransaction(){



const id =

document
.getElementById("edit-id")
.value;





const {data:old,error}=

await client

.from("transactions")

.select("*")

.eq("id",id)

.single();





if(error){

alert(error.message);

return;

}





// SAVE LOG FIRST


await client

.from("transaction_logs")

.insert({

transaction_id:id,

changed_by:currentUser.id,

old_category_id:old.category_id,

new_category_id:

document
.getElementById("edit-category")
.value,

old_amount:old.amount,

new_amount:

Number(
document
.getElementById("edit-amount")
.value
),


old_description:old.description,

new_description:

document
.getElementById("edit-description")
.value,


old_transaction_date:
old.transaction_date,


new_transaction_date:

document
.getElementById("edit-date")
.value


});







let proofUrl=old.proof_url;





const file=

document
.getElementById("edit-proof")
.files[0];




if(file){



const filename=

`finance/${Date.now()}-${file.name}`;



const upload=

await client

.storage

.from("bmtc media")

.upload(
filename,
file
);



if(upload.error){

alert(upload.error.message);

return;

}




const url=

client

.storage

.from("bmtc media")

.getPublicUrl(filename);



proofUrl=url.data.publicUrl;


}







const {error:updateError}=

await client

.from("transactions")

.update({

category_id:

document
.getElementById("edit-category")
.value,


transaction_date:

document
.getElementById("edit-date")
.value,


amount:

Number(
document
.getElementById("edit-amount")
.value
),


description:

document
.getElementById("edit-description")
.value,


proof_url:proofUrl


})

.eq(
"id",
id
);






if(updateError){

alert(updateError.message);

return;

}



alert(
"Transaksi diperbarui"
);



closeEditModal();


loadFinanceSummary();

loadTransactions();



}







// ======================================
// DELETE
// ======================================


async function deleteTransaction(id){



if(!confirm(
"Hapus transaksi ini?"
)) return;




const {error}=

await client

.from("transactions")

.delete()

.eq(
"id",
id
);




if(error){

alert(error.message);

return;

}



loadFinanceSummary();

loadTransactions();


}







// ======================================
// INIT
// ======================================


(async()=>{


const access =
await checkFinanceAccess();



if(access){


loadCategories();

loadFinanceSummary();

loadTransactions();


}



})();
