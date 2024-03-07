import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="log-click"
export default class extends Controller {

  static values = {
    date: String
  }

  static targets = ["circle"]

  connect() {
    console.log("Hello from logs container scroller")
    console.log(this.dateValue)
  }

  handleDotClick(event) {
    // Your logic to handle the click event goes here
    console.log("Dot clicked!");
    // console.dir(this.circleTarget)
    console.dir(this.circleTarget.style)
    this.circleTarget.style.backgroundColor = "#003E02"
    // console.log(this.circleTarget.classlist.back)
  }
}
