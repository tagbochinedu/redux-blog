import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPosts } from "../Features/Posts/PostsSlice";
import { selectAllUsers } from "../Features/Users/UsersSlice";

const PostForm = () => {
  const users = useSelector(selectAllUsers);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
    if (content && title) {
      try {
        dispatch(addPosts({ title, body: content, userId })).unwrap();
        setTitle("");
        setContent("");
        setUserId("");
      } catch (err) {
        return err.message;
      }
    }
  };

  return (
    <section className="text-white mb-10 max-w-xl mx-auto">
      <h2 className="text-4xl font-bold text-center">Add a New Post</h2>
      <form
        onSubmit={(e) => {
          submitHandler(e);
        }}
      >
        <label htmlFor="post title" className="block text-2xl mb-2">
          Post Title
        </label>
        <input
          type="text"
          id="post title"
          name="post title"
          value={title}
          className="mb-5 h-10 rounded-md text-black px-2 w-full"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <label htmlFor="user Id">Author</label>
        <select
          value={userId}
          id="user Id"
          required
          onChange={(e) => {
            setUserId(e.target.value);
          }}
          className="mb-5 h-10 rounded-md text-black px-2 w-full"
        >
          <option value="">Select a name</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <label htmlFor="post content" className="block text-2xl mb-2">
          Post Content
        </label>
        <textarea
          rows="5"
          type="text"
          id="post content"
          name="post content"
          value={content}
          className="mb-5 text-black px-2 rounded-md w-full"
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
        <button
          type="submit"
          className="bg-red-600 font-semibold rounded-md w-full py-2 hover:bg-red-500 "
        >
          Save Post
        </button>
      </form>
    </section>
  );
};

export default PostForm;
