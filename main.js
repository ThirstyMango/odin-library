class Book {
  constructor(name, author, pages, read) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }
}

// Holds individual Book instances
class Library {
  #books = [];

  // an array of { name, author, pages, read }
  constructor(...bookData) {
    for (const packet of bookData) {
      const book = new Book(...packet.values());
      this.#books.push(book);
    }
  }

  get books() {
    return [...this.#books];
  }

  findBook(id) {
    return this.#books.find((book) => book.id === id);
  }

  // bookData = {name, author, pages, read}
  addBook(bookData) {
    const book = new Book(...bookData.values());
    this.#books.push(book);
  }

  removeBook(id) {
    this.#books = this.#books.filter((book) => book.id !== id);
  }
}

// DOM manipulation, rendering, event listeners...
class DOM {
  constructor(library) {
    this.cacheDom();
    this.bindEvents();
    this.builder = this.#builder();
    this.library = library;
  }

  cacheDom() {
    this.tableEl = document.querySelector(".table");
    this.libraryEl = document.getElementById("library");
    this.btnAddEl = document.getElementById("btnAdd");
    this.inputRowEl = document.getElementById("input-row");
    this.addRowEl = document.getElementById("add-row");
    this.inputIdEl = document.getElementById("input-id");
    this.inputNameEl = document.getElementById("input-name");
    this.inputAuthorEl = document.getElementById("input-author");
    this.inputPagesEl = document.getElementById("input-pages");
    this.inputReadEl = document.getElementById("input-read");
    this.messagerEl = document.querySelector(".message");
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

  renderLibrary() {
    for (const book of this.library.books) {
      const bookEl = this.builder.buildBookEl(book);
      this.libraryEl.appendChild(bookEl);
    }
  }

  renderMessage(message, success = true) {
    const [successCls, alertCls] = ["message--success", "message--alert"];
    const el = this.messagerEl;
    const stateCls = success ? successCls : alertCls;

    this.setContent(el, message);
    this.addClasses(el, stateCls);
    this.showEl(el);

    // Hide the message and remove classes after 2s
    setTimeout(() => {
      this.hideEl(el);
      this.removeClasses(el, successCls, alertCls);
    }, "2000");
  }

  showEl(el) {
    el.classList.remove("hidden");
  }

  hideEl(el) {
    el.classList.add("hidden");
  }

  setContent(el, content) {
    el.textContent = content;
  }

  removeClasses(el, ...classes) {
    el.classList.remove(classes);
  }

  addClasses(el, ...classes) {
    el.classList.add(classes);
  }

  #findBookElFromChild = function (childEl) {
    if (childEl.dataset.id) {
      return childEl;
    }
    return this.findBookElFromChild(childEl.parentNode);
  };
}

const testingData = [
  { name: "Hobit", author: "J.R.R. Tolkien", pages: 219, read: true },
  {
    name: "Lord of the rings",
    author: "J.R.R. Tolkien",
    pages: 111,
    read: false,
  },
  { name: "Pentagram", author: "Jo Nesbo", pages: 223, read: true },
  { name: "Golem", author: "Gustav Meyrink", pages: 331, read: false },
];

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
