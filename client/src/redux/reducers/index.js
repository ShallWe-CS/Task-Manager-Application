import { combineReducers } from "redux";

import postsReducer from "./posts";
import authReducer from "./auth";
import communityReducer from "./community";
import moderationReducer from "./moderation";
import userReducer from "./user";
import adminReducer from "./admin";

const rootReducer = combineReducers({

});

export default rootReducer;
