app.post("/",function(req,res){
    let item =req.body.newItem;
    item.push(item);
    res.redirect("/");
});