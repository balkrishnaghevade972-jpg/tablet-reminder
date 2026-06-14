let reminders = [];
let editId = null;
let currentAudio = null;

const API =
"https://tablet-reminder-backend-zpki.onrender.com/reminders";

if("Notification" in window){

Notification.requestPermission();

}

async function saveReminder(){

let tablet =
document.getElementById("tablet").value;

let message =
document.getElementById("message").value;

let time =
document.getElementById("time").value;

if(
!tablet ||
!message ||
!time
){

alert(
"Fill all fields"
);

return;

}

let data={

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
"/edit/"+

editId,

{

method:"PUT",

headers:{

"Content-Type":

"application/json"

},

body:

JSON.stringify(
data
)

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

JSON.stringify(
data
)

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

alert(
"Unable to save"
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

}

function displayReminder(){

let list=
document.getElementById(
"list"
);

if(
reminders.length===0
){

list.innerHTML=`

<div class="card">

🌸 No reminders

</div>

`;

return;

}

let html="";

reminders.forEach(

(r,index)=>{

html += `

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

<button
onclick=
"editReminder(
'${r._id}'
)"

>

Edit

</button>

<button
onclick=
"markDone(
${index}
)"

>

Taken

</button>

<button
onclick=
"deleteReminder(
${index}
)"

>

Delete

</button>

</div>

`;

}

);

list.innerHTML=
html;

}

async function loadReminders(){

try{

let res=

await fetch(

API+

"/all"

);

reminders=

await res.json();

displayReminder();

}

catch(err){

console.log(err);

}

}

function editReminder(id){

let r=

reminders.find(

x=>

x._id===id

);

if(
!r
)
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

try{

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

catch(err){

console.log(err);

}

}

async function markDone(index){

try{

reminders[index]

.status=

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

console.log(
currentTime
);

reminders.forEach(

async(r)=>{

if(

String(
r.time
)

===

currentTime

&&

r.status

!==

"Taken"

&&

!r.notified

){

try{

console.log(
"Reminder Triggered"
);

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

currentAudio=

new Audio(

"https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"

);

await currentAudio.play();

alert(

"💊 Take " +

r.tablet

);

r.notified=true;

}

catch(err){

console.log(err);

}

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

setInterval(

checkReminder,

1000

);

loadReminders();
