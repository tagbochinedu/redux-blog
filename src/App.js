import {Routes, Route} from 'react-router-dom'
import Header from './Components/Header'
 import Home from './Pages/Home';
 import Post from "./Pages/Post";
 import CreatePost from './Pages/CreatePost'
import EditPostForm from './Pages/EditPost';
import UserPage from './Pages/UserPage';
import UserList from "./Pages/UserList";

function App() {
  return (
    <main className=" bg-[#5c5a5a] min-h-screen text-white">
      <Header />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/:id/edit" element={<EditPostForm />} />
        <Route exact path="/post-form" element={<CreatePost />} />
        <Route exact path="/:id" element={<Post />} />
        <Route exact path="/user/:id" element={<UserPage />} />
        <Route exact path="/users" element={<UserList />} />
      </Routes>
    </main>
  );
}

export default App;
