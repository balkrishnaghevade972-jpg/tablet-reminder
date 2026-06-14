async function loadData(){

let res =
await fetch(
"http://localhost:5000/reminders/all"
);

let data =
await res.json();

let output="";

data.forEach((r)=>{

output+=`

<div class="card">

<h2>${r.tablet}</h2>

<p>${r.message}</p>

<p>${r.time}</p>

<p>${r.tone}</p>

</div>

`;

});

document
.getElementById(
"users"
)
.innerHTML=
output;

}

loadData();