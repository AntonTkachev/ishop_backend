import * as UT from "./userTypes";
import axios from "axios";

const {REACT_APP_BASE_URL} = process.env;
const REGISTER_URL = REACT_APP_BASE_URL + "/login/register";
const UPDATE_PASS_URL = REACT_APP_BASE_URL + "/login/updatePassword";
const USERS_URL = REACT_APP_BASE_URL + "/customer"

export const fetchUsers = (currentPage, usersPerPage) => {
  return (dispatch) => {
    dispatch(userRequest());
    axios
      .get(USERS_URL + "/readAll?pageNumber=" +
        currentPage +
        "&pageSize=" +
        usersPerPage)
      .then((response) => {
        dispatch(userSuccess(response.data));
      })
      .catch((error) => {
        dispatch(userFailure(error.message));
      });
  };
};

export const fetchUser = (userId) => {
  return (dispatch) => {
    dispatch(userRequest());
    axios
      .get(USERS_URL + "/read?id="+userId)
      .then((response) => {
        dispatch(userSuccess(response.data));
      })
      .catch((error) => {
        dispatch(userFailure(error.message));
      });
  };
};

export const updatePass = (userObject) => async (dispatch) => {
  dispatch(userRequest());
  try {
      const response = await axios.post(UPDATE_PASS_URL, userObject, { headers: { "Access-Control-Allow-Origin": "*", } });
      dispatch(userSavedSuccess(response.data));
      return Promise.resolve(response.data);
    } catch(error) {
      dispatch(userFailure(error.message));
      return Promise.reject(error);
    }
};

export const registerUser = (userObject) => async (dispatch) => {
  dispatch(userRequest());
  try {
    const response = await axios.post(REGISTER_URL, userObject, { headers: { "Access-Control-Allow-Origin": "*", } });
    dispatch(userSavedSuccess(response.data));
    return Promise.resolve(response.data);
  } catch (error) {
    dispatch(userFailure(error.message));
    return Promise.reject(error);
  }
};

const userRequest = () => {
  return {
    type: UT.USER_REQUEST,
  };
};

const userSavedSuccess = (user) => {
  return {
    type: UT.USER_SAVED_SUCCESS,
    payload: user,
  };
};

export const updateUser = (userId) => {
console.log(userId);
};

export const saveUser = (userId) => {
console.log(userId);
};

export const deleteUser = (userId) => {
  return (dispatch) => {
    dispatch({
      type: UT.DELETE_USER_REQUEST,
    });
    axios
      .delete(USERS_URL + "/delete?customerId=" + userId)
      .then((response) => {
        dispatch(userSuccess(response.data));
      })
      .catch((error) => {
        dispatch(userFailure(error));
      });
  };
};

const userSuccess = (users) => {
  return {
    type: UT.USER_SUCCESS,
    payload: users,
  };
};

const userFailure = (error) => {
  return {
    type: UT.USER_FAILURE,
    payload: error,
  };
};
