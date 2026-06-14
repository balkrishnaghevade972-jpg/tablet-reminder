let reminders = [];
let editId = null;
let currentAudio = null;

const API =
"https://tablet-reminder-backend-zpki.onrender.com/reminders";

if ("Notification" in window) {
Notification.requestPermission();
}

async function saveReminder() {

let tablet =
document.getElementById("tablet").value;

let message =
document.getElementById("message").value;

let time =
document.getElementById("time").value;

let toneFile =
document.getElementById("tone").files[0];

let tone = "";

if (toneFile) {
tone =
URL.createObjectURL(toneFile);
}

if(
!tablet ||
!message ||
!time
){
alert("Fill all fields");
return;
}

let data = {
tablet,
message,
time,
tone
};

try{

if(editId){

await fetch(

API +
"/edit/" +
editId,

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

API +
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

loadReminders();

}

catch(err){

console.log(err);

alert(
"Unable to save reminder"
);

}

}

function clearInputs(){

document.getElementById(
"tablet"
).value="";

document.getElementById(
"message"
).value="";

document.getElementById(
"time"
).value="";

document.getElementById(
"tone"
).value="";

}

function displayReminder(){

let list =
document.getElementById(
"list"
);

if(
reminders.length===0
){

list.innerHTML=`

<div class="card">
🌸 No reminders yet
</div>

`;

return;

}

let output="";

reminders.forEach(

(r,index)=>{

output += `

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
Status:
${r.status || "Upcoming"}
</p>

<div class="action-row">

<button
onclick=
"editReminder('${r._id}')"

>

✏ Edit </button>

<button
onclick=
"markDone(${index})"

>

✅ Taken </button>

<button
onclick=
"deleteReminder(${index})"

>

🗑 Delete </button>

</div>

</div>

`;

}

);

list.innerHTML=
output;

}

async function loadReminders(){

try{

let res =
await fetch(
API +
"/all"
);

reminders =
await res.json();

}

catch(err){

console.log(err);

reminders=[];

}

displayReminder();

}

async function deleteReminder(index){

try{

await fetch(

API +
"/delete/" +
reminders[index]._id,

{

method:
"DELETE"

}

);

loadReminders();

}

catch(err){

console.log(err);

}

}

function editReminder(id){

let reminder =

reminders.find(

r=>

r._id===id

);

if(
!reminder
)
return;

document.getElementById(
"tablet"
).value=
reminder.tablet;

document.getElementById(
"message"
).value=
reminder.message;

document.getElementById(
"time"
).value=
reminder.time;

editId=id;

}

async function markDone(index){

try{

await fetch(

API +
"/edit/" +
reminders[index]._id,

{

method:"PUT",

headers:{
"Content-Type":
"application/json"
},

body:

JSON.stringify({

tablet:
reminders[index].tablet,

message:
reminders[index].message,

time:
reminders[index].time,

tone:
reminders[index].tone,

status:
"Taken"

})

}

);

loadReminders();

}

catch(err){

console.log(err);

}

}

function checkReminder(){

let now=
new Date();

let currentTime=

String(
now.getHours()
)

.padStart(
2,
"0"
)

*

":"

*

String(
now.getMinutes()
)

.padStart(
2,
"0"
);

reminders.forEach(

r=>{

if(

r.time===currentTime &&

!r.notified

){

if(

Notification.permission===

"granted"

){

new Notification(

"💊 Tablet Reminder",

{

body:

r.tablet+

" - "+

r.message

}

);

}

if(
r.tone
){

currentAudio=

new Audio(
r.tone
);

currentAudio.play();

}

r.notified=true;

}

}

);

}

function stopReminder(){

if(
currentAudio
){

currentAudio.pause();

currentAudio.currentTime=0;

}

}

function snoozeReminder(){

stopReminder();

alert(
"Snoozed for 5 minutes"
);

}

setInterval(
checkReminder,
1000
);

loadReminders();
