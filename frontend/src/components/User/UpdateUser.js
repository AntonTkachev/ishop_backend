import React, { Component } from "react";
import { connect } from "react-redux";
import { saveUser, fetchUser, updateUser } from "../../services/index";

import { Row, Card, Form, Button, Col, InputGroup, FormControl } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUndo,
	faEdit,
	faPhone,
	faEnvelope,
	faUserPlus,
	faUser,
	faStar,
} from "@fortawesome/free-solid-svg-icons";

class UpdateUser extends Component {
	constructor(props) {
		super(props);
		this.state = this.initialState;
		this.state = {
			users: [],
			show: false,
		};
	}
	
	initialState = {
		id: "",
		name: "",
		email: "",
		password: "",
		mobile: "",
		role: "",
	};
	
	componentDidMount() {
		const userId = +this.props.match.params.id;
		if (userId) {
			this.findUserById(userId);
		}
	}
	
	findUserById = (userId) => {
		this.props.fetchUser(userId);
		setTimeout(() => {
			let user = this.props.userObject.users;
			if (user != null) {
				this.setState({
					id: user.id,
					name: user.name,
					email: user.email,
					password: user.password,
					mobile: user.mobile,
					role: user.role,
				});
			}
		}, 1000);
	};
	
	resetRegisterForm = () => {
		this.setState(() => this.initialState);
	};
	
	render() {
		const { name, email, mobile, role } =
			this.state;
		
		return (
			<div>
				<Row className="justify-content-md-center">
					<Col xs={5}>
						<Card className={"border border-dark bg-dark text-white"}>
							<Card.Header>
								<FontAwesomeIcon icon={faEdit}/> Update User
							</Card.Header>
							<Card.Body>
								<Form.Row>
									<Form.Group as={Col}>
										<InputGroup>
											<InputGroup.Prepend>
												<InputGroup.Text>
													<FontAwesomeIcon icon={faUser}/>
												</InputGroup.Text>
											</InputGroup.Prepend>
											<FormControl
												autoComplete="off"
												type="text"
												name="name"
												value={name}
												onChange={this.userChange}
												className={"bg-dark text-white"}
												placeholder="Enter Name"
											/>
										</InputGroup>
									</Form.Group>
								</Form.Row>
								<Form.Row>
									<Form.Group as={Col}>
										<InputGroup>
											<InputGroup.Prepend>
												<InputGroup.Text>
													<FontAwesomeIcon icon={faEnvelope}/>
												</InputGroup.Text>
											</InputGroup.Prepend>
											<FormControl
												required
												autoComplete="off"
												type="text"
												name="email"
												value={email}
												disabled={true}
												onChange={this.userChange}
												className={"bg-dark text-white"}
												placeholder="Enter Email Address"
											/>
										</InputGroup>
									</Form.Group>
								</Form.Row>
								<Form.Row>
									<Form.Group as={Col}>
										<InputGroup>
											<InputGroup.Prepend>
												<InputGroup.Text>
													<FontAwesomeIcon icon={faPhone}/>
												</InputGroup.Text>
											</InputGroup.Prepend>
											<FormControl
												autoComplete="off"
												type="text"
												name="mobile"
												value={mobile}
												onChange={this.userChange}
												className={"bg-dark text-white"}
												placeholder="Enter Mobile Number"
											/>
										</InputGroup>
									</Form.Group>
								</Form.Row>
								<Form.Row>
									<Form.Group as={Col}>
										<InputGroup>
											<InputGroup.Prepend>
												<InputGroup.Text>
													<FontAwesomeIcon icon={faStar}/>
												</InputGroup.Text>
											</InputGroup.Prepend>
											<Form.Control
												as="select"
												onChange={this.userChange}
												className={"bg-dark text-white"}
												placeholder="Choose Role"
												name="role"
												disabled={true}
												value={role}
											>
												<option value="ADMIN">ADMIN</option>
												<option value="OWNER">OWNER</option>
												<option value="USER">USER</option>
											</Form.Control>
										</InputGroup>
									</Form.Group>
								</Form.Row>
							</Card.Body>
							<Card.Footer style={{ textAlign: "right" }}>
								<Button
									size="sm"
									type="button"
									variant="success"
									onClick={saveUser}
								>
									<FontAwesomeIcon icon={faUserPlus}/> Update
								</Button>{" "}
								<Button
									size="sm"
									type="button"
									variant="info"
									onClick={this.resetRegisterForm}
								>
									<FontAwesomeIcon icon={faUndo}/> Reset
								</Button>
							</Card.Footer>
						</Card>
					</Col>
				</Row>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		userObject: state.user,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		saveUser: (user) => dispatch(saveUser(user)),
		fetchUser: (userId) => dispatch(fetchUser(userId)),
		updateUser: (user) => dispatch(updateUser(user)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateUser);
