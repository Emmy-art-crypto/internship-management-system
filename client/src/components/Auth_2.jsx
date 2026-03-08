import React, { Component } from "react";
import { connect } from "react-redux";
import { authUser, authUser_faculty, logout } from "../store/actions";
import { Link } from "react-router-dom";
import { MdError } from "react-icons/md";
import ErrorMessage from "../components/ErrorMessage";

class Auth_2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      emailId: "",
      confirmpassword: "",
      message: "",
      userType: "student",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleConfirmPassword = this.handleConfirmPassword.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    if (this.state.password === this.state.confirmpassword) {
      const { username, password, emailId, userType } = this.state;
      const { authType } = this.props;
      e.preventDefault();
      if (userType === "student") {
        this.props.authUser(authType || "register", {
          username,
          password,
          emailId,
        });
      } else if (userType === "faculty") {
        this.props.authUser_faculty("register_faculty", {
          username,
          password,
          emailId,
        });
      }
    } else {
      alert("Error! Check form fields again... ");
    }
  }
  handleConfirmPassword(e) {
    this.setState({ [e.target.name]: e.target.value });
    if (this.state.password !== e.target.value) {
      this.setState({ message: "Passwords do not match!" });
    } else {
      this.setState({ message: "" });
    }
  }

  render() {
    const { username, password, emailId, confirmpassword, userType } = this.state;
    return (
      <div className="section">
        <div className="container">
          <div className="user signinBx">
            <div className="imgBx">
              <p>Internship Management System</p>
            </div>
            <div className="formBx">
              <form className="beautiful-form" onSubmit={this.handleSubmit}>
                <div className="Errorbox">
                  <div className="my-4 text-center" style={{ zIndex: "10" }}>
                    <ErrorMessage />
                  </div>
                </div>
                <h2 className="form-title">Register Account</h2>
                <div className="form-card">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="input-group">
                        <label htmlFor="userType" className="input-label">User Type</label>
                        <select
                          name="userType"
                          value={userType}
                          onChange={this.handleChange}
                          className="input-field"
                          required
                        >
                          <option value="student">Student</option>
                          <option value="faculty">Faculty</option>
                        </select>
                      </div>
                      <div className="input-group">
                        <label htmlFor="username" className="input-label">Username</label>
                        <input
                          required
                          type="text"
                          value={username}
                          name="username"
                          placeholder="Enter your username"
                          className="input-field"
                          autoComplete="off"
                          onChange={this.handleChange}
                        />
                      </div>
                      <div className="input-group">
                        <label htmlFor="emailId" className="input-label">Email</label>
                        <input
                          required
                          type="email"
                          value={emailId}
                          name="emailId"
                          placeholder="Enter your email"
                          className="input-field"
                          autoComplete="off"
                          onChange={this.handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group">
                        <label htmlFor="password" className="input-label">Password</label>
                        <input
                          required
                          type="password"
                          value={password}
                          name="password"
                          placeholder="Create a password"
                          className="input-field"
                          autoComplete="off"
                          onChange={this.handleChange}
                        />
                      </div>
                      <div className="input-group">
                        <label htmlFor="confirmpassword" className="input-label">Confirm Password</label>
                        <input
                          required
                          type="password"
                          value={confirmpassword}
                          name="confirmpassword"
                          placeholder="Confirm your password"
                          className="input-field"
                          autoComplete="off"
                          onChange={this.handleConfirmPassword}
                        />
                      </div>
                      {this.state.message && (
                        <small className="text-danger">
                          <span className="mr-1">
                            <MdError style={{ margin: -2, padding: -2 }} color="crimson" />
                          </span>
                          {this.state.message}
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="form-actions mt-3">
                    <Link className="btn-custom mr-2" to="/login">
                      <b>Login</b>
                    </Link>
                    <button className="btn-custom" type="submit">Register</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(() => ({}), { authUser, authUser_faculty, logout })(Auth_2);
