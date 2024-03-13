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
    this.pressTime = 2000; // Time user needs to press the habit circle for completion (in milliseconds)
    this.circleTarget.style.setProperty('--transition-duration', `${this.pressTime / 1000}s`);

    this.displayTime = 3000; // Time to display the completion message (in milliseconds)
  }

  connect() {
    console.log("Hello from logs container scroller")

    // Below ensures accessibility of the controller instance when adding additional event listeners
    this.handleDotPress = this.handleDotPress.bind(this);
    this.handleDotRelease = this.handleDotRelease.bind(this);
    this.handleDotReset = this.handleDotReset.bind(this);

    this.circleTarget.classList.contains('completed') ? this.resetListener() : this.completionListener();

    // Retrieves the required CRSF token from the HTML header (used to send requests)
    this.csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
  }

  completionListener() {
    this.circleTarget.addEventListener('mousedown', this.handleDotPress);
    this.circleTarget.addEventListener('touchstart', this.handleDotPress);

    this.circleTarget.removeEventListener('click', this.handleDotReset);
  }

  resetListener() {
    this.circleTarget.addEventListener('click', this.handleDotReset);

    this.circleTarget.removeEventListener('mousedown', this.handleDotPress);
    this.circleTarget.removeEventListener('touchstart', this.handleDotPress);
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

    habitCircle.classList.add("completing");

    // Start a timer for X seconds
    this.timer = setTimeout(() => {
      console.log(`Held for ${this.pressTime / 1000} seconds!`);
      this.timer = null; // Reset timer

      this.completeHabit();
    }, this.pressTime);
  }

  handleDotReset() {
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
      this.circleTarget.classList.remove("completed");

      this.completionListener();
    })
  }

  handleDotRelease(e) {
    if (e.cancelable) {
      e.preventDefault();
    }

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
      console.log("Released too early, action cancelled.");

      this.circleTarget.classList.remove('completing');
    }
    this.circleTarget.removeEventListener(this.stopEvent, this.handleDotRelease);
  }

  completeHabit() {
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
      this.habitTitle = data.habit;
      this.messageTarget.innerText = data.message;
      this.dateTarget.innerText - data.date;
      this.circleTarget.classList.remove('completing');
      this.circleTarget.classList.add("completed");

      this.completeMessage();
      this.resetListener();
    })
  }

  completeMessage() {
    const completionMessage = document.getElementById('completion-message');
    completionMessage.classList.add('display-message');

    this.displayLogo();
    this.displayText();
  }

  displayLogo () {
    const logo = document.getElementById('logo-container')
    const topLine = logo.querySelector('.logo-line.top');
    const logoCircle = logo.querySelector('#logo-circle');
    const bottomLine = logo.querySelector('.logo-line.bottom');

    this.setLogoAnimationDuration([topLine, logoCircle, bottomLine], '1s');

    logoCircle.classList.add('show');
    setTimeout(() => {
      topLine.classList.add('show');
      bottomLine.classList.add('show');
    }, 1000);
  }

  displayText() {
    const text = document.getElementById('text-container');

    fetch('/application/fetch_user_name')
      .then(response => response.json())
      .then(data => {
        const userFirstName = data.user_name;

        text.insertAdjacentHTML('beforeend', `<h3 class="completion-title">Well done, ${userFirstName}!</h3>`);
        this.setEncouragement(text);

        setTimeout(() => {
          this.resetMessage();
        }, this.displayTime);
      })
      .catch(error => console.error("Error fetching session data:", error));
  }

  setEncouragement(container) {
    fetch('/encouragements/sample_encouragement')
      .then(response => response.json())
      .then(data => {
        container.insertAdjacentHTML('beforeend', `<p class="completion-cheer">${data.encouragement}</p>`);
      })
  }

  resetMessage() {
    const logo = document.getElementById('logo-container')
    const topLine = logo.querySelector('.logo-line.top');
    const logoCircle = logo.querySelector('#logo-circle');
    const bottomLine = logo.querySelector('.logo-line.bottom');

    this.setLogoAnimationDuration([topLine, logoCircle, bottomLine], '0.5s');

    topLine.classList.remove('show');
    logoCircle.classList.remove('show');
    bottomLine.classList.remove('show');

    setTimeout(() => {
      const completionMessage = document.getElementById('completion-message');
      completionMessage.classList.remove('display-message');

      const text = document.getElementById('text-container');
      text.innerHTML = '';
    }, 1000);
  }

  setLogoAnimationDuration(components, duration) {
    components.forEach((component) => {
      component.style.setProperty('--logo-animation-duration', duration);
    });
  }
}
