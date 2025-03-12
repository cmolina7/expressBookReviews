const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  // Register a new user
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

let getAllBooksPromise = new Promise ((resolve,reject) => {
    setTimeout(() => {
      resolve(books)
    },1000)})

// Get the book list available in the shop
public_users.get('/',function (req, res) {
   getAllBooksPromise.then((books) => {
    res.send(JSON.stringify(books,null));
    console.log("Success")
      })
});

// Get book details based on ISBN
function getBookByISBNPromise(isbn) {
    return new Promise ((resolve, reject) => {
    setTimeout(() => {
      resolve(books[isbn])
    },1000)})
}

public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn; 
    getBookByISBNPromise(isbn).then((book)=>
        res.send(book)
    )
});
  
// Get book details based on author
function getBookByAuthorPromise(author) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let booksres = {};
            for (const isbn in books) {
                if (books[isbn].author === author) {
                    booksres[isbn] = books[isbn];
                }
            }
            resolve(booksres)
        }, 1000)
    })
}

public_users.get('/author/:author', function (req, res) {
    //Write your code here
    const author = req.params.author;
    getBookByAuthorPromise(author).then((booksres) => {
        res.send(JSON.stringify(booksres, null))
    })
});

// Get all books based on title
function getBookByTitlePromise(title) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let booksres = {};
            for (const isbn in books) {
                if (books[isbn].title === title) {
                    booksres[isbn] = books[isbn];
                }
            }
            resolve(booksres)
        }, 1000)
    })
}

public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    getBookByTitlePromise(title).then((booksres) => {
        res.send(JSON.stringify(booksres, null))
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
 const isbn = req.params.isbn;
   res.send(books[isbn].reviews);
});

module.exports.general = public_users;
