import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import mongoose from "mongoose";
import { name } from "ejs";

const port = 3000;
const app = express();

app.set('view engine' , 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://127.0.0.1:27017/campus");
const myschema = mongoose.Schema({
    picture : String,
    message : String
});

const bookschema = mongoose.Schema({
    name : String,
    department : String,
    semester : String,
    book : String
});

const mymodel = mongoose.model('image',myschema);
const bookmodel = mongoose.model('book',bookschema);

const storage = multer.diskStorage({
    destination:'./public/images',
    filename:(req,file,cb)=> {
        cb(null,Date.now()+file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter:(req,file,cb)=>{
        if(
            file.mimetype == 'image/jpeg' ||
            file.mimetype == 'image/jpg' ||
            file.mimetype == 'image/png'  
        ){
            cb(null,true);
        }else {
            cb(null,false);
            cb(new Error('only jpeg,jpg and png formats allowed'))
        }
    }
});

app.post('/upload',upload.single('image'),(req,res)=>{
    const msg = req.body['cert-msg'];
    mymodel.create({picture:req.file.filename , message: msg}).then((x)=>{
        res.redirect('/certificate');
    })
    .catch((y)=>{
        console.log(y)
    })
})

app.post("/upd",(req,res)=>{
    const name = req.body['name'];
    const department = req.body['Department'];
    const semester = req.body['semester'];
    const book = req.body['book'];
    bookmodel.create({
        name : name,
        department : department,
        semester : semester,
        book : book
    }).then(()=>{
        res.redirect('/book');
    });
});

app.post("/delete",(req,res)=> {
    var delItem = req.body.checkbox;
     sweep(delItem)
    res.redirect("/accuire");
});

  async function sweep(item) {
       await bookmodel.findByIdAndDelete(item);
     };


app.get("/",(req,res) => {
    res.render("main.ejs");
});

app.get("/charity",(req,res) => {
    res.render("charity.ejs");
});

app.get("/certificate",(req,res) => {
    res.render("certificate.ejs");
});

app.get("/student",(req,res) => {
    res.render("student.ejs");
});

app.get("/staff",(req,res)=>{
    mymodel.find({}).then((items)=>{
        res.render("staff.ejs",{items:items});
    });
});

app.get("/book",(req,res)=>{
    res.render("book.ejs");
});

app.get("/donate",(req,res)=>{
    res.render("donate.ejs");
});

app.get("/accuire",(req,res)=>{
    bookmodel.find({}).then((book)=>{
        res.render("accuire.ejs",{book : book});
    });
});

app.get("/academics",(req,res)=>{
    res.render("academics.ejs");
});

app.listen(port,() => {
    console.log(`your server is running on the port ${port}`);
});