import { createuser} from "../contorllers/user.js";
import Router from "express"

const router = Router();

router.get("/user",createuser);

export default router;