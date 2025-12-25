function DOM() {
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
  this.findBookElFromChild = function (childEl) {
    if (childEl.dataset.id) {
      return childEl;
    }
    return this.findBookElFromChild(childEl.parentNode);
  };
}

export { DOM };
