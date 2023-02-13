import React from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectPostById, addReaction } from "../Features/Posts/PostsSlice";
import { selectAllUsers } from "../Features/Users/UsersSlice";
import { parseISO, formatDistanceToNow } from "date-fns";

const Post = () => {
  const params = useParams();
  const post = useSelector((state) => selectPostById(state, Number(params.id)));
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);

  const TimeStamp = (time) => {
    let timeAgo = "";
    const date = parseISO(time);
    const timePeriod = formatDistanceToNow(date);
    timeAgo = `${timePeriod} ago`;
    return timeAgo;
  };
  const reactions = {
    thumbsUp: "👍🏾",
    wow: "😮",
    heart: "❤️",
    rocket: "🚀",
    coffee: "☕",
  };
  const author = users.find((user) => user.id === Number(params.id));

  if (!post) {
    console.log(post);
    return (
      <section>
        <h2>Post Not Found</h2>
      </section>
    );
  }
  return (
    <article className="rounded-lg max-w-3x p-6 mx-auto my-7 min-h-[130px]">
      <h3 className="text-3xl font-semibold mb-2">{post.title}</h3>
      <h2 className="text-xl font-medium">{post.body}</h2>
      <Link to={`/${params.id}/edit`} className="underline">
        Edit Post
      </Link>
      <div className="flex justify-between">
        <span>by {author ? author.name : "Unknown Author"}</span>
        <span>
          &nbsp;<i>{TimeStamp(post.date)}</i>
        </span>
      </div>
      <div>
        {Object.entries(reactions).map(([name, emoji]) => {
          return (
            <button
              key={name}
              className="bg-transparent mx-2"
              onClick={() => {
                dispatch(addReaction({ postId: post.id, reaction: name }));
              }}
            >
              {emoji} {post.reactions[name]}
            </button>
          );
        })}
      </div>
    </article>
  );
};

export default Post;
