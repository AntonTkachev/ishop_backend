import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUserPlus,
	faSignInAlt,
	faSignOutAlt,
	faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { logoutUser } from "../services/index";
import jwt from 'jwt-decode';

const NavigationBar = () => {
	const auth = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const logout = () => {
		dispatch(logoutUser());
	};
	
	const guestLinks = (
		<>
			<div className="mr-auto"></div>
			<Nav className="navbar-right">
				<Link to={"/register"} className="nav-link">
					<FontAwesomeIcon icon={faUserPlus}/> Register
				</Link>
				<Link to={"/login"} className="nav-link">
					<FontAwesomeIcon icon={faSignInAlt}/> Login
				</Link>
			</Nav>
		</>
	);
	const adminLinks = (
		<>
			<Nav className="mr-auto">
				<Link to={"/add"} className="nav-link">
					Add Product
				</Link>
				<Link to={"/list"} className="nav-link">
					Product List
				</Link>
				<Link to={"/users"} className="nav-link">
					User List
				</Link>
			</Nav>
			<Nav className="navbar-right">
				<Link to={"/cart"} className="nav-link">
					<FontAwesomeIcon icon={faShoppingCart}/> Cart
				</Link>
				<Link to={"/logout"} className="nav-link" onClick={logout}>
					<FontAwesomeIcon icon={faSignOutAlt}/> Logout
				</Link>
				<Nav className="nav-link">
					ADMIN
				</Nav>
			</Nav>
		</>
	);
	const ownerLinks = (
		<>
			<Nav className="mr-auto">
				<Link to={"/add"} className="nav-link">
					Add Product
				</Link>
				<Link to={"/list"} className="nav-link">
					Product List
				</Link>
			</Nav>
			<Nav className="navbar-right">
				<Link to={"/logout"} className="nav-link" onClick={logout}>
					<FontAwesomeIcon icon={faSignOutAlt}/> Logout
				</Link>
				<Nav className="nav-link">
					OWNER
				</Nav>
			</Nav>
		</>
	);
	const userLinks = (
		<>
			<Nav className="mr-auto">
				<Link to={"/list"} className="nav-link">
					Product List
				</Link>
			</Nav>
			<Nav className="navbar-right">
				<Link to={"/logout"} className="nav-link" onClick={logout}>
					<FontAwesomeIcon icon={faSignOutAlt}/> Logout
				</Link>
				<Nav className="nav-link">
					USER
				</Nav>
			</Nav>
		</>
	);
	const getLinks = () => {
		let user = {};
		let links;
		if (localStorage.jwtToken)
			user = jwt(localStorage.jwtToken);
		
		if (localStorage.isLoggedIn) {
			if (user.auth === "USER") links = userLinks
			else if (user.auth === "OWNER") links = ownerLinks
			else if (user.auth === "ADMIN") links = adminLinks
			else links = guestLinks;
		} else links = guestLinks;
		return links;
	}
	return (
		<Navbar bg="dark" variant="dark">
			<Link to={localStorage.getItem("isLoggedIn") ? "/home" : ""} className="navbar-brand">
				<img
					src="https://cdn-icons-png.flaticon.com/512/1379/1379414.png"
					width="25"
					height="25"
					alt="brand"
				/>{" "}
				IShop
			</Link>
			{getLinks()}
		</Navbar>
	);
};

export default NavigationBar;
