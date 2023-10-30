import React, { Component } from "react";

import { connect } from "react-redux";
import {
	saveProduct,
	fetchProduct,
	updateProduct,
} from "../../services/index";

import { Card, Form, Button, Col, InputGroup, Image, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faSave,
	faPlusSquare,
	faUndo,
	faList,
	faEdit,
} from "@fortawesome/free-solid-svg-icons";
import jwt from 'jwt-decode';
import MyToast from "../MyToast";

class Product extends Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;
		this.state = {
			users: [],
			show: false,
			coverPhotoURL: "https://cdn.icon-icons.com/icons2/1678/PNG/512/wondicon-ui-free-parcel_111208.png",
			owner: this.getOwnerName(),
		};
	}
	
	getOwnerName = () => {
		const decodeJwt = jwt(localStorage.jwtToken)
		return decodeJwt.username;
	}
	
	initialState = {
		id: "",
		name: "",
		owner: this.getOwnerName(),
		coverPhotoURL: "https://cdn.icon-icons.com/icons2/1678/PNG/512/wondicon-ui-free-parcel_111208.png",
		isbnNumber: "",
		price: "",
		count: "",
	};
	
	componentDidMount() {
		const productId = +this.props.match.params.id;
		if (productId) {
			this.findProductById(productId);
		}
	}
	
	findProductById = (productId) => {
		this.props.fetchProduct(productId);
		setTimeout(() => {
			let product = this.props.productObject.product;
			if (product != null) {
				this.setState({
					id: product.id,
					name: product.name,
					owner: product.owner,
					coverPhotoURL: product.coverPhotoURL,
					isbnNumber: product.isbnNumber,
					price: product.price,
					count: product.count,
				});
			}
		}, 1000);
	};
	
	resetProduct = () => {
		this.setState(() => this.initialState);
	};
	
	submitProduct = (event) => {
		event.preventDefault();
		
		const product = {
			name: this.state.name,
			owner: this.state.owner,
			coverPhotoURL: this.state.coverPhotoURL,
			isbnNumber: this.state.isbnNumber,
			price: this.state.price,
			count: this.state.count,
		};
		
		this.props.saveProduct(product);
		setTimeout(() => {
			if (this.props.productObject.product != null) {
				this.setState({ show: true, method: "post" });
				setTimeout(() => this.setState({ show: false }), 3000);
			} else {
				this.setState({ show: false });
			}
		}, 2000);
		this.setState(this.initialState);
	};
	
	updateProduct = (event) => {
		event.preventDefault();
		
		const product = {
			id: this.state.id,
			name: this.state.name,
			owner: this.state.owner ? this.state.owner : this.getOwnerName(),
			coverPhotoURL: this.state.coverPhotoURL,
			isbnNumber: this.state.isbnNumber,
			price: this.state.price,
			count: this.state.count,
		};
		this.props.updateProduct(product);
		setTimeout(() => {
			if (this.props.productObject.product != null) {
				this.setState({ show: true, method: "put" });
				setTimeout(() => this.setState({ show: false }), 3000);
			} else {
				this.setState({ show: false });
			}
		}, 2000);
		this.setState(this.initialState);
	};
	
	productChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};
	
	productList = () => {
		return this.props.history.push("/list");
	};
	
	closeToast = () => {
		this.setState({ show: !this.state.show });
	}
	
	render() {
		const decodeJwt = jwt(localStorage.jwtToken)
		const role = decodeJwt.auth;
		let error;
		const { name, owner, coverPhotoURL, isbnNumber, price, count } =
			this.state;
		
		let show = (role !== "OWNER" && role !== "ADMIN");
		if (show) {
			error = "Login by Owner or Admin to add new product"
		}
		
		return (
			<div>
				<div onClick={this.closeToast} style={{ display: this.state.show ? "block" : "none" }}>
					<MyToast
						show={this.state.show}
						message={
							this.state.method === "put"
								? "Product Updated Successfully."
								: "Product Saved Successfully."
						}
						type={"success"}
					/>
				</div>
				{show ? (
					<Alert variant="danger">{error}</Alert>
				) : (
					<Card className={"border border-dark bg-dark text-white"}>
						<Card.Header>
							<FontAwesomeIcon icon={this.state.id ? faEdit : faPlusSquare}/>{" "}
							{this.state.id ? "Update Product" : "Add New Product"}
						</Card.Header>
						<Form
							onReset={this.resetProduct}
							onSubmit={this.state.id ? this.updateProduct : this.submitProduct}
							id="productFormId"
						>
							<Card.Body>
								<Form.Row>
									<Form.Group as={Col} controlId="formGridName">
										<Form.Label>Name</Form.Label>
										<Form.Control
											required
											autoComplete="off"
											type="test"
											name="name"
											value={name}
											onChange={this.productChange}
											className={"bg-dark text-white"}
											placeholder="Enter Product Name"
										/>
									</Form.Group>
									<Form.Group as={Col} controlId="formGridOwner">
										<Form.Label>Owner</Form.Label>
										<Form.Control
											required
											autoComplete="off"
											type="test"
											name="owner"
											defaultValue={this.getOwnerName()}
											value={owner}
											onChange={this.productChange}
											className={"bg-dark text-white"}
											placeholder="Enter Owner"
										/>
									</Form.Group>
								</Form.Row>
								<Form.Row>
									<Form.Group as={Col} controlId="formGridCoverPhotoURL">
										<Form.Label>Cover Photo URL</Form.Label>
										<InputGroup>
											<Form.Control
												autoComplete="off"
												type="test"
												name="coverPhotoURL"
												defaultValue={coverPhotoURL}
												value={coverPhotoURL}
												onChange={this.productChange}
												className={"bg-dark text-white"}
												placeholder="Enter Product Cover Photo URL"
											/>
											<InputGroup.Append>
												{
													<Image
														src={coverPhotoURL}
														width="40"
														height="38"
													/>
												}
											</InputGroup.Append>
										</InputGroup>
									</Form.Group>
									<Form.Group as={Col} controlId="formGridISBNNumber">
										<Form.Label>ISBN Number</Form.Label>
										<Form.Control
											required
											autoComplete="off"
											type="test"
											name="isbnNumber"
											value={isbnNumber}
											onChange={this.productChange}
											className={"bg-dark text-white"}
											placeholder="Enter Product ISBN Number"
										/>
									</Form.Group>
								</Form.Row>
								<Form.Row>
									<Form.Group as={Col} controlId="formGridPrice">
										<Form.Label>Price</Form.Label>
										<Form.Control
											required
											autoComplete="off"
											type="number"
											min={"1"}
											name="price"
											value={price}
											onChange={this.productChange}
											className={"bg-dark text-white"}
											placeholder="Enter Product Price"
										/>
									</Form.Group>
									<Form.Group as={Col} controlId="formGridCount">
										<Form.Label>Count</Form.Label>
										<Form.Control
											required
											autoComplete="off"
											type="number"
											min={"0"}
											name="count"
											value={count}
											onChange={this.productChange}
											className={"bg-dark text-white"}
											placeholder="Enter Product Count"
										/>
									</Form.Group>
								</Form.Row>
							</Card.Body>
							<Card.Footer style={{ textAlign: "right" }}>
								<Button size="sm" variant="success" type="submit">
									<FontAwesomeIcon icon={faSave}/>{" "}
									{this.state.id ? "Update" : "Save"}
								</Button>{" "}
								<Button size="sm" variant="info" type="reset">
									<FontAwesomeIcon icon={faUndo}/> Reset
								</Button>{" "}
								<Button
									size="sm"
									variant="info"
									type="button"
									onClick={() => this.productList()}
								>
									<FontAwesomeIcon icon={faList}/> Product List
								</Button>
							</Card.Footer>
						</Form>
					</Card>
				)}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		productObject: state.product,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		saveProduct: (product) => dispatch(saveProduct(product)),
		fetchProduct: (productId) => dispatch(fetchProduct(productId)),
		updateProduct: (product) => dispatch(updateProduct(product)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);
