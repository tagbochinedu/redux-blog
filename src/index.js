import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { store } from "./Store/Store";
import { Provider } from "react-redux";
import { fetchUsers } from "./Features/Users/UsersSlice";
import { fetchPosts } from "./Features/Posts/PostsSlice";
import { BrowserRouter } from "react-router-dom";

store.dispatch(fetchPosts());
store.dispatch(fetchUsers());

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

