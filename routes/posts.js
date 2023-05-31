import express from "express";
import { getFeedPosts, getUserPosts, likePost,deletePost,getMostLikedPost, commentPost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/user", verifyToken, getUserPosts);
router.get("/most-liked", verifyToken, getMostLikedPost);
/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

/* DELETE */
router.delete("/:postId", verifyToken, deletePost);

/*comments */
router.post("/:id/comment", verifyToken, commentPost);



export default router;
