const router =
require("express").Router();

const Reminder =
require("../models/Reminder");

router.post(

"/add",

async(req,res)=>{

await Reminder.create(

req.body

);

res.send(
"Saved"
);

}

);

router.get(

"/all",

async(req,res)=>{

res.send(

await Reminder.find()

);

}

);

router.delete(

"/delete/:id",

async(req,res)=>{

await Reminder.findByIdAndDelete(

req.params.id

);

res.send(
"Deleted"
);

}
);
 
router.put(

"/edit/:id",

async(req,res)=>{

await Reminder.findByIdAndUpdate(

req.params.id,

req.body

);

res.send(
"Updated"
);

}

);

module.exports =
router;