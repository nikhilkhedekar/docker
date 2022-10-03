const Book = require("../models/Book");
const AsyncManager = require("../utils/asyncManager");
const LibraryError = require("../utils/libraryError");

exports.createBook = AsyncManager(async (req, res, next) => {
    const newbook = await Book.create(req.body);
    return res.status(201).json(newbook);
});

exports.getAllBooks = AsyncManager(async (req, res, next) => {
    const books = await Book.find();
    return res.status(200).json(books);
});

exports.getBook = AsyncManager(async (req, res, next) => {
    const book = await Book.findById(req.params.id);

    if (!book) {
        return next(new LibraryError(`That book is not available`, 404));
    }
    return res.status(200).json(book);
});

//object id casting error
exports.getPublishedBooks = AsyncManager(async (req, res, next) => {
    const books = await Book.find({ published: true });
    return res.status(200).json(books);
});

exports.updateBook = AsyncManager(async (req, res, next) => {
    let book = await Book.findById(req.params.id);

    if (!book) {
        return next(new LibraryError(`That book is not available`, 404));
    }

    book = await Book.findOneAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    return res.status(200).json(book);
});

exports.deleteBook = AsyncManager(async (req, res, next) => {
    const book = await Book.findById(req.params.id);

    if (!book) {
        return next(new LibraryError(`That book is not available`, 404));
    }

    await book.remove();
    return res.status(200).json({ message: "The book has been deleted" });
});
