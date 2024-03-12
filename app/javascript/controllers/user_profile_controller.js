import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="user-profile"
export default class extends Controller {
  static targets = [
    "accountInfo",
    "accountForm",
    "editAcctBtn",
  ]

  connect() {
    console.log("we're in");
    this.editAcctBtnActive = true;
  }


  showHide(event) {
    // event.preventDefault();
    console.log(event);
    if (this.editAcctBtnActive) {
      this.showForm();
    } else {
      this.hideForm();
    }
  }

  showForm() {
    this.accountInfoTarget.classList.add("d-none")
    this.accountFormTarget.classList.remove("d-none")
    this.editAcctBtnActive = false;
  }

  hideForm() {
    this.accountInfoTarget.classList.remove("d-none")
    this.accountFormTarget.classList.add("d-none")
    this.editAcctBtnActive = true;
  }
}
