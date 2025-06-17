const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	if (username && password) {
		if (!isValid(username)) {
			return res.send("Username already taken, please provide another one.");
		} else {
			let user = {
				"username": username,
				"password": password
			}

			users.push(user);
			return res.send(`User ${username} successfully registered, please proceed to the login.`);
		}
	} else {
		return res.send("Username or password is not provided!");
	};
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
	res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
	let book = books[req.params.isbn];
	res.json(book);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
	const author = req.params.author;
	for (let book of Object.values(books)) {
		if (book.author === author) {
			return res.json(book);
		}
	}
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
	const title = req.params.title;
	for (let book of Object.values(books)) {
		if (book.title === title) {
			return res.json(book);
		}
	}
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
	const isbn = req.params.isbn;
	res.json(books[isbn].reviews);
});

module.exports.general = public_users;
