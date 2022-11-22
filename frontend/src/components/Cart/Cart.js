import React, { Component } from "react";
import { connect } from "react-redux";

import {
	Card,
	Table,
	ButtonGroup,
	InputGroup,
	FormControl,
	Button,
	Form,
	Row,
	Image,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faTimes,
	faPlus,
	faMinus,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import jwt from 'jwt-decode';
import getBaseURL from "../../utils/configParser";
import defaultProductPng from "../../img/defaultProductPng.png";
import emptyCart from "../../img/empty-cart.png";
import { Link } from "react-router-dom";

class Cart extends Component {
	constructor(props) {
		super(props);
		this.state = {
			products: [],
			status: "",
			person: {},
		};
	}
	
	componentDidMount = async (dispatch) => {
		this.findOrder()
	};
	
	findOrder() {
		const mail = jwt(localStorage.jwtToken).sub
		axios
			.get(getBaseURL() + "/order/getByMail?mail=" + mail)
			.then(response => response.data)
			.then(data => {
				this.setState({
					products: data.product,
					status: data.status,
					person: data.person,
				});
			})
			.catch((error) => {
				console.log(error.message);
			});
	}
	
	changeCount = (count, p) => {
		if (Number.isInteger(count) && count >= 0 && count <= p.count) {
			p.currentCount = count
			const newPrice = p.originalPrice * p.currentCount
			p.price = newPrice
			this.setState({ ...this.state.products.product });
		}
	}
	
	incCurrentCount = (product) => {
		product.currentCount = product.currentCount + 1
		this.changeCount(product.currentCount, product)
	}
	
	decCurrentCount = (product) => {
		product.currentCount = product.currentCount - 1
		this.changeCount(product.currentCount, product)
	}
	
	deleteProductFromOrder = (product) => {
		const mail = jwt(localStorage.jwtToken).sub
		axios
			.put(
				getBaseURL() + "/order/deleteProduct?mail=" +
				mail +
				"&productId=" +
				product.id, { headers: { "Access-Control-Allow-Origin": "*", } })
			.then((response) => response.data)
			.then((data) => {
				this.findOrder();
			})
			.catch((error) => {
				console.log(error.message);
			});
	}
	
	goToOrder = () => {
	}
	
	handleChange(product) {
		product.checkboxChecked = !product.checkboxChecked;
		this.setState({ ...this.state.products.product });
	}
	
	firstInput = true;
	
	render() {
		
		const { products } =
			this.state;
		
		if (this.firstInput) {
			products.map((product) => {
				product.checkboxChecked = true;
			})
			this.firstInput = !this.firstInput;
		}
		
		let total = 0;
		products.map((product) => {
			if (product.checkboxChecked) {
				total = total + product.price
			}
		})
		
		return (
			<div>
				{products.length === 0 ? (
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
						}}>
						<Link to={"/list"} style={{
							color: '#ffffff80',
						}}>
							Your Cart is empty, Go Shopping!
						</Link>
						<Image
							src={emptyCart}
						/>
					</div>
				) : (
					<Card className={"border border-dark bg-dark text-white"}>
						<Card.Header>
							Your Cart
							<div style={{ float: "right", color: "green" }}>
								{this.state.status}
							</div>
							<div style={{ float: "right" }}>
								Status of Order:
							</div>
						</Card.Header>
						<Row>
							<Card.Body>
								<Table bordered hover striped variant="dark">
									<thead>
									<tr>
										<td>Select</td>
										<th>Delete</th>
										<td>Product</td>
										<td>Name</td>
										<td>Price</td>
										<td>Count</td>
										<td align="right">Amount</td>
									</tr>
									</thead>
									<tbody>
									{products.length === 0 ? (
										<tr align="center">
											<td colSpan="6">No Users Available</td>
										</tr>
									) : (
										products.map((product, index) => (
											<tr key={index}>
												<td width="5%" align="center">
													<Form.Check checked={product.checkboxChecked}
													            onChange={() => this.handleChange(product)}>
													
													</Form.Check>
												</td>
												<td width="5%" className="text-center">
													<ButtonGroup>
														<Button
															size="sm"
															variant="outline-danger"
															onClick={() => this.deleteProductFromOrder(product)}
														>
															<FontAwesomeIcon icon={faTimes}/>
														</Button>
													</ButtonGroup>
												</td>
												<td>
													<Image
														src={product.coverPhotoURL ? product.coverPhotoURL : defaultProductPng}
														roundedCircle
														width="35"
														height="35"
													/>{" "}
												</td>
												<td>{product.name}</td>
												<td>{product.originalPrice}</td>
												<td>
													<InputGroup size="sm">
														<InputGroup.Prepend>
															<Button
																type="button"
																variant="bg-dark"
																onClick={() => this.decCurrentCount(product)}
																disabled={product.currentCount <= 0}
															>
																<FontAwesomeIcon icon={faMinus}/>
															</Button>
															<FormControl
																style={{
																	width: "50px",
																	border: "#404449",
																	color: "white",
																	textAlign: "center",
																	fontWeight: "bold",
																	backgroundColor: "#404449",
																}}
																name="currentCount"
																value={product.currentCount}
																onChange={(event) => this.changeCount(event.target.value, product)}
															/>
															<Button
																type="button"
																variant="bg-dark"
																onClick={() => this.incCurrentCount(product)}
																disabled={product.currentCount >= product.count}
															>
																<FontAwesomeIcon icon={faPlus}/>
															</Button>
														</InputGroup.Prepend>
													</InputGroup>
												</td>
												<td align="right">$ {product.price}</td>
											</tr>
										))
									)}
									</tbody>
								</Table>
							</Card.Body>
							<Card.Body>
								{products.length > 0 ? (
									<div
										class="float-right"
										style={{
											display: "flex",
											flexDirection: "column",
											// justifyContent: "center",
											// alignItems: "center",
										}}>
										<div>
											<Button
												style={{ float: "right", width: "200px", }}
												size="lg"
												variant="outline-warning"
												onClick={this.goToOrder}
											>
												Go to ordering
											</Button>
										</div>
										<div
											class="float-right"
											style={{
												// backgroundColor: "#95999c",
												borderColor: "#95999c",
												borderRadius: "3px",
												width: "200px",
												// padding: "18px",
											}}>
											Total: $ {total}
										</div>
									</div>
								) : null}
							</Card.Body>
						</Row>
					</Card>
				)}
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		productObject: state.products,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);