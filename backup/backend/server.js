require("dotenv").config();

const express =
require("express");

const mongoose =
require("mongoose");

const cors=
require("cors");

const app =
express();

app.use(cors());

app.use(
express.json()    
);
app.use(
"/reminders",

require(
"./routes/reminder"
)
);

mongoose.connect(
process.env.DB_URL
)

.then(()=>{

console.log(
"Database Connected"
);

})

.catch(()=>{

console.log(
"Connection Failed"
);

});

app.get(

"/",

(req,res)=>{

res.send(
"Server Running"
);

}

);

app.listen(

5000,

()=>{

console.log(
"Server Started"
);

}

);