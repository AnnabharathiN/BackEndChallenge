const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "tweeter_secret_key";
const attachUser = (req,res,next) =>
{
    req.user = null;
    res.locals.user= null;
    const token = req.cookies && req.cookies.token;
    if(token)
    {
        try{
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = {id: decoded.id,name:decoded.name};
            res.locals.user= req.user;
            } catch (err)
            {
                res.clearCookie("token");
            }
    }
    next();
};


const requireLogin = (req,res,next)=> {
    if(!req.user){
        return 
    res.redirect("/");
}
    next();
};

module.exports={JWT_SECRET,attachUser,requireLogin};
