const express = require("express");
const router = express.Router();
const auth = require("./authController");
const tweets = require("./tweetController");
const { requireLogin } = require("./authMiddleware");

// Login + Registration (open to everyone)
router.get("/", auth.getAuth);
router.post("/login", auth.postLogin);
router.post("/register", auth.postRegister);
router.post("/logout", auth.logout);

// Tweets (logged-in users only)
router.get("/tweet", requireLogin, tweets.list);
router.get("/addTweet", requireLogin, tweets.getAdd);
router.post("/addTweet", requireLogin, tweets.postAdd);
router.get("/tweet/edit/:id", requireLogin, tweets.getEdit);
router.post("/tweet/edit/:id", requireLogin, tweets.postEdit);
router.post("/tweet/delete/:id", requireLogin, tweets.remove);
router.get("/tweet/:id", requireLogin, tweets.show);   // keep last

module.exports = router;
