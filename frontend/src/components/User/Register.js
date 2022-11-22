import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
	Row,
	Col,
	Card,
	Form,
	InputGroup,
	FormControl,
	Button,
	Alert,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPhone,
	faEnvelope,
	faLock,
	faUndo,
	faUserPlus,
	faUser,
	faStar,
	faEye,
	faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { registerUser } from "../../services/index";

const Register = (props) => {
	const [show, setShow] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState();
	const [eye, setEye] = useState(faEye);
	
	const initialState = {
		name: "",
		email: "",
		password: "",
		mobile: "",
		role: "",
	};
	
	const [user, setUser] = useState(initialState);
	
	const userChange = (event) => {
		const { name, value } = event.target;
		setUser({ ...user, [name]: value });
	};
	
	const dispatch = useDispatch();
	
	const saveUser = () => {
		dispatch(registerUser(user))
			.then((response) => {
				setShow(true);
				setMessage(response.message);
				resetRegisterForm();
				setTimeout(() => {
					setShow(false);
					props.history.push("/login");
				}, 2000);
			})
			.catch((error) => {
				console.log(error);
				setShow(true);
				setError(error.response.data.exception);
			});
	};
	
	const resetRegisterForm = () => {
		setUser(initialState);
	};
	
	const showOrHidePassword = () => {
		const passwordFrom = document.getElementById("passwordFromId");
		if (passwordFrom.type === "password") passwordFrom.type = "text";
		else passwordFrom.type = "password";
		if (eye === faEye) setEye(faEyeSlash); else setEye(faEye);
	}
	
	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			saveUser()
		}
	}
	
	return (
		<div>
			<Row className="justify-content-md-center" onKeyPress={handleKeyDown}>
				<Col xs={5}>
					{show && message && (
						<Alert variant="success" onClose={() => setShow(false)} dismissible>
							{message}
						</Alert>
					)}
					{show && error && (
						<Alert variant="danger" onClose={() => setShow(false)} dismissible>
							{error}
						</Alert>
					)}
					<Card className={"border border-dark bg-dark text-white"}>
						<Card.Header>
							<FontAwesomeIcon icon={faUserPlus}/> Register
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
											value={user.name}
											onChange={userChange}
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
											value={user.email}
											onChange={userChange}
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
												<FontAwesomeIcon icon={faLock}/>
											</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl
											required
											autoComplete="off"
											id="passwordFromId"
											type="password"
											name="password"
											value={user.password}
											onChange={userChange}
											className={"bg-dark text-white"}
											placeholder="Enter Password"
											style={{ backgroundColor: "pointer", borderRight: 0, color: "white" }}
										/>
										<InputGroup.Append>
									<span
										className="input-group-text"
										style={{ backgroundColor: "transparent", borderLeft: 0, color: "white" }}
										onClick={showOrHidePassword}>
										<FontAwesomeIcon icon={eye}/>
									</span>
										</InputGroup.Append>
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
											value={user.mobile}
											onChange={userChange}
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
											onChange={userChange}
											className={"bg-dark text-white"}
											placeholder="Choose Role"
											name="role"
											value={user.role}
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
								disabled={user.email.length === 0 || user.password.length === 0}
							>
								<FontAwesomeIcon icon={faUserPlus}/> Register
							</Button>{" "}
							<Button
								size="sm"
								type="button"
								variant="info"
								onClick={resetRegisterForm}
							>
								<FontAwesomeIcon icon={faUndo}/> Reset
							</Button>
						</Card.Footer>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default Register;
