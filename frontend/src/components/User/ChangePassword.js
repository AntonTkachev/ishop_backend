import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
	Row, Col, Card, Form, InputGroup, FormControl, Button, Alert,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEnvelope, faLock, faKey, faUndo, faUserEdit, faArrowLeft, faEye, faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { updatePass } from "../../services/index";

const ChangePassword = (props) => {
	const [show, setShow] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState();
	const [eye, setEye] = useState(faEye);
	const [newEye, setNewEye] = useState(faEye);
	
	const initialState = {
		email: "", password: "", newPassword: "", repeatPassword: "",
	};
	
	const [user, setUser] = useState(initialState);
	
	const userChange = (event) => {
		const { name, value } = event.target;
		setUser({ ...user, [name]: value });
	};
	
	const dispatch = useDispatch();
	
	const updatePassword = () => {
		dispatch(updatePass(user))
			.then((response) => {
				setShow(true);
				setMessage(response.message);
				resetChangePassForm();
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
	
	const resetChangePassForm = () => {
		setUser(initialState);
	};
	
	const showOrHidePassword = (elementId) => {
		const passwordFrom = document.getElementById(elementId);
		if (passwordFrom.type === "password") passwordFrom.type = "text"; else passwordFrom.type = "password";
		if (elementId === "passwordFromId") {
			if (eye === faEye) setEye(faEyeSlash); else setEye(faEye);
		} else {
			if (newEye === faEye) setNewEye(faEyeSlash); else setNewEye(faEye);
		}
	}
	
	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			updatePassword()
		}
	}
	
	return (<div>
		<Row className="justify-content-md-center" onKeyPress={handleKeyDown}>
			<Col xs={5}>
				{show && message && (<Alert variant="success" onClose={() => setShow(false)} dismissible>
					{message}
				</Alert>)}
				{show && error && (<Alert variant="danger" onClose={() => setShow(false)} dismissible>
					{error}
				</Alert>)}
				<Card className={"border border-dark bg-dark text-white"}>
					<Card.Header>
						<FontAwesomeIcon icon={faUserEdit}/> Update Password
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
										placeholder="Enter Old Password"
										style={{ backgroundColor: "transparent", borderRight: 0, color: "white" }}
									/>
									<InputGroup.Append>
											<span
												className="input-group-text"
												style={{ backgroundColor: "transparent", borderLeft: 0, color: "white" }}
												onClick={() => showOrHidePassword("passwordFromId")}>
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
											<FontAwesomeIcon icon={faKey}/>
										</InputGroup.Text>
									</InputGroup.Prepend>
									<FormControl
										required
										autoComplete="off"
										id="newPasswordFromId"
										type="password"
										name="newPassword"
										value={user.newPassword}
										onChange={userChange}
										className={"bg-dark text-white"}
										placeholder="Enter New Password"
										style={{ backgroundColor: "transparent", cursor: "pointer", borderRight: 0, color: "white" }}
									/>
									<InputGroup.Append>
											<span
												className="input-group-text"
												style={{ backgroundColor: "transparent", cursor: "pointer", borderLeft: 0, color: "white" }}
												onClick={() => showOrHidePassword("newPasswordFromId")}>
										<FontAwesomeIcon icon={newEye}/>
									</span>
									</InputGroup.Append>
								</InputGroup>
							</Form.Group>
						</Form.Row>
					</Card.Body>
					<Card.Footer style={{ textAlign: "right" }}>
						<Link
							to={"login/"}
							className="btn btn-sm btn-info"
						>
							<FontAwesomeIcon icon={faArrowLeft}/> Back
						</Link>{" "}
						<Button
							size="sm"
							type="button"
							variant="success"
							onClick={updatePassword}
							disabled={user.email.length === 0 || user.password.length === 0}
						>
							<FontAwesomeIcon icon={faUserEdit}/> Update
						</Button>{" "}
						<Button
							size="sm"
							type="button"
							variant="info"
							onClick={resetChangePassForm}
						>
							<FontAwesomeIcon icon={faUndo}/> Reset
						</Button>
					</Card.Footer>
				</Card>
			</Col>
		</Row>
	</div>);
};

export default ChangePassword;
