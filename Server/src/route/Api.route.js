import Article_route from "./Post.route.js";
import User_route from "./User.route.js";
const Api_route = (route) =>
{   
    Article_route(route);
    User_route(route);
    return route;
}
export default Api_route;