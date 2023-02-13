import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getPostsStatus,
  getPostsError,
  fetchPosts,
} from "../Features/Posts/PostsSlice";
import PostFulfilled from "./PostFulfilled";

const PostList = () => {
  const dispatch = useDispatch();

  const status = useSelector(getPostsStatus);
  const error = useSelector(getPostsError);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts());
    }
  }, [status, dispatch]);

  return (
    <section className="text-white">
      {status === "loading" && <p className="text-center mt-10">Loading...</p>}
      {status === "failed" && <p className="text-center mt-10">{error}</p>}
      {status === "succeeded" && <PostFulfilled />}
    </section>
  );
};

export default PostList;
