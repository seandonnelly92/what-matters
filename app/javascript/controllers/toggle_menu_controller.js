import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="toggle-menu"
export default class extends Controller {
  static targets = [
    "menu"
  ]

  connect() {
    console.log("Hello from the toggle-menu controller!");
  }

  toggleMenu(e) {
    console.log(e);
    this.menuTarget.classList.toggle("active");
  }
}
