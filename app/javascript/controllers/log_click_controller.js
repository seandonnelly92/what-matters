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

    // Below ensures accessibility of the controller instance when adding additional event listeners
    this.handleDotPress = this.handleDotPress.bind(this);
    this.handleDotRelease = this.handleDotRelease.bind(this);

    // Listen for both mouse and touch start events (i.e. start clicking or start touching)
    this.circleTarget.addEventListener('mousedown', this.handleDotPress);
    this.circleTarget.addEventListener('touchstart', this.handleDotPress);

    // Retrieves the required CRSF token from the HTML header (used to send requests)
    this.csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
  }

  handleDotPress(e) {
    const habitCircle = this.circleTarget;
    console.log(habitCircle);

    const logId = habitCircle.dataset.id;
    console.log(`Log ID is: ${logId}`);

    // this.circleTarget.style.transform = 'scale(1)';
    habitCircle.classList.toggle("completing");

    // Determine if the event is touch or mouse and set corresponding move and end events
    if (e.type === 'mousedown') {
      this.stopEvent = 'mouseup';
    } else if (e.type === 'touchstart') {
      this.stopEvent = 'touchend';
    }

    habitCircle.addEventListener(this.stopEvent, this.handleDotRelease);
  }

  handleDotRelease(e) {
    e.preventDefault();

    const habitCircle = this.circleTarget;
    habitCircle.classList.toggle("completing");
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
