import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, ButtonGroup, Card, Form, FormControl, Image, InputGroup, Row, Table, } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import jwt from 'jwt-decode';
import getBaseURL from "../../utils/configParser";
import defaultProductPng from "../../img/defaultProductPng.png";
import emptyCart from "../../img/empty-cart.png";
import { Link } from "react-router-dom";
import { Table as MaterialUiTable } from "@material-ui/core";
import 'react-accessible-accordion/dist/fancy-example.css';
import {
	Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel
} from "react-accessible-accordion";

class Cart extends Component {
	constructor(props) {
		super(props);
		this.state = {
			products: [],
			status: "",
			person: {},
			orderId: "",
			archiveOrders: [],
		};
	}
	
	componentDidMount = async () => {
		this.findOrder()
	};
	
	findOrder() {
		const mail = jwt(localStorage.jwtToken).sub
		axios
			.get(getBaseURL() + "/order/getByMail?mail=" + mail)
			.then(response => response.data)
			.then(orders => {
					let newOrderStatus;
					let otherOrdersStatus = []
					
					orders.forEach((order) => {
						if (order.status === "NEW") {
							newOrderStatus = order;
						} else {
							otherOrdersStatus.push(order);
						}
					});
					
					let updateProducts = newOrderStatus.product.map((p) => {
						p.isChecked = sessionStorage.getItem(p.id) === 'true'
						p.currentCount = sessionStorage.getItem(p.name) || 1
						p.price = p.currentCount * p.price
						return p
					})
					
					this.setState({
						orderId: newOrderStatus.id,
						products: updateProducts,
						status: newOrderStatus.status,
						person: newOrderStatus.person,
						archiveOrders: otherOrdersStatus,
					});
				}
			)
			.catch((error) => {
				console.log(error.message);
			});
	}
	
	changeCount = (count, p) => {
		if (Number.isInteger(count) && count >= 0 && count <= p.count) {
			p.currentCount = count
			p.price = p.originalPrice * p.currentCount
			sessionStorage.setItem(p.name, count)
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
	
	td = (products) => {
		return products.map((product) => (
			<tr key={product.name}>
				<td>
					<Image
						src={product.coverPhotoURL}
						roundedCircle
						width="35"
						height="35"
					/>{" "}
				</td>
				<td>{product.name}</td>
				<td>{product.currentCount}</td>
				<td>{product.price + "$"}</td>
			</tr>
		))
	}
	
	//fixme удаляет рандомно
	//fixme при удаление все чекбоксы активны
	//fixme change $ on REACT_APP_CURRENCY
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
				sessionStorage.removeItem(product.id)
				this.findOrder();
			})
			.catch((error) => {
				console.log(error.message);
			});
	}
	
	onCheckboxChange = (product) => {
		let isCheckedOrNot = sessionStorage.getItem(product.id) === 'true'
		
		sessionStorage.setItem(product.id, !isCheckedOrNot)
		product.isChecked = !isCheckedOrNot
		this.setState({ ...this.state.products.product });
	}
	
	render() {
		
		const { archiveOrders, products, orderId, person, status } = this.state;
		
		const { REACT_APP_CURRENCY } = process.env;
		
		let activeProducts = products.filter(product => product.isChecked);
		let total = activeProducts.reduce(function (prev, current) {
			return prev + +current.price
		}, 0);
		
		return (
			<div style={{
				height: "auto",
				// overflow: "auto",
			}}>
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
							// width={"40%"}
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
											<td colSpan="6">Cart is Empty</td>
										</tr>
									) : (
										products.map((product, index) => (
											<tr key={index}>
												<td width="5%" align="center">
													<Form.Check defaultChecked={product.isChecked}
													            onChange={() => this.onCheckboxChange(product)}>
													
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
												<td align="right">{REACT_APP_CURRENCY} {product.price}</td>
											</tr>
										))
									)}
									</tbody>
								</Table>
							</Card.Body>
							<Card.Body>
								{products.length > 0 ? (
									<div class="float-right"
									     style={{
										     display: "flex",
										     flexDirection: "column",
										     marginBottom: "100px",
									     }}>
										<div>
											<Link to={{
												pathname: "/endOrder",
												state: { orderId, activeProducts, person, status }
											}}
											>
												<Button
													style={{ float: "right", width: "200px" }}
													size="lg"
													variant="outline-warning"
												>
													Go to ordering
												</Button>
											</Link>
										</div>
										<div style={{
											height: 50,
											justifyContent: 'center',
											alignItems: 'center',
											position: 'absolute',
											bottom: 0,
										}}
										>
											Total: {REACT_APP_CURRENCY} {total}
										</div>
									</div>
								) : null}
							</Card.Body>
						</Row>
					</Card>
				)}
				<p style={{
					color: "white",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
				}}>
					{this.state.info}
					YOUR LAST ORDERS
				</p>
				<div style={{
					marginBottom: "10%"
				}}>
					<Accordion allowZeroExpanded className={"border border-dark bg-dark text-white"}>
						{
							archiveOrders.map((order) => (
									<AccordionItem key={`${order.id}-heading-button`}>
										<AccordionItemHeading id={`${order.id}-heading-button`}>
											<AccordionItemButton
												id={`${order.id}-heading-button`}
												style={{
													padding: "10px",
													color: "white",
													backgroundColor: "#343a40"
												}}>
												User: {order.name} {order.surname}|
												Status: {order.status} |
												Total: {order.totalSum + REACT_APP_CURRENCY} |
											</AccordionItemButton>
										</AccordionItemHeading>
										<AccordionItemPanel>
											<MaterialUiTable bordered hover striped variant="dark">
												<thead>
												<tr>
													<td>Img</td>
													<td>Name</td>
													<th>Count</th>
													<td>Price</td>
												</tr>
												{this.td(order.product)}
												</thead>
											</MaterialUiTable>
										</AccordionItemPanel>
									</AccordionItem>
								)
							)}
					</Accordion>
				</div>
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