import { configureStore } from "@reduxjs/toolkit";
import PostsReducer from "../Features/Posts/PostsSlice";
import UsersReducer from "../Features/Users/UsersSlice";

export const store = configureStore({
  reducer: {
    posts: PostsReducer,
    users: UsersReducer,
  },
});
