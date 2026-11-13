const Tweet = require("../models/TweetSchema");

const validationMessage = (err) =>
  err.name === "ValidationError"
    ? Object.values(err.errors).map((e) => e.message).join(", ")
    : null;

// GET /tweet : all tweets
exports.list = async (req, res) => {
  const tweets = await Tweet.find().sort({ createdAt: -1 }).lean();
  res.render("tweets", { tweets });
};

// GET /tweet/:id
exports.show = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id).lean();
    if (!tweet) return res.redirect("/tweet");
    res.render("tweet", { tweet });
  } catch (err) {
    res.redirect("/tweet");
  }
};

// GET /addTweet
exports.getAdd = (req, res) => {
  res.render("form", {
    heading: "Add a Tweet",
    action: "/addTweet",
    tweet: { title: "", tweet: "" },
    error: null,
  });
};

// POST /addTweet 
exports.postAdd = async (req, res) => {
  const { title, tweet } = req.body || {};
  try {
    await Tweet.create({ title, tweet, user: req.user.id });
    res.redirect("/tweet");
  } catch (err) {
    const msg = validationMessage(err);
    if (!msg) throw err;
    res.render("form", {
      heading: "Add a Tweet",
      action: "/addTweet",
      tweet: { title, tweet },
      error: msg,
    });
  }
};

// GET /tweet/edit
exports.getEdit = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id).lean();
    if (!tweet) return res.redirect("/tweet");
    res.render("form", {
      heading: "Edit a Tweet",
      action: `/tweet/edit/${tweet._id}`,
      tweet,
      error: null,
    });
  } catch (err) {
    res.redirect("/tweet");
  }
};

// POST /tweet/edit
exports.postEdit = async (req, res) => {
  const { title, tweet: text } = req.body || {};
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet) return res.redirect("/tweet");
    tweet.title = title;
    tweet.tweet = text;
    await tweet.save();                       
    res.redirect(`/tweet/${tweet._id}`);
  } catch (err) {
    const msg = validationMessage(err);
    if (!msg) return res.redirect("/tweet");
    res.render("form", {
      heading: "Edit a Tweet",
      action: `/tweet/edit/${req.params.id}`,
      tweet: { title, tweet: text },
      error: msg,
    });
  }
};

// POST /tweet/delete
exports.remove = async (req, res) => {
  try {
    await Tweet.findByIdAndDelete(req.params.id);
  } catch (err) {}
  res.redirect("/tweet");
};

