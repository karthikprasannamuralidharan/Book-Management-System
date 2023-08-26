require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

var bodyParser = require("body-parser");
//Database.js
const database = require("./database/database");
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

//Initialize express
const booky = express();
booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

//Establish Database connection
mongoose.connect(
    process.env.MONGO_URL
).then(() => console.log("Connection Established"));

/*
route           -   /books
description     -   get all book
access          -   public
parameters       -   none
methods         -   get
*/
booky.get("/books", async (req,res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});

/*
route           -   /books
description     -   get specific book
access          -   public
parameters       -   isbn
methods         -   get
*/
booky.get("/books/:isbn", async (req,res) => {

    const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});

    // const getSpecificBook = database.books.filter(
    //     (book) => book.ISBN === req.params.isbn
    // );

    if(!getSpecificBook){
        return res.json({
            error: `Specified Book with ISBN ${req.params.isbn} not found`
        });
    
    }
    else return res.json({
        specifiBook: getSpecificBook
    });
});

/*
route           -   /c
description     -   get specific book based on category
access          -   public
parameters       -   category
methods         -   get
*/
booky.get("/c/:category", (req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.category.includes(req.params.category)
    )

    if(getSpecificBook.length === 0){
        return res.json({
            error: `Specified Book with category ${req.params.category} not found`
        });
    }
    return res.json({
        specifiBook: getSpecificBook
    });
});

/*
route           -   /author
description     -   get all authors
access          -   public
parameters       -   category
methods         -   get
*/
booky.get("/author", (req,res) => {
    return res.json({author: database.author});
});

/*
route           -   /publicatons
description     -   get all publications
access          -   public
parameters       -   none
methods         -   get
*/
booky.get("/publication", (req,res) => {
    return res.json({publication: database.publication});
});


/*
route           -   /author
description     -   get list of authors based on book
access          -   public
parametes       -   isbn
methods         -   get
*/
booky.get("/author/:isbn", (req,res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.books.includes(req.params.isbn)
    );

    if(getSpecificAuthor.length === 0){
        return res.json({
            error: `Specified author with ISBN ${req.params.isbn} not found`
        });
    
    }
    else return res.json({
        specifiBook: getSpecificAuthor
    });
});

/*
route           -   /addBooks
description     -   Add new books 
access          -   public
parameters       -   none
methods         -   post
*/
booky.post("/addBooks", (req,res) => {
    const newBook = req.body;
    database.books.push(newBook);
    return res.json({updatedBooks: database.books});
});

/*
route           -   /addAuthors
description     -   Add new authors
access          -   public
parameters       -   none
methods         -   post
*/
booky.post("/addAuthors", (req,res) => {
    const newAuthor = req.body;
    database.author.push(newAuthor);
    return res.json({updatedAuthors: database.author});
});

/*
route           -   /addPublications
description     -   Add new Publications 
access          -   public
parameters       -   none
methods         -   post
*/
booky.post("/addPublications", (req,res) => {
    const newPublications = req.body;
    database.publication.push(newPublications);
    return res.json({updatedPublications: database.publication});
});

/*
route       - /publications/updateBook
description - Update publication and book
access      - public
parameters  - isbn
methods     - put
*/

booky.put("/publication/updateBook/:isbn", (req,res) => {
    //Update the publication database
  database.publication.forEach((pub) => {
    if(pub.id === req.body.pubId) {
      return pub.books.push(req.params.isbn);
    }
  });

  //Update the book database
  database.books.forEach((book) => {
    if(book.ISBN === req.params.isbn) {
      book.publications = req.body.pubId;
      return;
    }
  });
   

    return res.json({
        books: database.books,
        publications: database.publication,
        message: "Successfully updated"

    })
});

/*
route       - /book/delete/
description - to delete a book with specified isbn
access      - public
parameters  - isbn
methods     - delete
*/

booky.delete("/book/delete/:isbn", (req,res) => {
    const updatedBooksDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    )
    database.books = updatedBooksDatabase;

    return res.json({
        books: database.books
    });
});

/*
route       - /book/delete/author
description - to delete an author from book & vice-versa
access      - public
parameters  - isbn & author id
methods     - delete
*/
booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
    //Update book db
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            const updatedAuthorList = book.author.filter((author) => author !== parseInt(req.params.authorId));
            book.author = updatedAuthorList;
            return;
        }

    });
    database.author.forEach((author) => {
        if(author.id === parseInt(req.params.authorId)){
            const updatedBookList = author.books.filter((book) => book !== (req.params.isbn));
            author.books = updatedBookList;
            return;
        }
    });
    return res.json({
        books: database.books,
        author: database.author,
        message: "Author was deleted!!!!"
    })
});


booky.listen(3000,() => console.log("Server is running"));