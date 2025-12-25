import { DOM } from "./scripts/DOM.js";
import { View } from "./scripts/View.js";
import { Library } from "./scripts/Library.js";
import { Book } from "./scripts/Book.js";

const myDom = new DOM();
const myView = new View();
const myLibrary = new Library();

const testingData = [
  ["Hobit", "J.R.R. Tolkien", 219, true, 8],
  ["Lord of the rings", "J.R.R. Tolkien", 111, false, 7],
  ["Pentagram", "Jo Nesbo", 223, true, 9],
  ["Golem", "Gustav Meyrink", 331, true, 3],
];

const books = testingData.map((bookArr) => new Book(...bookArr));

myLibrary.addBooksToLibrary(books);
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
  const newBook = new Book(...newBookData);
  myLibrary.addBookToLibrary(newBook);
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
