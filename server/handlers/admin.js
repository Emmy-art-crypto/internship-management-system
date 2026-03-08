const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const transport = require("nodemailer-smtp-transport");
require("dotenv").config();

//mailing options and transportor
const options = {
  service: "gmail",
  auth: {
    user: process.env.EMAILFROM,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
};
const client = nodemailer.createTransport(transport(options));

// ...existing code...
// Handler to register a new faculty
const register_faculty = async (req, res, next) => {
  try {
    let password = req.body.password;
    const Fac = await db.Faculty.create(req.body);
    if (Fac) {
      let link =
        "<h4>Your have been registered as a faculty member in IMS.</h4><br/>";
      link =
        link +
        "Your default username is : <b>" +
        Fac.username +
        "</b><br/>Your default password is : <b>" +
        password +
        "</b><br/><a href='http://localhost:3000/login'>Click here to login.</a>";
      let content =
        "BEGIN:VCALENDAR\r\nPRODID:-//ACME/DesktopCalendar//EN\r\nMETHOD:REQUEST\r\n...";
      var email = {
        from: process.env.EMAILFROM,
        to: Fac.emailId,
        subject: "Registered to IMS.",
        html: link,
        icalEvent: {
          filename: "invitation.ics",
          method: "request",
          content: content,
        },
      };
      client.sendMail(email, (err, info) => {
        if (err) {
          console.log("Email sending failed:", err.message);
          return res.status(200).json({
            Fac,
            message: "Faculty registered successfully, but email notification failed. Please check email configuration."
          });
        } else if (info) {
          let message = "Email sent successfully";
          return res.status(200).json({ Fac, message });
        }
      });
    } else {
      return next(new Error("Failed to register faculty"));
    }
  } catch (err) {
    if (err.code === 11000) {
      err.message = "Sorry username is already taken.";
    }
    next(err);
  }
};

// Handler for admin login
const login_admin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    // Use .env credentials for admin
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (username !== adminEmail) {
      return res.status(401).json({ message: "Admin not found" });
    }
    if (password !== adminPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // Create a dummy admin object for token
    const admin = {
      _id: "admin",
      username: adminEmail,
      designation: "Admin"
    };
    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username,
        designation: admin.designation,
      },
      process.env.SECRET
    );
    return res.status(200).json({ token, admin });
  } catch (error) {
    next(error);
  }
};
// ...existing code...

// ...existing code...
exports.addFaculty = async (req, res, next) => {
  try {
    let password = req.body.password;
    const Fac = await db.Faculty.create(req.body);
    if (Fac) {
      let link =
        "<h4>Your have been added to IMS as a faculty member.</h4><br/>";
      link =
        link +
        "Your default username is : <b>" +
        Fac.username +
        "</b><br/>Your default password is : <b>" +
        password +
        "</b><br/><a href='http://localhost:3000/login'>Click here to login.</a>";
      let content =
        "BEGIN:VCALENDAR\r\nPRODID:-//ACME/DesktopCalendar//EN\r\nMETHOD:REQUEST\r\n...";
      var email = {
        from: process.env.EMAILFROM,
        to: Fac.emailId,
        subject: "Registered to IMS.",
        html: link,
        icalEvent: {
          filename: "invitation.ics",
          method: "request",
          content: content,
        },
      };
      client.sendMail(email, (err, info) => {
        if (err) {
          console.log("Email sending failed:", err.message);
          // Don't fail the faculty creation if email fails
          return res.status(200).json({
            Fac,
            message: "Faculty added successfully, but email notification failed. Please check email configuration."
          });
        } else if (info) {
          let message = "Email sent successfully";
          return res.status(200).json({ Fac, message });
        }
      });
    } else {
      return next(new Error("Failed to create faculty"));
    }
  } catch (err) {
    if (err.code === 11000) {
      err.message = "Sorry username is already taken.";
    }
    next(err);
  }
};

exports.findFaculty = async (req, res, next) => {
  try {
    const { user } = req.params;
    const faculty = await db.Faculty.findOne({ username: user });
    if (!faculty) {
      throw new Error("Faculty not found");
    }
    return res.status(200).json(faculty);
  } catch (error) {
    next({
      status: 400,
      message: error.message,
    });
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const faculties = await db.Faculty.find().populate("faculties");
    res.status(200).json(faculties);
  } catch (err) {
    next({
      status: 400,
      message: err.message,
    });
  }
};

exports.deleteFaculty = async (req, res, next) => {
  try {
    const { user } = req.params;
    const faculty = await db.Faculty.findOne({ username: user });
    if (!faculty) throw new Error("Faculty not found");
    await faculty.remove();
    return res.status(200).json("Faculty deleted");
  } catch (error) {
    next({
      status: 400,
      message: error.message,
    });
  }
};

exports.showProfile = async (req, res, next) => {
  try {
    const { id, designation } = req.decoded;

    // For admin users, return profile data from token since they don't have a Faculty document
    if (designation === "Admin") {
      const adminProfile = {
        _id: id,
        username: req.decoded.username,
        designation: designation,
        // Add any other admin-specific fields as needed
      };
      return res.status(200).json(adminProfile);
    }

    // For faculty users, find their profile in the database
    const Profile = await db.Faculty.findOne({ _id: id, designation: "Admin" });
    if (Profile) {
      return res.status(200).json(Profile);
    } else {
      throw new Error("Not an admin.");
    }
  } catch (error) {
    next({
      status: 400,
      message: error.message,
    });
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const Profile = await db.Faculty.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          "name.firstname": req.body.firstname,
          "name.lastname": req.body.lastname,
          emailId: req.body.emailId,
          department: req.body.department,
          designation: req.body.designation,
        },
      },
      { new: true }
    );
    if (Profile) {
      return res.status(200).json(Profile);
    } else {
      throw new Error("Not an admin.");
    }
  } catch (error) {
    next({
      status: 400,
      message: error.message,
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  const { oldpassword, newpassword } = req.body;
  const { id } = req.params;
  try {
    const Fac = await db.Faculty.findById({ _id: id });
    const valid = await Fac.comparePassword(oldpassword);
    if (valid) {
      const newhashed = await bcrypt.hash(newpassword, 10);
      const Profile = await db.Faculty.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            password: newhashed,
          },
        },
        { new: true }
      );
      if (Profile) {
        return res.status(200).json(Profile);
      } else {
        throw new Error("Admin not found!");
      }
    } else {
      throw new Error("Old password is wrong!");
    }
  } catch (err) {
    next(err);
  }
};

exports.findAllStudents = async (req, res, next) => {
  try {
    const students = await db.Student.find().populate();
    res.status(200).json(students);
  } catch (err) {
    next({
      status: 400,
      message: err.message,
    });
  }
};

exports.SomeStudents = async (req, res, next) => {
  try {
    const YEAR = req.query.YEAR;
    const DIV = req.query.DIV;
    const students = await db.Student.find({
      "currentClass.year": YEAR,
      "currentClass.div": DIV,
    });
    res.status(200).json(students);
  } catch (err) {
    next({
      status: 400,
      message: err.message,
    });
  }
};

exports.deletestudent = async (req, res, next) => {
  try {
    const arr = req.body;
    const student = await db.Student.deleteMany({
      _id: {
        $in: arr,
      },
    });

    if (!student) {
      throw new Error("Student not found");
    } else {
      return res.status(200).json("Student deleted");
    }
  } catch (error) {
    next({
      status: 400,
      message: error.message,
    });
  }
};

// Export all handler functions directly
module.exports = {
  register_faculty,
  login_admin,
  addFaculty: exports.addFaculty,
  findFaculty: exports.findFaculty,
  findAll: exports.findAll,
  deleteFaculty: exports.deleteFaculty,
  showProfile: exports.showProfile,
  updateProfile: exports.updateProfile,
  resetPassword: exports.resetPassword,
  findAllStudents: exports.findAllStudents,
  SomeStudents: exports.SomeStudents,
  deletestudent: exports.deletestudent
};
