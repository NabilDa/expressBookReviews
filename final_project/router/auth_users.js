const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
	let user = users.filter((user) => user.username === username);
	if (user.length > 0) {
		return false;
	}
	return true;
}

const authenticatedUser = (username, password) => { //returns boolean
	const user = {
		"username": username,
		"password": password
	};
	let userMatch = users.filter((user) => user.username === username && user.password === password);

	if (userMatch.length > 0) {
		return true;
	} else {
		return false;
	};
}

//only registered users can login
regd_users.post("/login", (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(404).json({ message: "Error logging in." });
	}

	if (!authenticatedUser(username, password)) {
		return res.status(400).json({ message: "User not found, please register first." });
	} else {
		let accessToken = jwt.sign({ data: password }, "access", { expiresIn: 60 * 60 });

		req.session.authorization = {
			accessToken,
			username
		}

		return res.status(200).send("User successfully logged in!");
	}
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
	const isbn = req.params.isbn;
	const username = req.session.authorization["username"];
	const review = req.query.review;

	books[isbn].reviews[username] = review;
	return res.send("Review added successfuly!");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
	const isbn = req.params.isbn;
	const username = req.session.authorization["username"];

	delete books[isbn]["reviews"][username];
	return res.send("Review deleted successfully!");
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
