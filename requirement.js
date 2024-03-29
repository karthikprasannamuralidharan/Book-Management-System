// Requirements for our project

// Book management company

// Books => // ISBN No:, title, publication date, language, no: of pages, author[] (1 book can be written by lot of authors), publications[], category[]

// Authors => ID, name, books[]

// Publications => id, name, books[]

// APIs we need are => 

// For Books => to get all 1. books, 2. specific book, list of books based on 3. category & 4. languages
 
// for authors => to get 1. all authors, 2.specific authors, 3. list of authors based on books

// for publications => to get 1. all publications, 2. specific publications, 3. list of publications based on book

// POST REQUESTS

// Add new 1. books, 2. authors and 3. publications

// PUT REQUEST FOR UPDATING

// 1. Book 2. Publication
// One book can only be published by just 1 publication  => So assume we made a mistake that book with isbn 12345Book was written by publication object with id 1 but was actually written by id 2 so now we update it 