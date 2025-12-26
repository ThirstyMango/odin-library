function View() {
  this.buildcheckboxElement = function (value, bookId) {
    const checkboxEl = document.createElement("input");
    checkboxEl.classList.add("checkbox");
    checkboxEl.type = "checkbox";
    checkboxEl.dataset.element = "read";
    checkboxEl.name = `read_${bookId}`;
    checkboxEl.checked = value;
    return checkboxEl;
  };

  this.buildRemoveButtonElement = function () {
    const removeBtnEl = document.createElement("button");
    removeBtnEl.setAttribute("type", "button");
    removeBtnEl.dataset.element = "remove";
    removeBtnEl.classList.add("btn", "btn--alert");
    removeBtnEl.textContent = String.fromCodePoint(0x2715);
    return removeBtnEl;
  };

  // All action buttons has to be INSIDE tr with data.id !
  this.buildBookElement = function (book) {
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

  this.displayBook = function (book, container) {
    const bookEl = this.buildBookElement(book);
    container.appendChild(bookEl);
  };

  this.displayLibrary = function (library, container) {
    for (let book of library) {
      this.displayBook(book, container);
    }
  };

  this.displayTempMessage = function (messageElem, message, success) {
    messageElem.textContent = message;
    success
      ? messageElem.classList.add("message--success")
      : messageElem.classList.add("message--alert");
    messageElem.classList.remove("hidden");
    setTimeout(() => {
      messageElem.classList.remove("message--success");
      messageElem.classList.remove("message--alert");
      messageElem.classList.add("hidden");
    }, "2000");
  };
}

export { View };
