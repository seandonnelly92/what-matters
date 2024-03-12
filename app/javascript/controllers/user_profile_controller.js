import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="user-profile"
export default class extends Controller {
  static targets = [
    "accountInfo",
    "accountForm",
    "editAcctBtn",
    "dayInfo",
    "dayForm",
    "editDayBtn"
  ]

  connect() {
    console.log("we're in");
    this.editAcctBtnActive = true;
    this.editDayBtnActive = true;
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

  showHideDay(event) {
    // event.preventDefault();
    console.log(event);
    if (this.editDayBtnActive) {
      this.showDayForm();
    } else {
      this.hideDayForm();
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

  showDayForm() {
    this.dayInfoTarget.classList.add("d-none")
    this.dayFormTarget.classList.remove("d-none")
    this.editDayBtnActive = false;
  }

  hideDayForm() {
    this.dayInfoTarget.classList.remove("d-none")
    this.dayFormTarget.classList.add("d-none")
    this.editDayBtnActive = true;
  }
}
