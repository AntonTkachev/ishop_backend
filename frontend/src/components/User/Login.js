import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
	Row, Col, Card, Form, InputGroup, FormControl, Button, Alert,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faSignInAlt, faEnvelope, faLock, faUndo, faEye, faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { authenticateUser } from "../../services/index";

const Login = (props) => {
	const [error, setError] = useState();
	const [show, setShow] = useState(true);
	const [eye, setEye] = useState(faEye);
	
	const initialState = {
		email: "", password: "",
	};
	
	const [user, setUser] = useState(initialState);
	
	const credentialChange = (event) => {
		const { name, value } = event.target;
		setUser({ ...user, [name]: value });
	};
	
	const dispatch = useDispatch();
	
	const validateUser = () => {
		dispatch(authenticateUser(user.email, user.password))
			.then((response) => {
				return props.history.push("/home");
			})
			.catch((error) => {
				console.log(error.message);
				setShow(true);
				resetPassword(user);
				setError(error.response.data.exception);
			});
	};
	
	const resetPassword = (user) => {
		setUser({
			email: user.email, password: "",
		});
	};
	
	const resetLoginForm = () => {
		setUser(initialState);
	};
	
	const showOrHidePassword = () => {
		const passwordFrom = document.getElementById("passwordFromId");
		if (passwordFrom.type === "password") passwordFrom.type = "text"; else passwordFrom.type = "password";
		if (eye === faEye) setEye(faEyeSlash); else setEye(faEye);
	}
	
	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			validateUser()
		}
	}
	
	return (<Row className="justify-content-md-center" onKeyPress={handleKeyDown}>
		<Col xs={5}>
			{show && props.message && (<Alert variant="success" onClose={() => setShow(false)} dismissible>
				{props.message}
			</Alert>)}
			{show && error && (<Alert variant="danger" onClose={() => setShow(false)} dismissible>
				{error}
			</Alert>)}
			{localStorage.getItem("isLoggedIn") === 'true' ? (
				<Alert variant="danger" onClose={() => setShow(false)} dismissible>
					You are already logged in, you need to log out before logging in as different user.
				</Alert>) : (<Card className={"border border-dark bg-dark text-white"}>
				<Card.Header>
					<FontAwesomeIcon icon={faSignInAlt}/> Login
				</Card.Header>
				<Card.Body>
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
									onChange={credentialChange}
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
								<Form.Control
									required
									autoComplete="off"
									id="passwordFromId"
									type="password"
									name="password"
									value={user.password}
									onChange={credentialChange}
									placeholder="Enter Password"
									style={{ backgroundColor: "transparent", cursor: "pointer", borderRight: 0, color: "white" }}
								/>
								<InputGroup.Append>
									<span
										className="input-group-text"
										style={{ backgroundColor: "transparent", cursor: "pointer", borderLeft: 0, color: "white" }}
										onClick={showOrHidePassword}>
										<FontAwesomeIcon icon={eye}/>
									</span>
								</InputGroup.Append>
							</InputGroup>
						</Form.Group>
					</Form.Row>
				</Card.Body>
				<Card.Footer style={{ textAlign: "right" }}>
					<Button
						size="sm"
						type="button"
						variant="success"
						onClick={validateUser}
						disabled={user.email.length === 0 || user.password.length === 0}
					>
						<FontAwesomeIcon icon={faSignInAlt}/> Login
					</Button>{" "}
					<Button
						size="sm"
						type="button"
						variant="info"
						onClick={resetLoginForm}
						disabled={user.email.length === 0 && user.password.length === 0}
					>
						<FontAwesomeIcon icon={faUndo}/> Reset
					</Button>
				</Card.Footer>
				<Card.Footer style={{ textAlign: "center" }}>
					<Link to={"/changePassword"} style={{ textDecoration: 'none', color: 'white' }}>
						Forgot your password
					</Link>
				</Card.Footer>
			</Card>)}
		</Col>
	</Row>);
};

export default Login;
