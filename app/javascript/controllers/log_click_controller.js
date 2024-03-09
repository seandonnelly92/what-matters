import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="log-click"
export default class extends Controller {
  static values = {
    date: String,
    completed: String
  }

  static targets = ["circle", "message"]

  initialize() {
    this.timer = null;
    this.pressTime = 3000; // Time user needs to press the habit circle for completion in milliseconds
  }

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

    // Add event listener for releasing the habitCircle
    if (e.type === 'mousedown') {
      this.stopEvent = 'mouseup';
    } else if (e.type === 'touchstart') {
      this.stopEvent = 'touchend';
    }
    habitCircle.addEventListener(this.stopEvent, this.handleDotRelease);

    habitCircle.classList.toggle("completing");

    // Start a timer for 3 seconds
    this.timer = setTimeout(() => {
      console.log(`Held for ${this.pressTime / 1000} seconds!`);
      this.timer = null; // Reset timer

      this.completeHabit();
    }, this.pressTime);
  }

  handleDotRelease(e) {
    e.preventDefault(); // Avoid any browser menu opening when pressing down
    const habitCircle = this.circleTarget;

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
      console.log("Released too early, action cancelled.");

      habitCircle.classList.toggle("completing");
    }

    habitCircle.removeEventListener(this.stopEvent, this.handleDotRelease);
  }

  completeHabit() {
    // Your logic to handle the click event goes here
    const logId = this.circleTarget.dataset.id;
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
