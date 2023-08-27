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

// booky.get("/books", (req,res) => {
//     return res.json({book: database.books});
// });

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
        getSpecificBook
    });
});

/*
route           -   /c
description     -   get specific book based on category
access          -   public
parameters       -   category
methods         -   get
*/
booky.get("/c/:category", async (req,res) => {

    const getSpecificBook = await BookModel.findOne({category: req.params.category});
    
    // const getSpecificBook = database.books.filter(
    //     (book) => book.category.includes(req.params.category)
    // )

    if(!getSpecificBook){
        return res.json({
            error: `Specified Book with category ${req.params.category} not found`
        });
    }
    return res.json({
        getSpecificBook
    });
});

/*
route           -   /author
description     -   get all authors
access          -   public
parameters       -   category
methods         -   get
*/
//RESTFUL API
// booky.get("/author", (req,res) => {
//     return res.json({author: database.author});
// });

//MONGOOSE
booky.get("/author", async (req,res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors);

    // return res.json({author: database.author});
});

/*
route           -   /publicatons
description     -   get all publications
access          -   public
parameters       -   none
methods         -   get
*/
booky.get("/publication", async (req,res) => {
    const getAllPublications = await PublicationModel.find();
    return res.json(getAllPublications);
    
    // return res.json({publication: database.publication});
});


/*
route           -   /author
description     -   get list of authors based on book
access          -   public
parametes       -   isbn
methods         -   get
*/
booky.get("/author/:isbn", async (req,res) => {
    const getSpecificAuthor = await AuthorModel.findOne({books: req.params.isbn});


    // const getSpecificAuthor = database.author.filter(
    //     (author) => author.books.includes(req.params.isbn)
    // );

    if(!getSpecificAuthor){
        return res.json({
            error: `Specified author with ISBN ${req.params.isbn} not found`
        });
    
    }
    else return res.json({
       getSpecificAuthor
    });
});

/*
route           -   /addBooks
description     -   Add new books 
access          -   public
parameters       -   none
methods         -   post
*/
booky.post("/addBooks", async (req,res) => {
    const {newBook} = req.body;
    const addNewBook = BookModel.create(newBook)
    // database.books.push(newBook);
    return res.json({
        books: addNewBook,
        message: "Book added successfully"
    });
});

/*
route           -   /addAuthors
description     -   Add new authors
access          -   public
parameters       -   none
methods         -   post
*/
//RESTUFL API
// booky.post("/addAuthors", (req,res) => {
//     const newAuthor = req.body;
//     database.author.push(newAuthor);
//     return res.json({updatedAuthors: database.author});
// });

//MONGOOSE
booky.post("/addAuthors", async (req,res) => {
    const {newAuthor} = req.body;
    AuthorModel.create(newAuthor);
    return res.json({
        author : database.author,
        message : "successfully added new author"
    });
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
route       - /books/update
description - Update book title based on isbn
access      - public
parameters  - isbn
methods     - put
*/
//MONGODB
booky.put("/books/update/:isbn", async (req,res) => {
    const updateBook = await BookModel.findOneAndUpdate(
        {
            ISBN : req.params.isbn
        },
        {
            title : req.body.bookTitle
        },
        {
            new : true
        }
    );
    return res.json({books : database.books});
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
//RESTFUL API
// booky.delete("/book/delete/:isbn", (req,res) => {
//     const updatedBooksDatabase = database.books.filter(
//         (book) => book.ISBN !== req.params.isbn
//     )
//     database.books = updatedBooksDatabase;

//     return res.json({
//         books: database.books
//     });
// });

//MONGOOSE
booky.delete("/book/delete/:isbn", async (req,res) => {
    const updateBook = await BookModel.findOneAndDelete(
        {
            ISBN : req.params.isbn
        }
    );
    return res.json({books: database.books});
});

/*
route       - /book/delete/author
description - to delete an author from book & vice-versa
access      - public
parameters  - isbn & author id
methods     - delete
*/
//RESTFUL API
// booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
//     //Update book db
//     database.books.forEach((book) => {
//         if(book.ISBN === req.params.isbn){
//             const updatedAuthorList = book.author.filter((author) => author !== parseInt(req.params.authorId));
//             book.author = updatedAuthorList;
//             return;
//         }

//     });
//     database.author.forEach((author) => {
//         if(author.id === parseInt(req.params.authorId)){
//             const updatedBookList = author.books.filter((book) => book !== (req.params.isbn));
//             author.books = updatedBookList;
//             return;
//         }
//     });
//     return res.json({
//         books: database.books,
//         author: database.author,
//         message: "Author was deleted!!!!"
//     })
// });

//MONGOOSE
booky.delete("/book/delete/author/:isbn/:authorId", async (req,res) => {
    const updatedBookList = await BookModel.findOneAndUpdate(
        {
            ISBN : req.params.isbn
        },
        {
            $pull : {
                authors : parseInt(req.params.authorId)
            }
        },
        {
            new : true
        }
    );
   

    const updatedAuthorList = await AuthorModel.findOneAndUpdate(
        {
            id : parseInt(req.params.authorId)
        },
        {
            $pull : {
                books : req.params.isbn
            }
        },
        {
            new : true
        }

    );
    return res.json(updatedBookList, updatedAuthorList); 
});


booky.listen(3000,() => console.log("Server is running"));