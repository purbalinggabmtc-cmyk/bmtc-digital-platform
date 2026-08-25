// ======================================
// BMTC FINANCE AUDIT LOG
// ======================================


let auditUser = null;





// ======================================
// CHECK ACCESS
// ======================================


async function checkAuditAccess(){


const {data}=

await client.auth.getUser();



if(!data.user){


window.location.href="login.html";


return false;


}




auditUser=data.user;





const {data:profile,error}=

await client

.from("profiles")

.select("finance_role")

.eq(
"id",
auditUser.id
)

.single();






if(

error ||

!profile ||

profile.finance_role !== "finance_admin"

){



alert(
"Anda tidak memiliki akses audit"
);



window.location.href="admin.html";



return false;


}





return true;


}









// ======================================
// FORMAT MONEY
// ======================================


function money(value){


if(value===null){

return "-";

}


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
// LOAD AUDIT
// ======================================


async function loadAudit(){





const {data,error}=

await client

.from("transaction_logs")

.select(`


*,


transactions(

description,

amount

),


profiles(

name

)


`)

.order(

"changed_at",

{

ascending:false

}

);






if(error){


console.log(error);


return;


}







const table=

document

.getElementById(
"audit-table"
);





table.innerHTML="";








data.forEach(item=>{






let perubahan = `

Nominal:

${money(item.old_amount)}

→

${money(item.new_amount)}

<br>


Tanggal:

${item.old_transaction_date}

→

${item.new_transaction_date}

<br>


Deskripsi:

${item.old_description ?? "-"}

→

${item.new_description ?? "-"}

`;








table.innerHTML += `


<tr>


<td>

${new Date(
item.changed_at
)

.toLocaleString(
"id-ID"
)}

</td>



<td>

${item.transactions?.description ?? "-"}

</td>




<td>

${perubahan}

</td>




<td>

${item.profiles?.name ?? "-"}

</td>



</tr>


`;





});



}









// ======================================
// INIT
// ======================================


(async()=>{


const access =

await checkAuditAccess();



if(access){


loadAudit();


}



})();
