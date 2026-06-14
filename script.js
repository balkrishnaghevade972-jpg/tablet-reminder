let reminders=[];
let editId=null;
let currentAudio=null;

const API=
"https://tablet-reminder-backend-zpki.onrender.com/reminders";

if("Notification" in window){

window.addEventListener(

"click",

()=>{

Notification.requestPermission();

},

{once:true}

);

}

async function saveReminder(){

let tablet=
document.getElementById("tablet").value;

let message=
document.getElementById("message").value;

let time=
document.getElementById("time").value;

if(
!tablet||
!message||
!time
){

alert("Fill all fields");

return;

}

const data={

tablet,
message,
time,

tone:
"https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg",

status:
"Upcoming"

};

try{

if(editId){

await fetch(

API+
"/edit/"+editId,

{

method:"PUT",

headers:{
"Content-Type":
"application/json"
},

body:
JSON.stringify(data)

}

);

editId=null;

}

else{

await fetch(

API+
"/add",

{

method:"POST",

headers:{
"Content-Type":
"application/json"
},

body:
JSON.stringify(data)

}

);

}

clearInputs();

await loadReminders();

alert(
"Reminder Saved"
);

}

catch(err){

console.log(err);

}

}

function clearInputs(){

document.getElementById("tablet").value="";
document.getElementById("message").value="";
document.getElementById("time").value="";

}

async function loadReminders(){

try{

const res=

await fetch(

API+"/all"

);

reminders=

await res.json();

displayReminder();

}

catch(err){

console.log(err);

}

}

function displayReminder(){

const list=
document.getElementById(
"list"
);

if(
!reminders.length
){

list.innerHTML=

"<div class='card'>🌸 No reminders</div>";

return;

}

list.innerHTML=

reminders.map(

(r,index)=>`

<div class="card">

<h3>

💊 ${r.tablet}

</h3>

<p>

${r.message}

</p>

<p>

⏰ ${r.time}

</p>

<p>

${r.status||

"Upcoming"}

</p>

<button onclick="editReminder('${r._id}')">

✏ Edit

</button>

<button onclick="markDone(${index})">

✅ Taken

</button>

<button onclick="deleteReminder(${index})">

🗑 Delete

</button>

</div>

`

).join("");

}

function editReminder(id){

const r=

reminders.find(

x=>

x._id===id

);

if(!r)
return;

document.getElementById(
"tablet"
).value=
r.tablet;

document.getElementById(
"message"
).value=
r.message;

document.getElementById(
"time"
).value=
r.time;

editId=id;

}

async function deleteReminder(index){

await fetch(

API+

"/delete/"+

reminders[index]._id,

{

method:
"DELETE"

}

);

loadReminders();

}

async function markDone(index){

reminders[index].status=
"Taken";

await fetch(

API+

"/edit/"+

reminders[index]._id,

{

method:
"PUT",

headers:{

"Content-Type":
"application/json"

},

body:

JSON.stringify(
reminders[index]
)

}

);

loadReminders();

}

async function checkReminder(){

await loadReminders();

let now=
new Date();

let current=

now

.toLocaleTimeString(

"en-GB",

{

hour:
"2-digit",

minute:
"2-digit",

hour12:
false

}

);

console.log(
"TIME:",
current
);

for(

let r of reminders

){

if(

r.time===current

&&

r.status!=="Taken"

&&

!r.notified

){

console.log(
"TRIGGERED"
);

try{

if(

Notification.permission===

"granted"

){

new Notification(

"💊 Tablet Reminder",

{

body:

## `${r.tablet}

${r.message}`

}

);

}

currentAudio=

new Audio(

r.tone

);

await currentAudio.play();

alert(

`💊 Take ${r.tablet}`

);

r.notified=true;

}

catch(err){

console.log(err);

}

}

}

}

function stopReminder(){

if(
currentAudio
){

currentAudio.pause();

currentAudio.currentTime=0;

}

}

setInterval(

checkReminder,

5000

);

loadReminders();
