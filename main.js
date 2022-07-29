    const book = [];
    const RENDER_EVENT = 'render-book';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
    submitForm.value = "";
    event.preventDefault();
    addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});
// search book
    document.getElementById('searchBookTitle').addEventListener('input', filterList);

    function filterList () {
        const searchInput = document.getElementById('searchBookTitle');
        const filter = searchInput.value.toLowerCase();
        const listBooks = document.querySelectorAll('.book_item');
        
        listBooks.forEach((element) => {
            let text = element.textContent;
            if(text.toLowerCase().includes(filter.toLowerCase())) {
                element.style.display = '';
            }
            else {
                element.style.display = 'none';
            }
        });
        console.log(searchInput);
    }

// select to get addbook value and run the function
function addBook() {
    const inputBookTitle = document.getElementById('inputBookTitle').value;
    const inputBookAuthor = document.getElementById('inputBookAuthor').value;
    const inputBookYear = document.getElementById('inputBookYear').value;
    const inputBookIsComplete = document.getElementById('inputBookIsComplete').checked;
    
    const bookID = bookId();
    const bookObject = generateBookObject(bookID, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete);
    book.push(bookObject);
    
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

// book id
function bookId() {
    return +new Date();
}

// book object
function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

//  make new element and run the function
function makeBook(bookObject) {
    const bookTitle = document.createElement('h3');
    bookTitle.innerText = bookObject.title;
    
    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = bookObject.author;
    
    const bookYear = document.createElement('p');
    bookYear.innerText = bookObject.year;
    
    const textContainer = document.createElement('div');
    textContainer.classList.add('book_item');
    textContainer.append(bookTitle, bookAuthor, bookYear);
    
    const container = document.createElement('article');
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);

        if (bookObject.isCompleted) {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('action');
        const incompleteBookshelfListButton = document.createElement('button');
        incompleteBookshelfListButton.classList.add('green');
        incompleteBookshelfListButton.innerText = ('Unread');
    
        incompleteBookshelfListButton.addEventListener('click', function () {
        undoBookFromCompleted(bookObject.id);
        });
    
        const deleteBookshelfButton = document.createElement('button');
        deleteBookshelfButton.classList.add('red');
        deleteBookshelfButton.innerText = ('Delete');
    
        deleteBookshelfButton.addEventListener('click', function () {
        removeBookFromCompleted(bookObject.id);
        });
        
        buttonContainer.append(incompleteBookshelfListButton, deleteBookshelfButton);
        textContainer.append(buttonContainer);
        
    } else {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('action');
        const completeBookshelfListButton = document.createElement('button');
        completeBookshelfListButton.classList.add('green');
        completeBookshelfListButton.innerText = ('Already Read');
        
        completeBookshelfListButton.addEventListener('click', function () {
        addBookToCompleted(bookObject.id);
        });

        const deleteBookshelfButton = document.createElement('button');
        deleteBookshelfButton.classList.add('red');
        deleteBookshelfButton.innerText = ('Delete');
    
        deleteBookshelfButton.addEventListener('click', function () {
        removeBookFromCompleted(bookObject.id);
        });
        
        buttonContainer.append(completeBookshelfListButton, deleteBookshelfButton);
        textContainer.append(buttonContainer);
        
    }
    updateDataToStorage();
    return container;
}

    document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.getElementById('incompleteBookshelfList');
    uncompletedBookList.innerHTML = '';

    const completedBookList = document.getElementById('completeBookshelfList');
    completedBookList.innerHTML = '';
    
        for (const bookItem of book) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) 
        uncompletedBookList.append(bookElement);
        else
        completedBookList.append(bookElement);{   
    }
    updateDataToStorage();
}});

// addbook function
function addBookToCompleted (bookId) {
    const bookTarget = findBook(bookId);
    
    if (bookTarget == null) return;
    
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    alert('ALREDY READ?');
    saveData();
}

function findBook(bookId) {
    for (const bookItem of book) {
        if (bookItem.id === bookId) {
        return bookItem;
        }
    }
    return null;
}

// delete book function
function removeBookFromCompleted(bookId) {
const bookTarget = finBookIndex(bookId);

if (bookTarget === -1) return;

book.splice(bookTarget, 1);
document.dispatchEvent(new Event(RENDER_EVENT));
alert('ARE U SURE?');
updateDataToStorage();
}

// undo book function
function undoBookFromCompleted(bookId) {
const bookTarget = findBook(bookId);

if (bookTarget == null) return;

bookTarget.isCompleted = false;
document.dispatchEvent(new Event(RENDER_EVENT));
alert('UNREAD?');
saveData();
}

function finBookIndex(bookId) {
    for (const index in book) {
        if (book[index].id === bookId) {
        return index;
        }
    }
    
    return -1;
}

// saved data function
function saveData() {
    if (isStorageExist()) {
    const parsed = JSON.stringify(book);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Your browser does not support local storage');
        return false;
    }
    return true;
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
    for (const note of data) {
        book.push(note);
    }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

// update data storage
function updateDataToStorage() {
    if(isStorageExist())
        saveData();
}
