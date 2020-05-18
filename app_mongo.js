const express = require('express');
const mongodb = require('mondodb').MongoClient;
const url="mongodb://192.168.1.103:27017"
const connectOption={
  useNewUrlParser:true,
  useUnifiedTopology:true,
}
const assert=require("assert");
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));


app.get('/', (req, res) => {
  res.render('top.ejs');
});

app.get('/index', (req, res) => {
  mongodb.connect(url, connectOption, (err,db)=>{
    assert.equal(null,err);
    var finds = db.db("test").collection("nodejs_test").find({});
    finds.toArray((err, result)=>{
      if(err) throw err;
      res.render("index.ejs",{items:result});
      db.close();
    });
  });
});

app.get('/new', (req, res) => {
  res.render('new.ejs');
});

app.post('/create', (req, res) => {
  mongodb.connect(url, connectOption, (err,db)=>{
    assert.equal(null,err);
    db.db("test").collection("nodejs_test").find({}).count().then((n)=>{
      var data = {name:req.body.itemName, id:n+1};
      db.db("test").collection("nodejs_test").insertOne(data, (err,result)=>{
        if(err) throw err;
        res.redirect("/index");
        db.close();
      });
    });
  });
});

app.post('/delete/:id', (req, res) => {
  mongodb.connect(url, connectOption, (err,db)=>{
    assert.equal(null,err);
    var data = {id: Number(req.params.id)};
    db.db("test").collection("nodejs_test").deleteOne(data, (err,result)=>{
        if(err) throw err;
        res.redirect("/index");
        db.close();
    });
  });
});

app.get('/edit/:id', (req, res) => {
  mongodb.connect(url, connectOption, (err,db)=>{
    assert.equal(null,err);
    var data = {id: Number(req.params.id)};
    db.db("test").collection("nodejs_test").findOne(data, (err,result)=>{
        if(err) throw err;
        res.render("edit.ejs", {item:result});
        db.close();
    });
  });
});

app.post('/update/:id', (req, res) => {
  mongodb.connect(url, connectOption, (err,db)=>{
    assert.equal(null,err);
    db.db("test").collection("nodejs_test").find({}).count().then((n)=>{
      var updata_id = {id: Number(req.params.id)};
      var set_data= {$set:{name:req.body.itemName}};
      db.db("test").collection("nodejs_test").updateOne(update_id,set_data, (err,result)=>{
        if(err) throw err;
        res.redirect("/index");
        db.close();
      });
    });
  });
});

app.listen(3000);
