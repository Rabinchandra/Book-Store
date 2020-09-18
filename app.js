let form = document.getElementById('form');
let rBox = document.getElementById('result-box');

class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }

    static addToTable(newBook) {
        let tbody = document.getElementById('tbody');
        let tr = document.createElement('tr');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');
        let td4 = document.createElement('td');
        let span = document.createElement('span');
        td1.appendChild(document.createTextNode(newBook.title));
        td2.appendChild(document.createTextNode(newBook.author));
        td3.appendChild(document.createTextNode(newBook.isbn));
        // Delete Item Part
        span.innerHTML = '<i class="material-icons delete">clear</i>'
        td4.appendChild(span);
        td4.className = "delete-item";
        span.className = 'delete-btn';
        // Inserting to Tr
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        // Appending tr to tbody
        tbody.appendChild(tr);
    }

    static getBooks() {
        let books;
        if(localStorage.getItem('books') == null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static storeBook(newBook) {
        let books = Book.getBooks();
        books.push(newBook);
        localStorage.setItem('books', JSON.stringify(books));
    }

    // removing book
    static deleteBook(e) {
        if(e.target.parentElement.className == "delete-btn") {
            if(confirm('Do you really want to delete this book?')) {
                let pe = e.target.parentElement.parentElement.parentElement;
                let tableRows = Array.from(document.querySelectorAll('tr'));
                let tbody = document.getElementById('tbody');
                let books = Book.getBooks();
                // Removing from localStorage
                books.splice(tableRows.indexOf(pe)-1, 1);
                localStorage.setItem('books', JSON.stringify(books));
                // Removing from UI
                tbody.removeChild(pe);
                // result box
                Book.resultBox('Succesfully deleted!', true);
            }
        }
    }

    static resultBox(text, isTrue) {
        rBox.style.display = "block";
        rBox.innerHTML = text;
        if(isTrue) {
            rBox.style.backgroundColor = "#4caf50";
        } else {
            rBox.style.backgroundColor = "red";
        }
        setTimeout(function() {
            rBox.style.display = "none";
        }, 3000);
    }

    static validate(title, author, isbn) {
        if(title == '' || author == '' || isbn == '')
            return false;
        return true;
    }
}


// Event Listeners
form.addEventListener('submit', function(e) {
    e.preventDefault();
    let title = document.getElementById('book-title-input').value;
    let author = document.getElementById('author-input').value;
    let isbn = document.getElementById('isbn-input').value;
    // Validation
    if(Book.validate(title, author, isbn)) {
        let newBook = new Book(title, author, isbn);
        Book.addToTable(newBook);
        Book.storeBook(newBook);
        Book.resultBox('Succesfully Added!', true);
        // Clearing Input fields
        document.getElementById('book-title-input').value = '';
        document.getElementById('author-input').value = '';
        document.getElementById('isbn-input').value = '';
    } else {
        Book.resultBox('Please fill up all the inputs!', false);
    }
});

window.addEventListener('load', function() {
    // Adding Book data from Storage to Table
    let books = Book.getBooks();
    for(let i = 0; i < books.length; i++) {
        Book.addToTable(books[i]);
    }
});

document.body.addEventListener('click', Book.deleteBook);