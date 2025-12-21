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

  this.buildSliderlement = function (value, bookId) {
    const sliderEl = document.createElement("input");
    sliderEl.type = "range";
    sliderEl.classList.add("range");
    sliderEl.dataset.element = "rating";
    sliderEl.name = `rating_${bookId}`;
    sliderEl.min = "1";
    sliderEl.max = "10";
    sliderEl.value = value;
    return sliderEl;
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
        case "rating":
          const sliderEl = this.buildSliderlement(value, book.id);
          td.appendChild(sliderEl);
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
}

export { View };
