const jwt = require("jsonwebtoken");
const User =require("../Models/User");
const {JWT_SECRET} = require("./authMiddleware");

const sendToken = (res, user) =>
{
    const name = `${user.firstName} ${user.lastName}`;
    const token =jwt.sign({id:user._id, name}, JWT_SECRET,
        { expiresIn:"1d"});
    res.cookie("token",token,{httpOnly: true, maxAge: 24*60*60*1000});
};

const emptyForm = {firstName:"",lastName:"",email:""};
//GET / Login & Registration Page
exports.getAuth = (req, res) => 
{
  if (req.user) return res.redirect("/tweet");
  res.render("auth", { loginError: null, registerError: null, loginEmail: "", form: emptyForm });
};

// POST /register
exports.postRegister = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body || {};
  const form = { firstName: firstName || "", lastName: lastName || "", email: email || "" };
  try {
    if (!confirmPassword) throw new Error("Confirm password is required");
    if (password !== confirmPassword) throw new Error("Passwords do not match");

    const user = await User.create({ firstName, lastName, email, password });
    sendToken(res, user);
    res.redirect("/tweet");
  } catch (err) {
    let message = err.message;
    if (err.code === 11000) message = "This email is already registered";
    else if (err.name === "ValidationError")
      message = Object.values(err.errors).map((e) => e.message).join(", ");
    res.render("auth", { loginError: null, registerError: message, loginEmail: "", form });
  }
};

// POST /login
exports.postLogin = async (req, res) => {
  const { email, password } = req.body || {};
  try {
    const user = await User.findOne({ email: String(email || "").toLowerCase().trim() });
    const ok = user && (await user.comparePassword(String(password || "")));
    if (!ok) {
      return res.render("auth", {
        loginError: "Invalid email or password",
        registerError: null,
        loginEmail: email || "",
        form: emptyForm,
      });
    }
    sendToken(res, user);
    res.redirect("/tweet");
  } catch (err) {
    console.error(err);
    res.render("auth", {
      loginError: "Something went wrong",
      registerError: null,
      loginEmail: email || "",
      form: emptyForm,
    });
  }
};

// POST /logout
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
};

