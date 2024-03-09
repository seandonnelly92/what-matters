import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="log-click"
export default class extends Controller {

  static values = {
    date: String,
    completed: String
  }

  static targets = ["circle", "message"]

  connect() {
    console.log("Hello from logs container scroller")

    // Retrieves the required CRSF token from the HTML header (used to send requests)
    this.csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
  }

  handleDotClick(event) {
    const logId = event.target.dataset.id;
    console.log(`Log ID is: ${logId}`);

    // this.circleTarget.style.transform = 'scale(1)';
    this.circleTarget.classList.toggle("completing");

    // this.circleTarget.style.transition = 'width 3s linear';

  }

  handleHabitComplete() {
    // Your logic to handle the click event goes here
    fetch(`/logs/${logId}`, {
      method: 'PATCH',
      "headers": {
        "X-CSRF-Token": this.csrfToken,
        "Accept": "application/json"
      }
    })
    .then((resp) => resp.json())
    .then((data) => {
      this.messageTarget.innerText = data.message;
      console.log(this.messageTarget);
      this.circleTarget.classList.toggle("completed");
    })

  }

}
