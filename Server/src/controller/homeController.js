import db from "../models";
import {
  post24H,
  PostFollowId,
  PostNearTime,
  QueryAllpost
} from "../serviceQuery/postQuery";
import { formatDate, headerBottom } from "./defaultValue";

export let homePage = async (req, res) => {
  const users = await QueryAllpost();
  if (users.length > 0) {
    const story = users.slice(0, 1)[0];
    const index = story.content.indexOf(`<img src="`)+10;
    let image = story.content.substring(index, story.content.indexOf(`"`, index));
    const timeofStory = formatDate(
      Math.floor(new Date() - story.createdAt),
      story.createdAt
    );
    const neartime = await PostNearTime();
   let post24h = await post24H(db);
   post24h = post24h.length > 0 ? post24h.filter(item =>item.id !== story.id) : [];
   return res.render("index.ejs", {
      headerBottom,
      story,
      image,
      neartime,
      timeofStory,
      post24h
    });
  } else {
    return res.render("404.ejs");
  }
};
export let postPage = async (req, res) => {
  const id = req.query.id;
  const posts = await PostFollowId(id);
  if (posts.length >0) {
    const post = posts.slice(0, 1)[0];
    const timeofPost = formatDate(
      Math.floor(new Date() - post.createdAt),
      post.createdAt
    );
    let dataHTML = post.content
    const neartime = await PostNearTime();
    return res.render("./detail_post/post_detail.ejs", {
      headerBottom,
      post,
      neartime,
      dataHTML,
      timeofPost,
    });
  } else {
    return res.render("404.ejs");
  }
};
