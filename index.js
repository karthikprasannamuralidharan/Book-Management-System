const express = require("express");

var bodyParser = require("body-parser");

const database = require("./database");

//Initialize
const booky = express();
booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

/*
route           -   /books
description     -   get all book
access          -   public
parameters       -   none
methods         -   get
*/
booky.get("/books", (req,res) => {
    return res.json({books: database.books});
});

/*
route           -   /books
description     -   get specific book
access          -   public
parameters       -   isbn
methods         -   get
*/
booky.get("/books/:isbn", (req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn
    );

    if(getSpecificBook.length === 0){
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

booky.listen(3000,() => console.log("Server is running"));