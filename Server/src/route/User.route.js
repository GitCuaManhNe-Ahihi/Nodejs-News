import { handleCheckToken, handleLogin } from "../controller/authController";
import  * as USER from "../controller/userController";
import multer from "multer";

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./Server/src/files");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname);
    },
  }),
});

const User_route = (route) => {
  route.get("/users", USER.handleApiGetUser)
  route.get("/auth/token", handleCheckToken)
  route.get("/user/password",USER.handleForgetPassword )
  route.post("/login",handleLogin)
  route.post("/user",USER.handleAddUser)
  route.patch("/user/password",USER.handleChangePassword)
  route.patch("/user",upload.single("image"), USER.handleEditUser)
  route.delete("/user",USER.handleApiDeleteUser);
  return route;
};

export default User_route;