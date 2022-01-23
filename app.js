//jshint esversion:6

const express= require("express");
const bodyParser = require("body-parser");
const mongoose= require("mongoose");
const app= express();

app.set('view engine', "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB",{  useUnifiedTopology: true,
useNewUrlParser: true});

const itemsSchema = new mongoose.Schema({
          name: String,
});

const Item = mongoose.model("item",itemsSchema);

const Item1= new Item({
    name : "Cooking"
});

const Item2 = new Item({
    name :"Welcome to To dO LIST "
});
const Item3 = new Item({
    name : "Listen Class"
});

const defaultItems = [Item1,Item2,Item3];

const listSchema={
    name:String,
    items:[itemsSchema],
};

const List =mongoose.model('List',listSchema);

app.get("/",function(req,res){

   Item.find({},function(err,founditems){

    if(founditems.length===0){
       
        Item.insertMany(defaultItems,function(err){
            if(err){
                console.log("its's error");
            }else{
                console.log("Succesful");
            }
        
        }); 
          res.redirect("/");
    }else{
        res.render("list",{kindOfDay:"Today",newListItems: founditems  });
    }
   
   });
      
    
});
     

 app.post("/",function(req,res){
    let itemName =req.body.newItem;
    const item = new Item({
        name: itemName
    });

    item.save();

    res.redirect("/");

}); 

app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId,function(err){
        if(err){
            console.log("Error");
        }else{
            console.log("Succesful");
            res.redirect("/");
        }
    });
});

app.get("/:customListName",function(req,res){
    const customListName=(req.params.customListName);
    List.findOne({name:customListName},function(err, foundlist){
        if(!err){
            if(!foundlist){
                console.log("Doesn't exist");
            }else{
                console.log("Exists");
            }
        };
    const list=new List({
        name :customListName,
        items: defaultItems,
    });
    //list.save();
});

app.get("/about",function(req,res){
    res.render("about");
});

app.listen(3000,function(){
    console.log("Server Started at 3000");
});