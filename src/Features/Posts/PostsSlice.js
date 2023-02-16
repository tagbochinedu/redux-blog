import {
  createSlice,
  nanoid,
  createAsyncThunk,
  createSelector,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { sub } from "date-fns";
import axios from "axios";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";
//With createEntityAdapter, you can define a set of standardized functions for manipulating and accessing these entities in your store.
const postsAdapter = createEntityAdapter({
  sortComparer: (a, b)=>b.date.localeCompare(a.date)
})

//In Redux, the getInitialState function is used to define the initial state of a slice of the Redux store. The getInitialState function is typically called once when the Redux store is initialized, and its return value is used as the initial state for that particular slice of the store. The function can be defined in the reducer function that corresponds to that slice.
const initialState = postsAdapter.getInitialState({
  status: "idle", //idle | loading | succeeded | failed
  error: null,
})

//createAsyncThunk is a middleware used for http requests because redux toolkit operates synchronously and so cannot handle asynchronous functions. Thus async thunk serves as a middleware for bridging that gap.It takes two arguments. the first is the prefix for the generated action type which is a string and the second is a callback which creates a payload
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  try {
    const response = await axios.get(POSTS_URL);
    console.log(response);
    return [...response.data];
  } catch (err) {
    return err.message;
  }
});

export const updatePost = createAsyncThunk("posts/updatePost", async (post) => {
  const { id } = post;
  // try-catch block only for development/testing with fake API
  // otherwise, remove try-catch and add updatePost.rejected case
  try {
    const response = await axios.put(`${POSTS_URL}/${id}`, post);
    return response.data;
  } catch (err) {
    //return err.message;
    return post; // only for testing Redux!
  }
});

export const deletePost = createAsyncThunk("posts/deletePost", async (post) => {
  const { id } = post;

  const response = await axios.delete(`${POSTS_URL}/${id}`);
  if (response?.status === 200) return post;
  return `${response?.status}: ${response?.statusText}`;
});

export const addPosts = createAsyncThunk("posts/addPosts", async (post) => {
  try {
    const response = await axios.post(POSTS_URL, post);
    console.log(response.data);
    return response.data;
  } catch (err) {
    return err.message;
  }
});

const PostsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addReaction(state, action) {
      const { postId, reaction } = action.payload;
      //the getInitialState function creates an entities object in which the data is stored. Thus to access it, we pass the postId directly instead of using the find array method
      const existingPost = state.entities[postId];
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
  }, //extraReducers serves as a way for the slice reducer to respond to other actions that weren't defined as part of it. it takes a builder parameter which allows it to create additional case reducers that run in response to actions defined outside of the slice
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        let min = 1;
        const loadedPosts = action.payload.map((post) => {
          post.date = sub(new Date(), { minutes: min++ }).toISOString();
          post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          };
          return post;
        });
        postsAdapter.upsertMany(state, loadedPosts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addPosts.fulfilled, (state, action) => {
        console.log(action.payload);
        action.payload.userId = Number(action.payload.userId);
        action.payload.date = new Date().toISOString();
        action.payload.reactions = {
          thumbsUp: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          eyes: 0,
        };

        postsAdapter.addOne(state, action.payload)
        console.log(state.posts);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Update could not complete");
          console.log(action.payload);
          return;
        }
        action.payload.date = new Date().toISOString();
        postsAdapter.upsertOne(state, action.payload)
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Delete could not complete");
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        postsAdapter.removeOne(state, id)
      });
  },
});

//the createSlice automatically creates an action creator function which returns an action. An action is an object which contains type and payload keys

export const { addPost, addReaction } = PostsSlice.actions;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
} = postsAdapter.getSelectors(state=>state.posts)
//the createSelector is a redux toolkit utility function which takes in two selectors as dependencies and uses them to return a part of the state. The difference between the createSelector function and regular selectors is that selectors re-run everytime the state changes and so cause the page to re-render while the createSelector uses the selectors as dependencies and only re-runs when one or both change, thus optimising the code
export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter((post) => post.userId === userId)
);
export default PostsSlice.reducer;
