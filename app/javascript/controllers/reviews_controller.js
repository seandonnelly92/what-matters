import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="reviews"
export default class extends Controller {
  static targets = [
    "menu"
  ]

  connect() {
    console.log("Hello from the reviews controller!");
  }

  sortbyMenu() {
    if (this.menuTarget.classList.contains('show')) {
      this.menuTarget.classList.remove('show')
      setTimeout(() => {
        this.menuTarget.classList.remove('visible')
      }, 300); // Set timeout equal to the transition of the menu
    } else {
      this.menuTarget.classList.add('visible')
      this.menuTarget.classList.add('show')
    }
  }
}
