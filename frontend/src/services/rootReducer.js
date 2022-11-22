import { combineReducers } from "redux";
import userReducer from "./user/userReducer";
import authReducer from "./user/auth/authReducer";
import productReducer from "./product/productReducer";

const rootReducer = combineReducers({
  user: userReducer,
  product: productReducer,
  auth: authReducer,
});

export default rootReducer;
