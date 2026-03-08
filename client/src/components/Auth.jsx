import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";

import {
  authUser,
  logout,
  authUser_f,
  logout_f,
  authUser_a,
} from "../store/actions";

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      User_type: "1",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { username, password, User_type } = this.state;
    const { authType } = this.props;
    const { authUser, authUser_a, authUser_f } = this.props;
    if (User_type === "1") {
      authUser(authType || "login", { username, password });
    }
    if (User_type === "2") {
      authUser_f("login_faculty", { username, password });
    }
    if (User_type === "3") {
      authUser_a("login_admin", { username, password });
    }
  }

  render() {
    const { username, password } = this.state;
    return (
      <div className="section">
        <div className="container">
          <div className="user signinBx">
            <div className="imgBx">
              <p>Internship Management System</p>
            </div>
            <div className="formBx">
              <form className="glass-form" onSubmit={this.handleSubmit}>
                <div className="Errorbox">
                  <div className="my-4 text-center" style={{ zIndex: "10" }}>
                    <ErrorMessage />
                  </div>
                </div>
                <h2 className="form-title">Sign In</h2>
                <div className="form-card">
                  <div className="input-group">
                    <label htmlFor="username" className="input-label">Username or Email</label>
                    <input
                      required
                      type="text"
                      value={username}
                      name="username"
                      placeholder="Enter your username or email"
                      className="input-field"
                      autoComplete="off"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="password" className="input-label">Password</label>
                    <input
                      required
                      type="password"
                      value={password}
                      name="password"
                      placeholder="Enter your password"
                      className="input-field"
                      autoComplete="off"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="User_type" className="input-label">Login as</label>
                    <select
                      name="User_type"
                      defaultValue="1"
                      onChange={this.handleChange}
                      className="input-field"
                      id="exampleFormControlSelect1"
                    >
                      <option name="student" value="1">Student</option>
                      <option name="faculty" value="2">Faculty</option>
                      <option name="admin" value="3">Admin</option>
                    </select>
                  </div>
                  <p className="signup">
                    <a href="/forgotpassword">Forgot password?</a>
                  </p>
                  <div className="form-actions">
                    <Link className="btn-custom mr-2" style={{ textDecoration: "none", display: "inline-block" }} to="/register">
                      <b>Register</b>
                    </Link>
                    <button className="btn-custom" type="submit" style={{ display: "inline-block" }}>Login</button>
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

export default connect(() => ({}), {
  authUser,
  logout,
  authUser_f,
  logout_f,
  authUser_a,
})(Auth);
