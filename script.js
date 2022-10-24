const books = [];
const RENDER_EVENT = 'render-book';

function addBook() {
    const inputJudul = document.getElementById('inputBookTitle').value;
    const inputPenulis = document.getElementById('inputBookAuthor').value;
    const inputTahun = parseInt(document.getElementById('inputBookYear').value);
    const isComplete = document.getElementById('inputBookIsComplete').checked;
    const bookId = generateId();
    const bookObject = generateBookObject(bookId, inputJudul, inputPenulis, inputTahun, isComplete, false);
    books.push(bookObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
}
   
function generateBookObject(id, title, author, year, isComplete) {
    return {
      id,
      title,
      author,
      year,
      isComplete,
    }
}

function makeBook(bookObject) {
    const inputJudul = document.createElement('h3');
    inputJudul.innerText = bookObject.title;

    const inputPenulis = document.createElement('p');
    inputPenulis.innerText = bookObject.author;

    const inputTahun = document.createElement('p');
    inputTahun.innerText = bookObject.year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('book_item');
    textContainer.append(inputJudul, inputPenulis, inputTahun);

    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(textContainer);
    container.setAttribute('id', 'book-${bookObject.id}')

    const btnAct = document.createElement('div');
    btnAct.classList.add('action');

    if (bookObject.isComplete) {
        const undoButton = document.createElement("button");
        undoButton.classList.add("green");
        undoButton.innerText = "Belum selesai dibaca";
        undoButton.addEventListener("click", function () {
            undoButton(bookList.id);
        });

        const removeButton = document.createElement("button");
        removeButton.classList.add("red");
        removeButton.innerText = "Hapus Buku";
        removeButton.addEventListener("click", function () {
            removeBooks(bookList.id);
            alert('Jangan lupa baca buku ini lagi yaa...')
        });

        btnAct.append(incompleteButton, removeButton);

    } else {
        const completeButton = document.createElement("button");
        completeButton.classList.add("green");
        completeButton.innerText = "Selesai dibaca";
        completeButton.addEventListener("click", function () {
            addBookToCompleted(bookList.id);
        });

        const removeButton = document.createElement("button");
        removeButton.classList.add("red");
        removeButton.innerText = "Hapus Buku";
        removeButton.addEventListener("click", function () {
            removeBooks(bookList.id);
            alert('Menghapus buku')
        });

        btnAct.append(completeButton, removeButton);
    }

    container.append(btnAct);
    return container;
}

function addBookToCompleted (bookId) {
    const bookTarget = findBook(bookId);
 
    if (bookTarget == null) return;
 
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}
 
function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function removeBooks(bookId) {
    const bookTarget = findBookIndex(bookId);
 
    if (bookTarget === -1) return;
 
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
 
    if (bookTarget == null) return;
 
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
 
    return -1;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function isStorageExist(){
    if(typeof(Storage) === undefined){
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function loadDataFromStorage(){
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    if (data !== null){
        for(const book of data){
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
    });

    if (isStorageExist()){
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function () {
    //console.log(books);
    const uncompletedBOOKList = document.getElementById('incompleteBookshelfList');
    uncompletedBOOKList.innerHTML = '';
 
    const completedBOOKList = document.getElementById('completeBookshelfList');
    completedBOOKList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) {
            uncompletedBOOKList.append(bookElement);
        } else {
            completedBOOKList.append(bookElement);
        }
    }

});  

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});
