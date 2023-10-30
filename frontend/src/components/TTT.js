import React, { Component } from "react";
import { Toast } from "react-bootstrap";
import { connect } from "react-redux";

class TTT extends Component {
	constructor(props) {
		super(props);
		this.state = {
			...props
		}
	}
	
	initialState = {
		show: false,
		type: "",
		message: "",
	}
	
	toastCss = {
		position: "fixed",
		top: "10px",
		right: "10px",
		zIndex: "1",
		boxShadow:
			"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
	};
	
	render() {
		console.log(this.props)
		console.log(this.state)
		return (
			<Toast
				key={this.props.state.currentProduct.id}
				autohide={true} delay={5}
				// data-testid="toast"
				className={`border text-white ${
					this.state.type === "success"
						? "border-success bg-success"
						: "border-danger bg-danger"
				}`}
				show={this.props.state.show}
			>
				<Toast.Header
					className={`text-white ${
						this.props.state.type === "success" ? "bg-success" : "bg-danger"
					}`}
				>
					<strong className="mr-auto">Success</strong>
				</Toast.Header>
				<Toast.Body
				>{this.props.state.message}</Toast.Body>
			</Toast>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		// show: state.show,
		// type: state.type,
		// message: state.message,
	};
};

const mapDispatchToProps = () => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(TTT);