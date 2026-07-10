import {Router} from "express";
import {login ,register} from "../controllers/usercontroller.js";
const router = Router();
router.route("/login").post(login);
router.route("/register").post(register);
router.route("/add_to_activity");
router.route("/get_all_activity");
export default router;
/*User clicks “Sign Up” on frontend.
handleRegister() runs in React frontend.
client.post() sends a POST request to backend.
Backend receives request at /register route.
Backend processes data and sends response.
Frontend checks response: */