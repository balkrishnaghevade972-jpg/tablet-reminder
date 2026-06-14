let reminders =

JSON.parse(
localStorage.getItem("reminders")
) || [];
let editId = null;
let currentAudio = null;
let editIndex = -1;

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

    if (editIndex === -1) {

    reminders.push({
        tablet: tablet,
        message: message,
        time: time,
        tone: tone,
        notified: false
    });

} else {

    reminders[editIndex] = {
        tablet: tablet,
        message: message,
        time: time,
        tone: tone,
        notified: false
    };

    editIndex = -1;
}
   if (editId) {

await fetch(

"http://localhost:5000/reminders/edit/" + editId,

{

method: "PUT",

headers: {

"Content-Type":
"application/json"

},

body:

JSON.stringify({

tablet,
message,
time,
tone

})

}

);

editId = null;

}

else {

await fetch(

"http://localhost:5000/reminders/add",

{

method: "POST",

headers: {

"Content-Type":
"application/json"

},

body:

JSON.stringify({

tablet,
message,
time,
tone

})

}

);

}

loadReminders();

    displayReminder();
    document.getElementById("tablet").value = "";
document.getElementById("message").value = "";
document.getElementById("time").value = "";
document.getElementById("tone").value = "";
}

function displayReminder() {

    let output = "";

    reminders.forEach((r, index) =>  {

   output += `
<div class="card">

<h3>💊 ${r.tablet}</h3>

<p>${r.message}</p>

<p>⏰ ${r.time}</p>

<p>Status:
${r.status || "Upcoming"}
</p>

<button
class="edit-btn"
onclick="editReminder('${r._id}')">
Edit
</button>

<button
class="delete-btn"
onclick="deleteReminder(${index})">
Delete
</button>

<button
onclick="markDone(${index})">
Done
</button>

</div>
`;

    });

    document.getElementById("list").innerHTML = output;
}

async function deleteReminder(index){

let id =

reminders[index]._id;

await fetch(

"http://localhost:5000/reminders/delete/"+id,

{

method:"DELETE"

}

);

loadReminders();

}

async function markDone(index){

let id =
reminders[index]._id;

await fetch(

"http://localhost:5000/reminders/edit/"+id,

{

method:"PUT",

headers:{
"Content-Type":
"application/json"
},

body:

JSON.stringify({

status:
"Taken"

})

}

);

loadReminders();

}

function editReminder(id){

let reminder =

reminders.find(

r=>

r._id===id

);

tablet.value =
reminder.tablet;

message.value =
reminder.message;

time.value =
reminder.time;

editId=id;

}

function editReminder(id){

let reminder = reminders.find(
r => r._id === id
);

document.getElementById("tablet").value =
reminder.tablet;

document.getElementById("message").value =
reminder.message;

document.getElementById("time").value =
reminder.time;

editId = id;

}

function checkReminder() {

let now = new Date();

let currentTime =

String(now.getHours())
.padStart(2,"0")

+

":"

+

String(now.getMinutes())
.padStart(2,"0");

reminders.forEach((r)=>{

if(

r.time === currentTime &&

!r.notified

){

if(

Notification.permission ===
"granted"

){

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

if(r.tone){

currentAudio =
new Audio(r.tone);

currentAudio.play();

}

r.notified = true;

}

});

}
async function loadReminders(){

let res =

await fetch(
"http://localhost:5000/reminders/all"
);

reminders =
await res.json();

reminders.forEach(

r=>{

r.notified = false;

}

);

displayReminder();

}

function stopReminder(){

if(currentAudio){

currentAudio.pause();

currentAudio.currentTime = 0;

}

}

function snoozeReminder(){

stopReminder();

let future =

new Date(
Date.now()
+
5*60000
);

let hour =

String(
future.getHours()
)

.padStart(
2,
"0"
);

let minute =

String(
future.getMinutes()
)

.padStart(
2,
"0"
);

reminders.forEach(

r=>{

if(r.notified){

r.time =
hour
+
":"
+
minute;

r.notified =
false;

}

}

);

displayReminder();

}
setInterval(checkReminder, 1000);
loadReminders();