const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const Chat=require("./model/chat.js");
const methodOverride=require("method-override");
const expressError=require("./eror/expressError");


app.set("views",path.join(__dirname,"views"));
app.set("view engise","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

app.listen(8080,()=>{
    console.log("server start");
});

function asyncWrap(fn){

    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    }
}

app.get("/",(req,res)=>{
    res.send("on root ");
})

//index route
app.get("/chats",asyncWrap(async(req,res)=>{
    
        let chats=await Chat.find();
        res.render("index.ejs",{chats})
    
}))

//create chat route

app.get("/chats/new",(req,res)=>{
    res.render("new.ejs");
})

app.post("/chats",asyncWrap(async(req,res,next)=>{
   
    
        let {from,message,to}=req.body;
        const chat1=new Chat({
            from:from,
            message:message,
            to:to,
            created_at:new Date(),
        });
    
        await chat1.save()
    

    
    res.redirect("/chats");
}));

//edit route

app.get("/chats/:id/edit",asyncWrap(async(req,res)=>{
        let{id}=req.params;
        let chat=await Chat.findById(id);
        res.render("edit.ejs",{chat})
}));

app.patch("/chats/:id",asyncWrap(async(req,res)=>{

        let {id}=req.params;
        const {message}=req.body;
       await Chat.updateOne({_id:id},{message:message,updated_at: new Date()},{runValidators:true,new:true});
    
       res.redirect("/chats");
    
}));

//delete route

app.delete("/chats/:id",asyncWrap(((req,res)=>{
    
        let {id}=req.params;

        Chat.deleteOne({_id:id})
    
            res.redirect("/chats");
    
})));

//show 

app.get("/chats/:id",asyncWrap(async(req,res,next)=>{
    
        let {id}=req.params;
        
        let c= await Chat.findById(id)
     
         if(!c){
             next(new expressError(404,"chat not found"));
         }
         res.render("show.ejs",{c});
    
    
}));

function validation(err){
    console.log("this was validation error",err.message);
    return err;
}
app.use((err,req,res,next)=>{
    if(err.name=="ValidationError"){
      err=validation(err);
    }
    next(err);
})
//error handler

app.use((err,req,res,next)=>{
    let {status=500,message="error occured"}=err;
    res.status(status).send(message);
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