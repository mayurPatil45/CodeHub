console.log("This is es6 version");
showBooks();

class Book {
    constructor(name, author, type) {
        this.name = name;
        this.author = author;
        this.type = type;
    }
}

class Display {
    // Method to clear LibraryForm
    clear() {
        let libraryForm = document.getElementById("libraryForm");
        libraryForm.reset();
    }

    // Function to validate book name & author
    validate(book) {
        if (book.name.length < 2 || book.author.length < 2) {
            return false;
        } else {
            return true;
        }
    }

    // Function to show message on adding books (error or success)
    show(type, displaymessage) {
        let message = document.getElementById("message");
        let boldText;
        if (type === "success") {
            boldText = "Success";
        } else {
            boldText = "Error";
        }
        message.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <strong>${boldText}:</strong> ${displaymessage}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;

        setTimeout(() => {
            message.innerHTML = "";
        }, 5000);
    }
}

// Add submit event listener to libraryForm
let libraryForm = document.getElementById("libraryForm");
libraryForm.addEventListener("submit", libraryFormSubmit);

// Function which run when book add form submitted
function libraryFormSubmit(e) {
    let name = document.getElementById("bookName").value;
    let author = document.getElementById("author").value;

    let fiction = document.getElementById("fiction");
    let programming = document.getElementById("programming");
    let finance = document.getElementById("finance");
    let type;

    if (fiction.checked) {
        type = fiction.value;
    } else if (programming.checked) {
        type = programming.value;
    } else if (finance.checked) {
        type = finance.value;
    }

    let book = new Book(name, author, type); // Create a Book object named book
    if (book.name.length > 2 && book.author.length > 2) {
        let books = localStorage.getItem("books"); // Get books from localStorage
        if (books == null) {
            bookObj = [];
        } else {
            bookObj = JSON.parse(books); // Parse books as object
        }
        bookObj.push(book);
        localStorage.setItem("books", JSON.stringify(bookObj));
        move();
    }

    // create display object
    let display = new Display();
    if (display.validate(book)) {
        showBooks();
        display.clear();
        display.show("success", "Your book has been successfully added");
    } else {
        display.show("danger", "Sorry you cannot add this book");
    }

    e.preventDefault();
}

// Function to show books
function showBooks() {
    let books = localStorage.getItem("books");
    if (books == null) {
        bookObj = [];
    } else {
        bookObj = JSON.parse(books);
    }
    let uiString = "";
    bookObj.forEach(function (element, index) {
        uiString += `<tr class="tableTr" id="table_tr_${index + 1}">
                            <th scope="row">${index + 1}</th>
                            <td>${element.name}</td>
                            <td>${element.author}</td>
                            <td>${element.type} </td>
                            <td id="butt">
                           <button class="btn btn-success" id="editBookButton" onclick="editBooks(${index});focusOnEdit(${index});">Edit</button>
                           <button class="btn btn-danger" id="deleteBookButton" onclick="deleteBooks(${index})">Delete</button>
                           </td>
                        </tr>`;
    });

    let tableBody = document.getElementById("tableBody");
    if (bookObj.length != 0) {
        tableBody.innerHTML = uiString; 
    } else {
        tableBody.innerHTML = ""; 
    }
}

// function to delete a book
function deleteBooks(index) {
    let books = localStorage.getItem("books");
    if (books == null) {
        bookObj = [];
    } else {
        bookObj = JSON.parse(books);
    }
    bookObj.splice(index, 1);
    localStorage.setItem("books", JSON.stringify(bookObj));
    showBooks();
    move(); 
}

// Search Functionality
function searchTable() {
    let input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchTxt");
    filter = input.value.toUpperCase();
    table = document.getElementById("bookTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

// Create object datatable When domcontentloaded
document.addEventListener("DOMContentLoaded", function () {
    create_datatable();
});

// Create DataTable Function
function create_datatable() {
    let table = new DataTable("#bookTable");
}

// Progressbar
let progress_i = 0;
let progress = document.getElementById("progressBar");
function move() {
    if (progress_i == 0) {
        progress_i = 1;

        let width = 1;
        let id = setInterval(frame, 5);
        let removeProgress = setTimeout(function () {
            progress.style.width = "0%";
        }, 500);
        function frame() {
            if (width >= 100) {
                clearInterval(id);
                progress_i = 0;
            } else {
                width = width + 5;
                progress.style.width = width + "%";
            }
        }
    }
}

// Function to edit books
function editBooks(index) {
    let books = localStorage.getItem("books");
    if (books == null) {
        bookObj = [];
    } else {
        bookObj = JSON.parse(books);
    }

    // Check type and show first on option
    let typeStringFiction = "";
    let typeStringProgramming = "";
    let typeStringFinance = "";
    if (bookObj[index].type == "Fiction") {
        typeStringFiction = `selected`;
    } else if (bookObj[index].type == "Programming") {
        typeStringProgramming = "selected";
    } else if (bookObj[index].type == "Finance") {
        typeStringFinance = "selected";
    }

    // UIString For changing the ui when edit action performed
    let uiString = "";
    uiString += `<tr class="tableTr">
                            <th scope="row">${index + 1}</th> 
                            <td><input type="text" id="editName_${index + 1
        }" class="form-control" value="${bookObj[index].name
        }" onfocus="this.setSelectionRange(this.value.length,this.value.length);"
                            ></td>
                            <td><input type="text" id="editAuthor_${index + 1
        }" class="form-control" value="${bookObj[index].author
        }"></td>
                            <td><select class="form-select" name="type" id="type_edit_${index + 1
        }">
                            <option id="edit_fiction" value="Fiction" ${typeStringFiction}>Fiction</option>
                            <option id="edit_programming" value="Programming" ${typeStringProgramming}>Computer Programming</option>
                            <option id="edit_finance" value="Finance" ${typeStringFinance}>Finance</option>
                          </select></td>
                            <td id="butt">
                           <button class="btn btn-primary" id="saveBookButton" onclick="saveBooks(${index});showAfterEdit(${index})">Save</button>
                           <button class="btn btn-danger" id="cancelBookButton" onclick="showAfterEdit(${index})">Cancel</button>
                           </td>
                        </tr>`;
    // });

    let editTableTr = document.getElementById(`table_tr_${index + 1}`);

    if (bookObj.length != 0) {
        editTableTr.innerHTML = uiString;
    }
}

function saveBooks(index) {
    let author = document.getElementById(`editAuthor_${index + 1}`).value;

    let select = document.getElementById(`type_edit_${index + 1}`);
    let type = select.value;

    let book = new Book(name, author, type);
    if (book.name.length > 2 && book.author.length > 2) {
        let books = localStorage.getItem("books");
        if (books == null) {
            bookObj = [];
        } else {
            bookObj = JSON.parse(books);
            bookObj[index].name = bookObj[index].name.replace(
                `${bookObj[index].name}`,
                `${book.name}`
            );
            bookObj[index].author = bookObj[index].author.replace(
                `${bookObj[index].author}`,
                `${book.author}`
            );
            bookObj[index].type = bookObj[index].type.replace(
                `${bookObj[index].type}`,
                `${book.type}`
            );
        }

        localStorage.setItem(`books`, JSON.stringify(bookObj));
        create_datatable(index);
        move();
    }

    // create display object
    let display = new Display();
    if (display.validate(book)) {
        display.show("success", "Your book has been successfully updated");
    } else {
        display.show("danger", "Sorry you cannot update this book");
    }
    console.log("Save", index);
}

// Function to change ui after edit book
function showAfterEdit(index) {
    let books = localStorage.getItem("books");
    if (books == null) {
        bookObj = [];
    } else {
        bookObj = JSON.parse(books); // If books are present in local storage parse them into objects
    }

    // UIString For changing the ui when edit action completed and back to normal ui
    let uiString = "";
    uiString += `<tr class="tableTr" id="table_tr_${index + 1}">
        <th scope="row">${index + 1}</th>
        <td>${bookObj[index].name}</td>
        <td>${bookObj[index].author}</td>
        <td>${bookObj[index].type} </td>
        <td id="butt">
       <button class="btn btn-success" id="editBookButton" onclick="editBooks(${index});focusOnEdit(${index});">Edit</button>
       <button class="btn btn-danger" id="deleteBookButton" onclick="deleteBooks(${index})">Delete</button>
       </td>
    </tr>`;

    let editTableTr = document.getElementById(`table_tr_${index + 1}`);
    if (bookObj.length != 0) {
        editTableTr.innerHTML = uiString;
    }
}

// Function to focus on edit button clicked (Experimental)
function focusOnEdit(index) {
    document.getElementById(`editName_${index + 1}`).focus();
}

// Define the types and labels
const types = [
    { value: "Fiction", label: "Fiction" },
    { value: "Non-Fiction", label: "Non-Fiction" },
    { value: "Science", label: "Science" },
    { value: "Romance", label: "Romance" },
    { value: "Fantasy", label: "Fantasy" },
    { value: "Horror", label: "Horror" },
    { value: "Biography", label: "Biography" },
    { value: "History", label: "History" },
    { value: "Poetry", label: "Poetry" },
    { value: "Self-Help", label: "Self-Help" },
];

// Function to generate radio button options
function generateTypeOptions() {
    const typeOptionsContainer = document.getElementById('typeOptions');

    types.forEach(type => {
        const optionDiv = document.createElement('div');
        optionDiv.classList.add('form-check');

        const input = document.createElement('input');
        input.type = 'radio';
        input.classList.add('form-check-input');
        input.name = 'type';
        input.id = type.value.toLowerCase();
        input.value = type.value;
        if (type.value === 'Fiction') {
            input.checked = true;
        }

        const label = document.createElement('label');
        label.classList.add('form-check-label');
        label.htmlFor = type.value.toLowerCase();
        label.textContent = type.label;

        optionDiv.appendChild(input);
        optionDiv.appendChild(label);
        typeOptionsContainer.appendChild(optionDiv);
    });
}

// Call the function to generate options when the page loads
window.addEventListener('DOMContentLoaded', () => {
    generateTypeOptions();
});
