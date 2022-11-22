import * as BT from "./productTypes";
import axios from "axios";

const { REACT_APP_BASE_URL } = process.env;
const PRODUCT_URL = REACT_APP_BASE_URL + "/product";

export const saveProduct = (product) => {
	return (dispatch) => {
		dispatch({
			type: BT.SAVE_PRODUCT_REQUEST,
		});
		axios
			.post(PRODUCT_URL + "/create", product)
			.then((response) => {
				dispatch(productSuccess(response.data));
			})
			.catch((error) => {
				dispatch(productFailure(error));
			});
	};
};

export const fetchProduct = (productId) => {
	return (dispatch) => {
		dispatch({
			type: BT.FETCH_PRODUCT_REQUEST,
		});
		axios
			.get(PRODUCT_URL + "/read?id=" + productId)
			.then((response) => {
				dispatch(productSuccess(response.data));
			})
			.catch((error) => {
				dispatch(productFailure(error));
			});
	};
};

export const updateProduct = (product) => {
	return (dispatch) => {
		dispatch({
			type: BT.UPDATE_PRODUCT_REQUEST,
		});
		axios
			.put(PRODUCT_URL + "/update", product)
			.then((response) => {
				dispatch(productSuccess(response.data));
			})
			.catch((error) => {
				dispatch(productFailure(error));
			});
	};
};

export const deleteProduct = (productId) => {
	return (dispatch) => {
		dispatch({
			type: BT.DELETE_PRODUCT_REQUEST,
		});
		axios
			.delete(PRODUCT_URL + "/delete?productId=" + productId)
			.then((response) => {
				dispatch(productSuccess(response.data));
			})
			.catch((error) => {
				dispatch(productFailure(error));
			});
	};
};

const productSuccess = (product) => {
	return {
		type: BT.PRODUCT_SUCCESS,
		payload: product,
	};
};

const productFailure = (error) => {
	return {
		type: BT.PRODUCT_FAILURE,
		payload: error,
	};
};
