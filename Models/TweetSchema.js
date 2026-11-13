const mongoose = require("mongoose");
const tweetSchema = new mongoose.Schema(
    {
      title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [21, "Title must be longer than 20 characters"],
    },
    tweet: {
      type: String,
      required: [true, "Tweet is required"],
      trim: true,
      maxlength: [50, "Tweet must be no longer than 50 characters"],
    },
    user:
     { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", required: true,
     },

    },
    {timestamps:true}
);

module.exports = mongoose.model("Tweet", tweetSchema);
