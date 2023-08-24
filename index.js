const express = require("express");

const database = require("./database");

//Initialize
const booky = express();

/*
route           -   /root
description     -   get all book
access          -   public
parametes       -   none
methods         -   get
*/
booky.get("/", (req,res) => {
    return res.json({books: database.books});
});

//to get specific book
/*
route           -   /root
description     -   get specific book
access          -   public
parametes       -   isbn
methods         -   get
*/
booky.get("/:isbn", (req,res) => {
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

//to get specific book
/*
route           -   /c
description     -   get specific book based on category
access          -   public
parametes       -   category
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

booky.listen(3000,() => console.log("Server is running"));