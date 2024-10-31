const mongoose=require("mongoose");
const Chat=require("./model/chat.js");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
 }
 
 main()
 .then(()=>{
     console.log("connected");
 })
 .catch((err)=>{
     console.log(err);
 })
 
let allChats=[
    {
        from:"sahenoor",
        to:"sakir",
        message:"i love you papa",
        created_at:new Date(),
    },
    {
        from:"sakir",
        to:"sahenoor",
        message:"i love you papa 2",
        created_at:new Date(),
    },
    {
        from:"rehana",
        to:"arafat",
        message:"how are you my son",
        created_at:new Date(),
    },
    {
        from:"arafat",
        to:"rehana",
        message:"fine",
        created_at:new Date(),
    }
]

Chat.insertMany(allChats)
.then((res)=>{
    console.log("inserted");
})
.catch((err)=>{
    console.log(err);
})