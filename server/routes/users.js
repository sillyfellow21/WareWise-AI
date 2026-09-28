import express from "express";

import { getUser, updateUserDetails } from "../controllers/users.js";
import { requireSelf, verifyToken } from "../middleware/auth.js";

const router = express.Router();

/*READ*/
router.get("/:id", verifyToken, requireSelf("id"), getUser);

/*UPDATE*/

router.patch("/:id", verifyToken, requireSelf("id"), updateUserDetails);
export default router;
