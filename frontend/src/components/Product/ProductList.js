import React, { Component } from "react";

import { connect } from "react-redux";
import { deleteProduct } from "../../services/index";

import defaultProductPng from "../../img/defaultProductPng.png";
import "./../../assets/css/Style.css";
import {
	Card,
	Table,
	Image,
	Form,
	ButtonGroup,
	Button,
	InputGroup,
	FormControl,
	Modal,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faList,
	faEdit,
	faTrash,
	faStepBackward,
	faFastBackward,
	faStepForward,
	faFastForward,
	faSearch,
	faTimes,
	faCartArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import MyToast from "../MyToast";
import axios from "axios";
import jwt from 'jwt-decode';
import getBaseURL from "../../utils/configParser";

class ProductList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			products: [],
			search: "",
			currentPage: 1,
			productsPerPage: 5,
			sortDir: "asc",
			message: "",
			showDeleteModal: false,
			currentProduct: {},
		};
	}
	
	sortData = () => {
		setTimeout(() => {
			this.state.sortDir === "asc"
				? this.setState({ sortDir: "desc" })
				: this.setState({ sortDir: "asc" });
			this.findAllProducts(this.state.currentPage);
		}, 500);
	};
	
	componentDidMount() {
		this.findAllProducts(this.state.currentPage);
	}
	
	productsPerPageChange = async (event) => {
		await this.setState({ productsPerPage: event.target.value });
		this.findAllProducts(this.state.currentPage);
	};
	
	findAllProducts(currentPage) {
		currentPage -= 1;
		axios
			.get(
				getBaseURL() + "/product?pageNumber=" +
				currentPage +
				"&pageSize=" +
				this.state.productsPerPage +
				"&sortBy=price&sortDir=" +
				this.state.sortDir
			)
			.then((response) => response.data)
			.then((data) => {
				this.setState({
					products: data.content,
					totalPages: data.totalPages,
					totalElements: data.totalElements,
					currentPage: data.number + 1,
				});
			})
			.catch((error) => {
				console.log(error);
				localStorage.removeItem("jwtToken");
				localStorage.setItem("isLoggedIn", false);
				localStorage.removeItem("role");
				this.props.history.push("/");
			});
	}
	
	deleteProduct = (product) => {
		this.props.deleteProduct(product.id);
		setTimeout(() => {
			if (this.props.productObject != null) {
				if (this.props.productObject.error.response.status === 404) {
					this.setState({
						showDeleteModal: false,
						show: true,
						message: "Can't delete product which use in order!",
						type: "danger"
					});
				} else {
					this.setState({ show: true, message: "Product Deleted Successfully.", type: "success" });
					setTimeout(() => this.setState({ show: false }), 3000);
				}
				this.findAllProducts(this.state.currentPage);
			} else {
				this.setState({ show: false });
			}
		}, 1000);
	};
	
	addProductToCart = (product) => {
		const mail = jwt(localStorage.jwtToken).sub
		axios
			.post(
				"http://localhost:8081/api/order/create?mail=" +
				mail +
				"&productId=" +
				product.id, { headers: { "Access-Control-Allow-Origin": "*", } })
			.then((response) => response.data)
			.then((data) => {
				this.setState({ message: product.name + " correct add to Cart", show: true, type: "success" })
			})
			.catch((error) => {
				console.log(error.message);
			});
	}
	
	changePage = (event) => {
		if (event.target.value && event.target.value <= this.state.totalPages && event.target.value > 0) {
			let targetPage = parseInt(event.target.value);
			if (this.state.search) {
				this.searchData(targetPage);
			} else {
				this.findAllProducts(targetPage);
			}
			this.setState({
				[event.target.name]: targetPage,
			});
		}
	};
	
	firstPage = () => {
		let firstPage = 1;
		if (this.state.currentPage > firstPage) {
			if (this.state.search) {
				this.searchData(firstPage);
			} else {
				this.findAllProducts(firstPage);
			}
		}
	};
	
	prevPage = () => {
		let prevPage = 1;
		if (this.state.currentPage > prevPage) {
			if (this.state.search) {
				this.searchData(this.state.currentPage - prevPage);
			} else {
				this.findAllProducts(this.state.currentPage - prevPage);
			}
		}
	};
	
	lastPage = () => {
		let condition = Math.ceil(
			this.state.totalElements / this.state.productsPerPage
		);
		if (this.state.currentPage < condition) {
			if (this.state.search) {
				this.searchData(condition);
			} else {
				this.findAllProducts(condition);
			}
		}
	};
	
	nextPage = () => {
		if (
			this.state.currentPage < Math.ceil(this.state.totalElements / this.state.productsPerPage)
		) {
			if (this.state.search) {
				this.searchData(this.state.currentPage + 1);
			} else {
				this.findAllProducts(this.state.currentPage + 1);
			}
		}
	};
	
	searchChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};
	
	cancelSearch = () => {
		this.setState({ search: "" });
		this.findAllProducts(this.state.currentPage);
	};
	
	searchData = (currentPage) => {
		let page;
		if (Number.isInteger(currentPage)) page = currentPage
		else page = this.state.currentPage
		page -= 1;
		axios
			.get(
				"http://localhost:8081/api/product/search/?searchText=" +
				this.state.search +
				"&page=" +
				page +
				"&size=" +
				this.state.productsPerPage
			)
			.then((response) => response.data)
			.then((data) => {
				this.setState({
					products: data.content,
					totalPages: data.totalPages,
					totalElements: data.totalElements,
					currentPage: data.number + 1,
				});
			});
	};
	
	handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			this.searchData()
		}
	}
	
	getCode = (byte) => {
		const text = byte.toString(16);
		if (byte < 16) {
			return '%0' + text;
		}
		return '%' + text;
	};
	
	
	toString = (bytes) => {
		let result = '';
		for (let i = 0; i < bytes.length; ++i) {
			result += this.getCode(bytes[i]);
		}
		return decodeURIComponent(result);
	};
	
	userButtonGroup = (product) => (
		<ButtonGroup>
			<Button
				size="sm"
				variant="outline-light"
				onClick={() => this.addProductToCart(product)}
			>
				<FontAwesomeIcon icon={faCartArrowDown}/>
			</Button>
		</ButtonGroup>
	);
	
	ownerAdminButtonGroup = (product) => {
		return (
			<ButtonGroup>
				<Link
					to={"edit/" + product.id}
					className="btn btn-sm btn-outline-primary"
				>
					<FontAwesomeIcon icon={faEdit}/>
				</Link>{" "}
				<Button
					size="sm"
					variant="outline-light"
					onClick={() => this.addProductToCart(product)}
				>
					<FontAwesomeIcon icon={faCartArrowDown}/>
				</Button>
				<Button
					size="sm"
					variant="outline-danger"
					onClick={() => this.setState({ showDeleteModal: true, currentProduct: product })}
				>
					<FontAwesomeIcon icon={faTrash}/>
				</Button>
				<Modal show={this.state.showDeleteModal} onHide={() => this.setState({ showDeleteModal: false })}>
					
					<Modal.Header closeButton>
						<Modal.Title>Product Deleting</Modal.Title>
					</Modal.Header>
					
					<Modal.Body>You really want delete product with name {this.state.currentProduct.name}</Modal.Body>
					
					<Modal.Footer>
						
						<Button variant="secondary" onClick={() => this.setState({ showDeleteModal: false })}>Close</Button>
						<Button variant="primary" onClick={() => this.deleteProduct(this.state.currentProduct)}>Submit</Button>
					
					</Modal.Footer>
				</Modal>
			</ButtonGroup>
		)
	}
	
	isNotUser = () => {
		return jwt(localStorage.jwtToken).auth !== "USER";
	}
	
	buttonGroup = (product) => {
		if (jwt(localStorage.jwtToken).auth === "USER") {
			return this.userButtonGroup(product)
		} else {
			return this.ownerAdminButtonGroup(product);
		}
	}
	td = () => {
		if (this.isNotUser) return (
			<tr>
				<th>Name</th>
				<th width="15%">Owner</th>
				<th width="10%">ISBN Number</th>
				<th width="10%" onClick={this.sortData}>
					Price{" "}
					<div
						className={
							this.state.sortDir === "asc"
								? "arrow arrow-up"
								: "arrow arrow-down"
						}
					>
						{" "}
					</div>
				</th>
				<th width="10%">Count</th>
				<th width="15%">Actions</th>
			</tr>
		)
		else return (
			<tr>
				<th>Name</th>
				<th width="10%" onClick={this.sortData}>
					Price{" "}
					<div
						className={
							this.state.sortDir === "asc"
								? "arrow arrow-up"
								: "arrow arrow-down"
						}
					>
						{" "}
					</div>
				</th>
				<th width="10%">Count</th>
				<th width="15%">Actions</th>
			</tr>
		)
	}
	
	tr = (product) => {
		if (this.isNotUser) return (
			<tr key={product.id}>
				<td>
					<Image
						src={product.coverPhotoURL ? product.coverPhotoURL : defaultProductPng}
						roundedCircle
						width="35"
						height="35"
					/>{" "}
					{product.name}
				</td>
				<td>{product.owner}</td>
				<td>{product.isbnNumber}</td>
				<td>{product.price}</td>
				<td>{product.count}</td>
				<td>
					{this.buttonGroup(product)}
				</td>
			</tr>
		)
		else return (
			<tr key={product.id}>
				<td>
					<Image
						src={product.coverPhotoURL ? product.coverPhotoURL : defaultProductPng}
						roundedCircle
						width="35"
						height="35"
					/>{" "}
					{product.name}
				</td>
				<td>{product.price}</td>
				<td>{product.count}</td>
				<td>
					{this.buttonGroup(product)}
				</td>
			</tr>
		)
	}
	
	render() {
		const { products, currentPage, totalPages, search } = this.state;
		
		return (
			<div onKeyPress={this.handleKeyDown}>
				<div style={{ display: this.state.show ? "block" : "none" }}>
					<MyToast
						show={this.state.show}
						message={this.state.message}
						type={this.state.type}
					/>
				</div>
				<Card className={"border border-dark bg-dark text-white"}>
					<Card.Header>
						<div style={{ float: "left" }}>
							<FontAwesomeIcon icon={faList}/> Product List
						</div>
						<div style={{ float: "right" }}>
							<InputGroup size="sm">
								<FormControl
									placeholder="Search"
									name="search"
									value={search}
									className={"info-border bg-dark text-white"}
									onChange={this.searchChange}
								/>
								<InputGroup.Append>
									<Button
										size="sm"
										variant="outline-info"
										type="button"
										onClick={this.searchData}
									>
										<FontAwesomeIcon icon={faSearch}/>
									</Button>
									<Button
										size="sm"
										variant="outline-danger"
										type="button"
										onClick={this.cancelSearch}
									>
										<FontAwesomeIcon icon={faTimes}/>
									</Button>
								</InputGroup.Append>
							</InputGroup>
						</div>
					</Card.Header>
					<Card.Body>
						<Table bordered hover striped variant="dark">
							<thead>
							{this.td()}
							</thead>
							<tbody>
							{products.length === 0 ? (
								<tr align="center">
									<td colSpan="7">No Product Available.</td>
								</tr>
							) : (
								products.map((product) => (
									this.tr(product)
								))
							)}
							</tbody>
						</Table>
					</Card.Body>
					{products.length > 0 ? (
						<Card.Footer>
							<div style={{ float: "left" }}>
								Showing Page {currentPage} of {totalPages}
							</div>
							<div style={{ float: "right" }}>
								<InputGroup size="sm">
									<InputGroup.Prepend>
										<Button
											type="button"
											variant="outline-info"
											disabled={currentPage === 1}
											onClick={this.firstPage}
										>
											<FontAwesomeIcon icon={faFastBackward}/> First
										</Button>
										<Button
											type="button"
											variant="outline-info"
											disabled={currentPage === 1}
											onClick={this.prevPage}
										>
											<FontAwesomeIcon icon={faStepBackward}/> Prev
										</Button>
									</InputGroup.Prepend>
									<FormControl
										className={"page-num bg-dark"}
										name="currentPage"
										value={currentPage}
										onChange={this.changePage}
									/>
									<InputGroup.Append>
										<Button
											type="button"
											variant="outline-info"
											disabled={currentPage === totalPages}
											onClick={this.nextPage}
										>
											<FontAwesomeIcon icon={faStepForward}/> Next
										</Button>
										<Button
											type="button"
											variant="outline-info"
											disabled={currentPage === totalPages}
											onClick={this.lastPage}
										>
											<FontAwesomeIcon icon={faFastForward}/> Last
										</Button>
									</InputGroup.Append>
								</InputGroup>
							</div>
						</Card.Footer>
					) : null}
					{products.length > 0 ? (
						<Card.Footer>
							<div style={{ float: "right" }}>
								<InputGroup>
									<InputGroup.Append>
										<Form.Label style={{ minWidth: "150px" }}>Products per page: </Form.Label>
										<FormControl
											as="select"
											onChange={this.productsPerPageChange}
											value={this.state.productsPerPage}
											className={"info-border bg-dark text-white"}
											name="role"
										>
											<option value="5">5</option>
											<option value="10">10</option>
											<option value="50">50</option>
											<option value="100">100</option>
										</FormControl>
									</InputGroup.Append>
								</InputGroup>
							</div>
						</Card.Footer>
					) : null}
				</Card>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
		return {
			productObject: state.product,
		};
	}
;

const mapDispatchToProps = (dispatch) => {
		return {
			deleteProduct: (productId) => dispatch(deleteProduct(productId)),
		};
	}
;

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
