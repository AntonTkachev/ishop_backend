import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Card, Col, Form, Image, InputGroup, Row } from "react-bootstrap";
import axios from "axios";
import getBaseURL from "../../utils/configParser";
import jwt from "jwt-decode";

class EndOrder extends Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;
		this.state = {
			activeProducts: this.props.location.state.activeProducts,
			orderId: this.props.location.state.orderId,
			person: this.props.location.state.person,
			status: this.props.location.state.status
		};
	}
	
	initialState = {
		id: "",
		name: "",
		surname: "",
		address: "",
		time: "",
		date: "",
	};
	
	endOrder(customerInfo) {
		axios
			.put(getBaseURL() + "/order/endOrder", customerInfo)
			.then(response => response.data)
			.then(data => {
				console.log(data)
			})
	}
	
	order = (event) => {
		event.preventDefault();
		
		const customerInfo = {
			orderId: this.state.orderId,
			name: this.state.name,
			surname: this.state.surname,
			address: this.state.address,
			time: this.state.time,
			date: this.state.date,
			email: jwt(localStorage.jwtToken).sub,
			products: this.state.activeProducts,
			totalSum: this.getSum(this.state.activeProducts),
			person : this.state.person,
			status : this.state.status,
		};
		
		console.log(customerInfo)
		this.endOrder(customerInfo);
	}
	
	productChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};
	
	getSum = (products) => {
		return products.reduce(function (prev, current) {
			return prev + +current.price
		}, 0);
	}
	
	render() {
		
		const { activeProducts } = this.state;
		
		let sum = activeProducts.reduce(function (prev, current) {
			return prev + +current.price
		}, 0);
		
		return (
			<div>
				<div>
					<Card className={"border border-dark bg-dark text-white"}>
						<Row>
							<Card.Body>
								<Form.Row>
									<Form.Group as={Col} controlId="formGridName">
										<Form.Label>Name</Form.Label>
										<Form.Control
											required
											autoComplete="off"
											type="test"
											name="name"
											onChange={this.productChange}
											className={"bg-dark text-white"}
											placeholder="Enter Customer Name"
										/>
									</Form.Group>
									<Form.Group as={Col} controlId="formGridOwner">
										<Form.Label>Surname</Form.Label>
										<Form.Control
											required
											autoComplete="off"
											type="test"
											name="surname"
											onChange={this.productChange}
											className={"bg-dark text-white"}
											placeholder="Enter Customer Surname"
										/>
									</Form.Group>
								</Form.Row>
								<Form.Row>
									<Form.Group as={Col} controlId="formGridCoverPhotoURL">
										<Form.Label>Address</Form.Label>
										<InputGroup>
											<Form.Control
												required
												autoComplete="off"
												type="test"
												name="address"
												onChange={this.productChange}
												className={"bg-dark text-white"}
												placeholder="Enter Customer's Address"
											/>
										</InputGroup>
									</Form.Group>
								</Form.Row>
								<Form.Row>
									<Form.Group as={Col} controlId="formGridPrice">
										<Form.Label>Time</Form.Label>
										<Form.Control
											required
											autoComplete="off"
											type="time"
											name="time"
											onChange={this.productChange}
											className={"bg-dark text-white"}
										/>
									</Form.Group>
									<Form.Group as={Col} controlId="formGridCount">
										<Form.Label>Date</Form.Label>
										<Form.Control
											required
											autoComplete="off"
											type="date"
											name="date"
											onChange={this.productChange}
											className={"bg-dark text-white"}
										/>
									</Form.Group>
								</Form.Row>
							</Card.Body>
							<Card.Body>
								<div style={{ float: "right", marginTop: "10px", marginBottom: "10px", }}>
									<div>
										<Button
											style={{ float: "right", width: "200px", marginTop: "10px" }}
											size="lg"
											variant="outline-warning"
											onClick={this.order}
										>
											Order
										</Button>
									</div>
									{activeProducts.length === 0 ? (
										<tr align="center">
											<td colSpan="7">No Product Available.</td>
										</tr>
									) : (
										activeProducts.map(product =>
											<tr>
												<td className="list-group">
													{/*<Image*/}
													{/*	src={product.coverPhotoURL}*/}
													{/*	roundedCircle*/}
													{/*	width="35"*/}
													{/*	height="35"*/}
													{/*/>{" "}*/}
													<li>{product.name} x {product.currentCount}</li>
												</td>
											</tr>
										)
									)}
									<div style={{
										width: "200px",
										marginTop: "100px"
									}}>
										Total: $ {sum}
									</div>
								</div>
							</Card.Body>
						</Row>
					</Card>
				</div>
			</div>
		)
	}
	
}

const mapStateToProps = (state) => {
	return {
		productsObject: state.products,
	};
};

const mapDispatchToProps = () => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(EndOrder);