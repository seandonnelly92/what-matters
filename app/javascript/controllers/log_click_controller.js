import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="log-click"
export default class extends Controller {

  static values = {
    date: String,
    completed: String,
    token: String,
  }

  static targets = ["circle", "message"]

  connect() {
    // console.log("Hello from logs container scroller")
    // console.log(this.dateValue)
    // console.log(this.completedValue)
  }

  handleDotClick(event) {
    const logId = event.target.dataset.id;
    console.log(logId);
    // Your logic to handle the click event goes here
    fetch(`/logs/${logId}`, {
      method: 'PATCH',
      "headers": {
        "X-CSRF-Token": this.tokenValue,
        "Accept": "application/json"
      }
    }).then((resp) => resp.json()).then((data) => {
      this.messageTarget.innerText = data.message;
    })
    this.circleTarget.classList.toggle("completed")
    console.log(this.messageTarget)
  }
}
