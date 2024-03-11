import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="tracker-menu"
export default class extends Controller {
  static targets = [
    "datesCarousel"
  ]

  connect() {
    console.log("Hello from tracker-menu controller!");
    console.log(this.datesCarouselTarget);
  }
}
