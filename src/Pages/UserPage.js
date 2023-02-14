import { useSelector } from "react-redux";
import { selectUserById } from "../Features/Users/UsersSlice";
import { selectPostsByUser } from "../Features/Posts/PostsSlice";
import { Link, useParams } from "react-router-dom";

const UserPage = () => {
  const params = useParams();
  const userId = params.id
  const user = useSelector((state) => selectUserById(state, Number(userId)));
 

  const postsForUser = useSelector((state) =>
    selectPostsByUser(state, Number(userId))
  );
  

  const postTitles = postsForUser.map(post => (
    <li key={post.id}>
      <Link to={`/${post.id}`}>{post.title}</Link>
    </li>
  ));

  return (
    <section>
      <h2>{user?.name}</h2>

      <ol>{postTitles}</ol>
    </section>
  );
};

export default UserPage;
