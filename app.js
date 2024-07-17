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
    book : String,
    whatsapp : Number,
    email : String,
    instagram : String
});

const mymodel = mongoose.model('image',myschema);

const bookmodel = mongoose.model('book',bookschema);

const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
}));

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
    const whatsapp = req.body['whatsapp'];
    const instagram = req.body['instagram'];
    const email = req.body['email'];
    bookmodel.create({
        name : name,
        department : department,
        semester : semester,
        book : book,
        whatsapp : whatsapp,
        email : email,
        instagram : instagram
    }).then(()=>{
        res.redirect('/book');
    });
});

// app.post("/delete",(req,res)=> {
//     var delItem = req.body.checkbox;
//      sweep(delItem)
//     res.redirect("/accuire");
// });

app.post("/del",(req,res)=> {
    var delItem = req.body.checkbox;
     sweep(delItem)
    res.redirect("/remove");
});

app.post('/cdel',(req,res)=> {
    var delItem = req.body.checkbox;
     remove(delItem)
    res.redirect("/staff");
})
  async function sweep(item) {
       await bookmodel.findByIdAndDelete(item);
     };

  async function remove(item) {
    await mymodel.findByIdAndDelete(item);
  };


app.get("/",(req,res) => {
    res.render("landing.ejs");
});

app.get("/main",(req,res)=> {
    res.render("main.ejs");
});

app.get("/admin",(req,res)=> {
    res.render("admin.ejs");
});

app.get("/remove",(req,res)=> {
    bookmodel.find({}).then((book)=>{
        res.render("remove.ejs",{book : book});
    });
});
app.get('/contact',(req,res)=> {
    res.render("contact.ejs");
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

app.get('/login', (req, res) => {
    res.render('login', { errorMessage: null });
});

app.get('/lgn',(req,res)=> {
    res.render('lgn',{ errorMessage: null});
});

const users = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' },
    
];

const admin = [
    { user: 'admin', pass: 'code'}
];


app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.redirect('/staff')
    } else {
        res.render('login', { errorMessage: 'Invalid username or password' });
    }
});

app.post('/lgn', (req, res) => {
    const { user, pass } = req.body;
    const adminlg = admin.find(u => u.user === user && u.pass === pass);

    if (adminlg) {
        res.redirect('/admin');
    } else {
        res.render('lgn', { errorMessage: 'Invalid username or password' });
    }
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