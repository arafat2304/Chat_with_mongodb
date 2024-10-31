const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const Chat=require("./model/chat.js");
const methodOverride=require("method-override");


app.set("views",path.join(__dirname,"views"));
app.set("view engise","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

app.listen(8080,()=>{
    console.log("server start");
});

app.get("/",(req,res)=>{
    res.send("on root ");
})

//index route
app.get("/chats",async(req,res)=>{
    let chats=await Chat.find();
    res.render("index.ejs",{chats})
})

//create chat route

app.get("/chats/new",(req,res)=>{
    res.render("new.ejs");
})

app.post("/chats",(req,res)=>{
    let {from,message,to}=req.body;

    const chat1=new Chat({
        from:from,
        message:message,
        to:to,
        created_at:new Date(),
    });

    chat1.save()
    .then(()=>{
        console.log("inserted")
    })
    res.redirect("/chats");
})

//edit route

app.get("/chats/:id/edit",async(req,res)=>{
    let{id}=req.params;
    let chat=await Chat.findById(id);
    res.render("edit.ejs",{chat})
})

app.patch("/chats/:id",async(req,res)=>{
    let {id}=req.params;
    const {message}=req.body;
   await Chat.updateOne({_id:id},{message:message,updated_at: new Date()},{runValidators:true,new:true});

   res.redirect("/chats");

})

//delete route

app.delete("/chats/:id",(req,res)=>{
    let {id}=req.params;

    Chat.deleteOne({_id:id})
    .then(()=>{
        res.redirect("/chats");
    })
})

//DB
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