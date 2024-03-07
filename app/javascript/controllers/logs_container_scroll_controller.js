import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="logs-container-scroll"
export default class extends Controller {

  static values = {
    log_date: Datetime
  }

  connect() {
    console.log("Hello from logs container scroller")
    console.log(this.log_dateValue)
  }

  scroll() {
    console.log("I have selected a card")
    const thisDate = this.element.dataset.log_date
    console.log(thisDate)
  }
}
