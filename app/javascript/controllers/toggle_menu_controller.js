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
    this.menuTarget.classList.toggle("menu-open");

    if (this.menuTarget.classList.contains("menu-open")) {
      document.addEventListener("click", this.closeMenu.bind(this), true);
    } else {
      document.removeEventListener("click", this.closeMenu.bind(this));
    }
  }

  closeMenu(e) {
    if (!this.menuTarget.contains(e.target) &&
      !this.element.contains(e.target)) {
      this.menuTarget.classList.remove("menu-open");
      document.removeEventListener("click", this.closeMenu.bind(this));
    }
  }
}
