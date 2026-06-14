const mongoose =
require("mongoose");

const reminderSchema =
new mongoose.Schema({

tablet:String,

message:String,

time:String,

tone:String,

status:{
type:String,
default:"Upcoming"
}

});

module.exports =

mongoose.model(

"Reminder",

reminderSchema

);