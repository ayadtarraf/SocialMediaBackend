import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    occupation: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    comments:String,
    likes: {
      type: Map,
      of: Boolean,
    },
   
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
