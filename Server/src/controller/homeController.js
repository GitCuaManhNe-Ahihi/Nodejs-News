import {
  getAllGenres,
  post24H,
  PostFollowId,
  PostNearTime,
  QueryAllpost,
} from "../serviceQuery/postQuery";
import { formatDate } from "../Helper/index.js";

export let homePage = async (req, res) => {
  await Promise.all([QueryAllpost(), QueryAllpost(), PostNearTime(), post24H()])
    .then((values) => {
      if (values[0].length > 0) {
        const story = values[0].slice(0, 1)[0];
        const index = story.content.indexOf("http://res.cloudinary.com/");
        const image = story.content.slice(
          index,
          story.content.indexOf('"', index)
        );
        const timeofStory = formatDate(
          Math.floor(new Date() - story.createdAt),
          story.createdAt
        );
        const neartime =
          values[2].length > 0
            ? values[2].filter((item) => item.id !== story.id)
            : [];

        let post_24h =
          values[3].length > 0
            ? values[3].filter(
                (item) =>
                  item.id !== story.id &&
                  JSON.stringify(neartime).indexOf(`"id":${item.id}`) === -1
              )
            : [];
        post_24h = post_24h.slice(0, 4);
        const headerBottom =
          values[1].length > 0
            ? values[1].map((item) => {
                return { name: item.name, link: "/" };
              })
            : [];
        let afterpost = [...values[0].slice(1, values[0].length)].filter(
          (item) =>
            item.id !== story.id &&
            JSON.stringify(post_24h).indexOf(`"id":${item.id}`) === -1 &&
            JSON.stringify(neartime).indexOf(`"id":${item.id}`) === -1
        );
        const genres = new Set(afterpost.map((item) => item["genres.name"]));
        const genres_ = Array.from(genres);
        return res.render("index.ejs", {
          headerBottom,
          story,
          image,
          neartime,
          timeofStory,
          post24h: post_24h,
          afterpost,
          genres_,
        });
      } else {
        return res.render("404.ejs");
      }
    })
    .catch((err) => {
      console.log(err);
      return res.render("404.ejs");
    });
};
export let postPage = async (req, res) => {
  const id = req.query.id;
 await Promise.all([PostFollowId(id), getAllGenres(),  PostNearTime()])
    .then((values) => {
      if (values[0]) {
        const post = values[0].slice(0, 1)[0];
        const timeofPost = formatDate(
          Math.floor(new Date() - post.createdAt),
          post.createdAt
        );
        let dataHTML = post.content;
        const headerBottom =
          values[2].length > 0
            ? values[2].map((item) => {
                return { name: item.name, link: "/" };
              })
            : [];
        return res.render("./detail_post/post_detail.ejs", {
          headerBottom,
          post,
          neartime: values[2],
          dataHTML,
          timeofPost,
        });
      } else {
        return res.render("404.ejs");
      }
    })
    .catch((err) => {
      return res.render("404.ejs");
    });
};
