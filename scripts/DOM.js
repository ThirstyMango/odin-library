function DOM() {
  this.table = document.querySelector(".table");
  this.library = document.getElementById("library");
  this.btnAdd = document.getElementById("btnAdd");
  this.inputRow = document.getElementById("input-row");
  this.addRow = document.getElementById("add-row");
  this.findBookElFromChild = function (childEl) {
    if (childEl.dataset.id) {
      return childEl;
    }
    return this.findBookElFromChild(childEl.parentNode);
  };
}

export { DOM };
