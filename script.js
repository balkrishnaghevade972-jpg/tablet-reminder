let reminders = [];

let editId = null;

let currentAudio = null;



if ("Notification" in window) {

Notification.requestPermission();

}



async function saveReminder() {

let tablet =
document.getElementById(
"tablet"
).value;

let message =
document.getElementById(
"message"
).value;

let time =
document.getElementById(
"time"
).value;

let toneInput =
document.getElementById(
"tone"
);

let tone = "";

if (
toneInput.files[0]
) {

tone =
URL.createObjectURL(
toneInput.files[0]
);

}



if (
!tablet ||
!message ||
!time
) {

alert(
"Fill all fields"
);

return;

}



let data = {

tablet,
message,
time,
tone

};



try {



if (editId) {



await fetch(

"http://localhost:5000/reminders/edit/" +

editId,

{

method:
"PUT",

headers: {

"Content-Type":

"application/json"

},

body:

JSON.stringify(
data
)

}

);



editId = null;

}



else {



await fetch(

"http://localhost:5000/reminders/add",

{

method:
"POST",

headers: {

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



}



catch (e) {



reminders.push({

...data,

status:

"Upcoming",

notified:

false

});



localStorage.setItem(

"reminders",

JSON.stringify(
reminders
)

);

}



clearInputs();

loadReminders();

}



function clearInputs() {

document.getElementById(
"tablet"
).value = "";

document.getElementById(
"message"
).value = "";

document.getElementById(
"time"
).value = "";

document.getElementById(
"tone"
).value = "";

}



function displayReminder() {

let list =
document.getElementById(
"list"
);



if (
reminders.length === 0
) {

list.innerHTML =

`

<div class="card">

🌸 No reminders yet

</div>

`;

return;

}



let output = "";



reminders.forEach(

(r, index) => {



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

"editReminder(

'${r._id || index}'

)"

>

✏ Edit

</button>



<button

onclick=

"markDone(

${index}

)"

>

✅ Taken

</button>



<button

onclick=

"deleteReminder(

${index}

)"

>

🗑 Delete

</button>

</div>

</div>

`;

}

);



list.innerHTML =

output;

}



async function loadReminders() {

try {

let res =

await fetch(

"http://localhost:5000/reminders/all"

);

reminders =

await res.json();

}

catch {

reminders =

JSON.parse(

localStorage.getItem(
"reminders"
)

)

||

[];

}



displayReminder();

}



async function deleteReminder(index) {

try {

if (

reminders[index]._id

) {



await fetch(

"http://localhost:5000/reminders/delete/" +

reminders[index]._id,

{

method:

"DELETE"

}

);



}



else {



reminders.splice(

index,

1

);



localStorage.setItem(

"reminders",

JSON.stringify(
reminders
)

);

}



}

catch {}



loadReminders();

}



function editReminder(id) {

let reminder =

reminders.find(

r =>

String(

r._id ||

reminders.indexOf(
r
)

)

===

String(
id
)

);



if (
!reminder
)
return;



document.getElementById(
"tablet"
).value =

reminder.tablet;



document.getElementById(
"message"
).value =

reminder.message;



document.getElementById(
"time"
).value =

reminder.time;



editId =

reminder._id ||

null;

}



async function markDone(index){

try{

reminders[index].status =
"Taken";

if(
reminders[index]._id
){

await fetch(

"http://localhost:5000/reminders/edit/" +

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

}

else{

localStorage.setItem(

"reminders",

JSON.stringify(
reminders
)

);

}

loadReminders();

}

catch(err){

console.log(err);

alert(
"Unable to update status"
);

}

}



function checkReminder() {

let now =

new Date();



let currentTime =

String(
now.getHours()
)

.padStart(
2,
"0"
)

+

":"

+

String(
now.getMinutes()
)

.padStart(
2,
"0"
);



reminders.forEach(

r => {



if (

r.time ===

currentTime

&&

!r.notified

) {



if (

Notification.permission

===

"granted"

) {



new Notification(

"💊 Tablet Reminder",

{

body:

r.tablet +

" - " +

r.message

}

);

}



if (
r.tone
) {



currentAudio =

new Audio(
r.tone
);



currentAudio.play();

}



r.notified =

true;

}



}

);

}



function stopReminder() {

if (
currentAudio
) {

currentAudio.pause();

currentAudio.currentTime = 0;

}

}



function snoozeReminder() {

stopReminder();

alert(
"Snoozed 5 minutes"
);

}



setInterval(
checkReminder,
1000
);

loadReminders();