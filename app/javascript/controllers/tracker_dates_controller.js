import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="tracker-dates"
export default class extends Controller {
  static targets = [
    "datesCarousel"
  ]

  connect() {
    console.log("Hello from tracker-dates controller!");
    console.log(this.datesCarouselTarget);
  }
}
