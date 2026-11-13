const express = require ("express");
const path = require ("path");
const mongoose = require ("mongoose");
const cookieParser = require("cookie-parser");
//const authMiddleware = require("./Controller/authController");
const {attachUser} = require("./Controller/authMiddleware");
const routes = require("./Controller/routes");
const { url } = require("inspector");
const app = express();
//Database Connection
mongoose.connect("mongodb+srv://baratin91_db_user:pS2qtqZNr881ZfBO@cluster312.xog5rei.mongodb.net/")
.then(() => {   console.log("MongoDB connected successfully"); })
.catch((err) => {   console.error("MongoDB connection error:", err); });
//Date
app.locals.formatDate =(d) =>`${d.getDate()}/${d.getMonth()+1}/${d.getYear()}`;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//Middleware

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

console.log("Before attachUser");
app.use(attachUser);
console.log("Before routes");
app.use("/", routes);
//CSS
app.get("/style.css", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "style.css"));
});


app.use("/",routes);
app.listen(3000, () => 
  console.log("Server is running on port 3000"));