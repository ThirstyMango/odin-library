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
      const book = new Book(...Object.values(packet));
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
    if (!this.#isBookDataValid(...Object.values(bookData))) {
      throw new Error("Book information invalid");
    }

    const book = new Book(...Object.values(bookData));
    this.#books.push(book);
    return book;
  }

  removeBook(id) {
    this.#books = this.#books.filter((book) => book.id !== id);
  }

  setBookParam(id, key, value) {
    const book = this.findBook(id);
    book[key] = value;
  }

  #isBookDataValid(name, author, pages, read) {
    const isNameValid = name.length > 0;
    const isAuthorValid = author.length > 0;
    const isReadValid = typeof read === "boolean";
    const isPagesValid =
      pages !== "" &&
      pages !== " " &&
      !isNaN(pages) &&
      Number.isInteger(parseFloat(pages));

    return isNameValid && isAuthorValid && isReadValid && isPagesValid;
  }
}

// DOM manipulation, rendering, event listeners...
class DOM {
  #timeout;
  constructor(library) {
    this.cacheDom();
    this.bindEvents();
    this.builder = this.#builder();
    this.eventHandler = this.#eventHandler();
    this.library = library;

    //Innit render
    this.renderLibrary();
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

  bindEvents() {
    this.tableEl.addEventListener("click", (e) =>
      this.eventHandler.handleClick(e)
    );
  }

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
            const checkboxEl = buildCheckboxEl(value, book.id);
            td.appendChild(checkboxEl);
            break;
          default:
            td.textContent = value;
        }

        tr.appendChild(td);
      }

      const tdAction = document.createElement("td");
      const removeBtnEl = buildRemoveBtnEl();
      tdAction.appendChild(removeBtnEl);

      tr.appendChild(tdAction);

      return tr;
    };

    return { buildCheckboxEl, buildRemoveBtnEl, buildBookEl };
  }

  #eventHandler() {
    const handleClick = (e) => {
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

    const handleRemoveClick = (targetEl) => {
      const bookEl = targetEl.closest("tr");
      const bookId = bookEl.dataset.id;
      const book = this.library.findBook(bookId);

      if (
        !confirm(
          `Do you wish to remove ${book.name} by ${book.author} from the library?`
        )
      )
        return;

      this.library.removeBook(bookId);
      bookEl.remove();
      this.renderMessage("Succesfully removed", true);
    };

    const handleReadClick = (targetEl) => {
      const bookEl = targetEl.closest("tr");
      const bookId = bookEl.dataset.id;
      this.library.setBookParam(bookId, "read", targetEl.checked);
    };

    const handleConfirmClick = (e) => {
      e.preventDefault();
      const newBookData = this.#getFormData();
      try {
        const newBook = this.library.addBook(newBookData);
        this.renderBook(newBook);
      } catch (err) {
        this.renderMessage(err.message, false);
        return;
      }

      this.#clearFormData();
      this.renderMessage("Book added", true);
      this.hideEl(this.inputRowEl);
      this.showEl(this.addRowEl);
    };

    const handleAddClick = () => {
      this.showEl(this.inputRowEl);
      this.hideEl(this.addRowEl);
    };

    const handleCancelClick = () => {
      this.showEl(this.addRowEl);
      this.hideEl(this.inputRowEl);
      this.#clearFormData();
    };

    return { handleClick };
  }

  renderLibrary() {
    this.library.books.forEach((book) => this.renderBook(book));
  }

  renderBook(book) {
    const bookEl = this.builder.buildBookEl(book);
    this.libraryEl.appendChild(bookEl);
  }

  renderMessage(message, success = true) {
    const [successCls, alertCls] = ["message--success", "message--alert"];
    const el = this.messagerEl;
    const stateCls = success ? successCls : alertCls;

    // Cancel the previous hiding interval and reset the state of messagerEl
    clearInterval(this.#timeout);
    this.removeClasses(el, successCls, alertCls);

    // Display the message
    this.setContent(el, message);
    this.addClasses(el, stateCls);
    this.showEl(el);

    // Hide after 3s
    this.hideEl(el);
    this.removeClasses(el, successCls, alertCls);
    this.#timeout = setTimeout(() => {
      this.hideEl(el);
      this.removeClasses(el, successCls, alertCls);
    }, "3000");
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
    el.classList.remove(...classes);
  }

  addClasses(el, ...classes) {
    el.classList.add(...classes);
  }

  #getFormData() {
    const name = this.inputNameEl.value;
    const author = this.inputAuthorEl.value;
    const pages = this.inputPagesEl.value;
    const read = this.inputReadEl.checked;
    return [name, author, pages, read];
  }

  #clearFormData() {
    this.inputNameEl.value = "";
    this.inputAuthorEl.value = "";
    this.inputPagesEl.value = "";
    this.inputReadEl.checked = false;
  }
}

// Adding initial data
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

// Classes construction
const myLibrary = new Library(...testingData);
const initDOM = new DOM(myLibrary);
