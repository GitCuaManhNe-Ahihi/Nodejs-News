import { handleApiDeleteUser, handleApiGetUser } from "../controller/adminPageController";
import { handleCheckToken, handleLogin } from "../controller/authController";

const User_route = (route) => {
  route.get("/users", handleApiGetUser)
  route.get("/auth/token", handleCheckToken)
  route.post("/login",handleLogin)
  route.delete("/user", handleApiDeleteUser);
  return route;
};

export default User_route;