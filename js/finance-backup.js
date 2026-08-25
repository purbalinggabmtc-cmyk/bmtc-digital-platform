// ======================================
// BMTC FINANCE BACKUP SYSTEM
// JSON + EXCEL BACKUP
// ======================================


let backupUser = null;





// ======================================
// CHECK ACCESS
// ======================================


async function checkBackupAccess(){


    const {data}=

    await client.auth.getUser();




    if(!data.user){


        window.location.href="login.html";


        return false;


    }





    backupUser=data.user;






    const {data:profile,error}=

    await client

    .from("profiles")

    .select("finance_role")

    .eq(
        "id",
        backupUser.id
    )

    .single();







    if(

        error ||

        !profile ||

        profile.finance_role !== "finance_admin"

    ){


        alert(
            "Anda tidak memiliki akses backup"
        );


        window.location.href="admin.html";


        return false;


    }





    return true;



}









// ======================================
// CREATE BACKUP LOG
// ======================================


async function saveBackupHistory(
    type,
    filename
){



    await client

    .from("backup_history")

    .insert({

        created_by:
        backupUser.id,


        backup_type:
        type,


        file_name:
        filename


    });



}









// ======================================
// GET ALL DATA
// ======================================


async function getBackupData(){



const transactions =

await client

.from("transactions")

.select(`

*,

categories(

name,

code,

type

)

`);





const logs =

await client

.from("transaction_logs")

.select(`

*,

profiles(

name

)

`);





const categories =

await client

.from("categories")

.select("*");






return {


transactions:
transactions.data ?? [],


logs:
logs.data ?? [],


categories:
categories.data ?? []

};


}









// ======================================
// DOWNLOAD FILE
// ======================================


function downloadFile(
content,
filename,
type
){



const blob =

new Blob(
[content],
{
type:type
}
);



const url =

URL.createObjectURL(blob);




const link =

document.createElement(
"a"
);



link.href=url;


link.download=filename;


link.click();




URL.revokeObjectURL(url);



}









// ======================================
// BACKUP JSON
// ======================================


async function backupJSON(){



const data =

await getBackupData();





const backup = {


backup_name:

"BMTC Finance Backup",


backup_date:

new Date()
.toISOString(),



transactions:

data.transactions,



transaction_logs:

data.logs,



categories:

data.categories



};






const filename =

`BMTC-Finance-Backup-${Date.now()}.json`;







downloadFile(

JSON.stringify(
backup,
null,
2
),

filename,

"application/json"

);






await saveBackupHistory(

"JSON",

filename

);





loadBackupHistory();



}









// ======================================
// BACKUP EXCEL
// ======================================


async function backupExcel(){



const data =

await getBackupData();






const workbook =

XLSX.utils.book_new();









// TRANSACTIONS


const transactionSheet =

XLSX.utils.json_to_sheet(

data.transactions.map(item=>({


ID:item.id,


Tanggal:item.transaction_date,


Kategori:
item.categories?.name,


Jenis:
item.categories?.type,


Nominal:
item.amount,


Deskripsi:
item.description


}))

);





XLSX.utils.book_append_sheet(

workbook,

transactionSheet,

"Transactions"

);









// LOGS


const logSheet =

XLSX.utils.json_to_sheet(

data.logs.map(item=>({


ID:item.id,


Transaction:
item.transaction_id,


Nominal_Lama:
item.old_amount,


Nominal_Baru:
item.new_amount,


User:
item.profiles?.name,


Tanggal:
item.changed_at


}))

);





XLSX.utils.book_append_sheet(

workbook,

logSheet,

"Audit Logs"

);









// CATEGORY


const categorySheet =

XLSX.utils.json_to_sheet(

data.categories

);




XLSX.utils.book_append_sheet(

workbook,

categorySheet,

"Categories"

);







const filename =

`BMTC-Finance-Backup-${Date.now()}.xlsx`;






XLSX.writeFile(

workbook,

filename

);






await saveBackupHistory(

"Excel",

filename

);





loadBackupHistory();



}









// ======================================
// LOAD BACKUP HISTORY
// ======================================


async function loadBackupHistory(){





const {data,error}=

await client

.from("backup_history")

.select(`

*,

profiles(

name

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







const table=

document

.getElementById(
"backup-history"
);





table.innerHTML="";







data.forEach(item=>{



table.innerHTML += `


<tr>


<td>

${new Date(
item.created_at
)
.toLocaleString(
"id-ID"
)}

</td>


<td>

${item.backup_type}

</td>


<td>

${item.file_name}

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

await checkBackupAccess();




if(access){


loadBackupHistory();


}



})();
