class Book {
  constructor(name, author, pages, read) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }
}

class Library {
  #data = [];

  constructor(...data) {
    for (arg of arguments) {
      this.#data.push(arg);
    }
  }

  findById(id) {
    return this.data.find((item) => item.id === item);
  }

  addToLibrary(item) {
    this.data.push(item);
  }

  removeFromLibrary(id) {
    this.data = this.data.filter((item) => item.id !== id);
  }
}

class DOM {
  constructor() {
    this.cacheDom();
    this.bindEvents();
  }

  cacheDom() {
    this.table = document.querySelector(".table");
    this.library = document.getElementById("library");
    this.btnAdd = document.getElementById("btnAdd");
    this.inputRow = document.getElementById("input-row");
    this.addRow = document.getElementById("add-row");
    this.inputId = document.getElementById("input-id");
    this.inputName = document.getElementById("input-name");
    this.inputAuthor = document.getElementById("input-author");
    this.inputPages = document.getElementById("input-pages");
    this.inputRead = document.getElementById("input-read");
    this.messager = document.querySelector(".message");
    this.builder = this.#builder();
  }

  // TODO - bind event listeners
  bindEvents() {}

  // TODO - manage form handling
  isFormDataValid() {}

  #builder() {
    const buildCheckboxEl = (value, id) => {
      const checkboxEl = document.createElement("input");
      checkboxEl.classList.add("checkbox");
      checkboxEl.type = "checkbox";
      checkboxEl.dataset.element = "read";
      checkboxEl.name = `read_${id}`;
      checkboxEl.checked = value;
      return checkboxEl;
    };

    const buildRemoveBtnEl = () => {
      const removeBtnEl = document.createElement("button");
      removeBtnEl.setAttribute("type", "button");
      removeBtnEl.dataset.element = "remove";
      removeBtnEl.classList.add("btn", "btn--alert");
      removeBtnEl.textContent = String.fromCodePoint(0x2715);
      return removeBtnEl;
    };

    const buildBookEl = (book) => {
      const tr = document.createElement("tr");
      tr.classList.add("table__row");
      tr.setAttribute("data-id", book.id);

      for (const [key, value] of Object.entries(book)) {
        const td = document.createElement("td");

        // Create the inside of td
        switch (key) {
          case "read":
            const checkboxEl = this.buildcheckboxElement(value, book.id);
            td.appendChild(checkboxEl);
            break;
          default:
            td.textContent = value;
        }

        tr.appendChild(td);
      }

      const tdAction = document.createElement("td");
      const removeBtnEl = this.buildRemoveButtonElement();
      tdAction.appendChild(removeBtnEl);

      tr.appendChild(tdAction);

      return tr;
    };

    return { buildCheckboxEl, buildRemoveBtnEl, buildBookEl };
  }

  renderBooks(...books) {
    for (const book of books) {
      const bookEl = this.builder.buildBookEl(book);
      this.library.appendChild(bookEl);
    }
  }

  renderMessage(message, success = true) {
    this.messager.textContent = message;
    success
      ? this.messager.classList.add("message--success")
      : this.messager.classList.add("message--alert");
    this.messager.classList.remove("hidden");
    setTimeout(() => this.hideMessage(), "2000");
  }

  hideMessage() {
    this.messager.classList.remove("message--success");
    this.messager.classList.remove("message--alert");
    this.messager.classList.add("hidden");
  }

  #findBookElFromChild = function (childEl) {
    if (childEl.dataset.id) {
      return childEl;
    }
    return this.findBookElFromChild(childEl.parentNode);
  };
}

const testingData = [
  ["Hobit", "J.R.R. Tolkien", 219, true, 8],
  ["Lord of the rings", "J.R.R. Tolkien", 111, false, 7],
  ["Pentagram", "Jo Nesbo", 223, true, 9],
  ["Golem", "Gustav Meyrink", 331, true, 3],
];

testingData.forEach((bookData) => myLibrary.addBookToLibrary(...bookData));

myView.displayLibrary(myLibrary.data, myDom.library);

// Helper functions
const isFormDataValid = function isFormDataValid(name, author, pages, read) {
  const isNameValid = name.length > 0;
  const isAuthorValid = author.length > 0;
  const isReadValid = typeof read === "boolean";
  const isPagesValid =
    pages !== "" &&
    pages !== " " &&
    !isNaN(pages) &&
    Number.isInteger(parseFloat(pages));

  return isNameValid && isAuthorValid && isReadValid && isPagesValid;
};

const getBookData = function getBookData() {
  const name = myDom.inputName.value;
  const author = myDom.inputAuthor.value;
  const pages = myDom.inputPages.value;
  const read = myDom.inputRead.checked;
  return [name, author, pages, read];
};

const clearFormData = function clearFormData() {
  myDom.inputName.value = "";
  myDom.inputAuthor.value = "";
  myDom.inputPages.value = "";
  myDom.inputRead.checked = false;
};

// Event listeners

const handleRemoveClick = function handleRemoveClick(targetEl) {
  const bookEl = myDom.findBookElFromChild(targetEl);
  const bookId = bookEl.dataset.id;
  const book = myLibrary.findBookById(bookId);

  if (
    !confirm(
      `Do you wish to remove ${book.name} by ${book.author} from the library?`
    )
  )
    return;

  myLibrary.removeBookFromLibrary(bookId);
  bookEl.remove();
  myView.displayTempMessage(myDom.messager, "Succesfully removed", false);
};

const handleReadClick = function handleReadClick(targetEl) {
  const bookEl = myDom.findBookElFromChild(targetEl);
  const bookId = bookEl.dataset.id;
  myLibrary.setBookParameter(bookId, "read", targetEl.checked);
};

const handleConfirmClick = function handleConfirmClick(e) {
  const newBookData = getBookData();

  if (!isFormDataValid(...newBookData)) {
    return;
  }

  e.preventDefault();
  clearFormData();
  const newBook = myLibrary.addBookToLibrary(...newBookData);
  myView.displayBook(newBook, myDom.library);
  myView.displayTempMessage(myDom.messager, "Succesfully created", true);

  myDom.inputRow.classList.add("hidden");
  myDom.addRow.classList.remove("hidden");
};

const handleAddClick = function handleAddClick() {
  myDom.inputRow.classList.remove("hidden");
  myDom.addRow.classList.add("hidden");
};

const handleCancelClick = function handleCancelClick() {
  myDom.inputRow.classList.add("hidden");
  myDom.addRow.classList.remove("hidden");
  clearFormData();
};

const handleClick = function handleClick(e) {
  const targetType = e.target.dataset.element;
  switch (targetType) {
    case "read":
      handleReadClick(e.target);
      break;
    case "remove":
      handleRemoveClick(e.target);
      break;
    case "confirm":
      handleConfirmClick(e);
      break;
    case "add":
      handleAddClick();
      break;
    case "cancel":
      handleCancelClick();
      break;
  }
};

// Add Event listener
myDom.table.addEventListener("click", handleClick);
