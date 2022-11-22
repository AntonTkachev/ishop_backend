import React, { Component } from "react";

import { connect } from "react-redux";
import { deleteUser, updateUser } from "../../services";

import "../../assets/css/Style.css";
import {
	Card,
	Table,
	ButtonGroup,
	InputGroup,
	FormControl,
	Button,
	Alert,
	Modal,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUsers,
	faEdit,
	faTrash,
	faStepBackward,
	faFastBackward,
	faStepForward,
	faFastForward,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";
import jwt from 'jwt-decode';
import "./css/UserList.css";
import getBaseURL from "../../utils/configParser";

class UserList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			users: [],
			currentPage: 1,
			usersPerPage: 5,
			error: "",
			show: false,
			showDeleteModal: false,
			exceptionDeleteModal: false,
		};
	}
	
	componentDidMount = async (dispatch) => {
		this.findAllUser(this.state.currentPage)
	};
	
	findAllUser(currentPage) {
		currentPage -= 1;
		axios
			.get(
				getBaseURL() + "/customer/readAll?pageNumber=" +
				currentPage +
				"&pageSize=" +
				this.state.usersPerPage
			)
			.then((response) => response.data)
			.then((data) => {
				this.setState({
					users: data.content,
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
	
	getMail = () => {
		return jwt(localStorage.jwtToken).sub;
	}
	updateUser = (user) => {
		if (user.email !== this.getMail) {
			this.setState({
				show: true,
				error: "Can't update current user"
			});
		} else {
			this.props.updateUser(user.id);
			setTimeout(() => {
				if (this.props.userData != null) {
					this.setState({
						show: true
					});
					setTimeout(() => this.setState({
						show: false
					}), 3000);
					this.findAllUser();
				} else {
					this.setState({
						show: false
					});
				}
			}, 1000);
		}
	};
	
	showModal = (user) => {
		if (user.email === this.getMail) {
			this.setState({ exceptionDeleteModal: true })
		} else {
			this.setState({ showDeleteModal: true })
		}
	};
	
	deleteUser = (user) => {
		this.props.deleteUser(user.id);
		setTimeout(() => {
			if (this.props.userData != null) {
				this.setState({
					show: true
				});
				setTimeout(() => this.setState({
					show: false
				}), 3000);
				this.findAllUser();
			} else {
				this.setState({
					show: false
				});
			}
		}, 1000);
	}
	
	changePage = (event) => {
		if (event.target.value && event.target.value <= this.state.totalPages && event.target.value > 0) {
			this.setState({
				[event.target.name]: parseInt(event.target.value),
			});
		}
	};
	
	firstPage = () => {
		let firstPage = 1;
		if (this.state.currentPage > firstPage) {
			this.findAllUser(firstPage);
		}
	};
	
	prevPage = () => {
		let prevPage = 1;
		if (this.state.currentPage > prevPage) {
			this.findAllUser(this.state.currentPage - prevPage);
		}
	};
	
	lastPage = () => {
		let condition = Math.ceil(
			this.state.totalElements / this.state.usersPerPage
		);
		if (this.state.currentPage < condition) {
			this.findAllUser(condition);
		}
	};
	
	nextPage = () => {
		if (
			this.state.currentPage < Math.ceil(this.state.totalElements / this.state.usersPerPage)
		) {
			this.findAllUser(this.state.currentPage + 1);
		}
	};
	
	render() {
		const { currentPage, totalPages } = this.state;
		
		const userData = this.props.userData;
		const users = this.state.users;
		const role = localStorage.role;
		
		if (userData.error || role !== "ADMIN") {
			userData.error = "Login by Admin to watch user list"
		}
		
		return (
			<div>
				{this.state.show && (
					<Alert variant="danger">{this.state.error}</Alert>
				)}
				{userData.error ? (
					<Alert variant="danger">{userData.error}</Alert>
				) : (
					<Card className={"border border-dark bg-dark text-white"}>
						<Card.Header>
							<FontAwesomeIcon icon={faUsers}/> User List
						</Card.Header>
						<Card.Body>
							<Table bordered hover striped variant="dark">
								<thead>
								<tr>
									<td>Name</td>
									<td>Email</td>
									<td>Mobile</td>
									<td>Role</td>
									<th>Actions</th>
								</tr>
								</thead>
								<tbody>
								{users.length === 0 ? (
									<tr align="center">
										<td colSpan="6">No Users Available</td>
									</tr>
								) : (
									users.map((user, index) => (
										<tr key={index}>
											<td>{user.name}</td>
											<td>{user.email}</td>
											<td>{user.mobile}</td>
											<td>{user.roleName}</td>
											<td>
												<ButtonGroup>
													<Link
														to={"customer/" + user.id}
														className="btn btn-sm btn-outline-primary"
													>
														<FontAwesomeIcon icon={faEdit}/>
													</Link>{" "}
													<Button
														size="sm"
														variant="outline-danger"
														onClick={() => this.showModal(user)}
													>
														<FontAwesomeIcon icon={faTrash}/>
													</Button>
													<Modal show={this.state.exceptionDeleteModal}
													       onHide={() => this.setState({ exceptionDeleteModal: false })}
													>
														
														<Modal.Header closeButton>
															<Modal.Title>Error</Modal.Title>
														</Modal.Header>
														
														<Modal.Body>You can't delete yourself</Modal.Body>
														
														<Modal.Footer>
															
															<Button variant="secondary"
															        onClick={() => this.setState({ exceptionDeleteModal: false })}>Close</Button>
														
														</Modal.Footer>
													</Modal>
													<Modal show={this.state.showDeleteModal}
													       onHide={() => this.setState({ showDeleteModal: false })}>
														
														<Modal.Header closeButton>
															<Modal.Title>User Deleting</Modal.Title>
														</Modal.Header>
														
														<Modal.Body>You really want delete user?</Modal.Body>
														
														<Modal.Footer>
															
															<Button variant="secondary"
															        onClick={() => this.setState({ showDeleteModal: false })}>Close</Button>
															<Button variant="primary" onClick={() => this.deleteUser(user)}>Submit</Button>
														
														</Modal.Footer>
													</Modal>
												</ButtonGroup>
											</td>
										</tr>
									))
								)}
								</tbody>
							</Table>
						</Card.Body>
						{users.length > 0 ? (
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
					</Card>
				)}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		userData: state.user,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateUser: (userId) => dispatch(updateUser(userId)),
		deleteUser: (userId) => dispatch(deleteUser(userId)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
