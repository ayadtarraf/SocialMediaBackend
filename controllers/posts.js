import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      occupation: user.occupation,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    var post
    const query = req.query.search
    if (query) {
      post = await Post.find({
        $or: [
          { firstName: { $regex: query, $options: "i" } },
          { lastName: { $regex: query, $options: "i" } },
          { occupation: { $regex: query, $options: "i" } },
        ]
      });
    } else {
      post = await Post.find({})
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    var post = {}
    const { id: userId } = req.query;
    const query = req.query.search
    if (query) {
      console.log("query")
      post = await Post.find({
        $or: [
          { firstName: { $regex: query, $options: "i" } },
          { lastName: { $regex: query, $options: "i" } },
          { occupation: { $regex: query, $options: "i" } },
        ], userId
      });
    } else {
      console.log("all")
      post = await Post.find({ userId });
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { id: userId } = req.user; // Get the authenticated user's ID

    // Find the post by ID and verify the ownership
    const post = await Post.findOne({ _id: postId, userId });

    if (!post) {
      return res.status(404).json({ error: "Post not found or you do not have permission to delete it." });
    }

    // Delete the post
    await post.remove();

    res.status(200).json({ message: "Post deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//find most liked post
export const findMostLikedPost = (posts) => {
  if (posts.length === 0) {
    return null;
  }

  return posts.reduce((maxLikedPost, currentPost) => {
    const currentLikesCount = Array.from(currentPost.likes.values()).filter(liked => liked).length;
    const maxLikesCount = Array.from(maxLikedPost.likes.values()).filter(liked => liked).length;
    return currentLikesCount > maxLikesCount ? currentPost : maxLikedPost;
  }, posts[0]);
};

export const getMostLikedPost = async (req, res) => {
  try {
    const posts = await Post.find();
    const mostLikedPost = findMostLikedPost(posts);

    res.status(200).json(mostLikedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* COMMENTS */
export const commentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    post.comments.push(value);

    const updatedPost = await post.save();

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};