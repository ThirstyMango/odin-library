function DOM() {
  this.library = document.getElementById("library");
  this.btnAdd = document.getElementById("btnAdd");
  this.findBookElFromChild = function (childEl) {
    if (childEl.dataset.id) {
      return childEl;
    }
    return this.findBookElFromChild(childEl.parentNode);
  };
}

export { DOM };
