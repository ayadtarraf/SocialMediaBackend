  import express from "express";
  import {
    getUser,
    getUserFriends,
    addRemoveFriend,
    updateUser,
  } from "../controllers/users.js";
  import { verifyToken } from "../middleware/auth.js";

  const router = express.Router();

  /* READ */
  router.get("/:id", getUser);
  router.get("/:id/friends", verifyToken, getUserFriends);

  /* UPDATE */
  router.patch("/:id", verifyToken, updateUser);
  router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

  export default router;
