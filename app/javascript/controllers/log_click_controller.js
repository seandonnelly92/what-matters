import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="log-click"
export default class extends Controller {
  static values = {
    date: String,
    completed: String
  }

  static targets = [
    "circle",
    "message"]

  initialize() {
    this.timer = null;
    this.pressTime = 1000 ; // Time user needs to press the habit circle for completion (in milliseconds)
    this.circleTarget.style.setProperty('--transition-duration', `${this.pressTime / 1000}s`);

    this.todayDate = new Date();
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
      this.messageTarget.innerHTML = `${data.message}`;
      this.circleTarget.classList.remove("completed");
      this.updateLogLines('previous');
      this.updateLogLines('next');

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
      this.messageTarget.innerHTML = `${data.message}`;
      // this.dateTarget.innerText - data.date;

      this.circleTarget.classList.remove('completing');
      this.circleTarget.classList.add("completed");
      this.updateLogLines('previous');
      this.updateLogLines('next');

      this.completeMessage();
      this.resetListener();
    })
  }

  updateLogLines(direction) {
    console.log("Trigger tracker event");
    console.log(this.circleTarget);
    const currentLog = this.circleTarget.closest('.habit-card');
    let searching = true;
    let neighborLog = null;
    while (searching) {
      if (direction === 'previous') {
        neighborLog = currentLog.previousElementSibling;
      } else if (direction === 'next') {
        neighborLog = currentLog.nextElementSibling;
      }
      if (!neighborLog || !neighborLog.classList.contains('hide-log')) {
        searching = false;
      }
    }
    if (neighborLog) {
      if (direction === 'previous') {
        this.setLogLine(currentLog, neighborLog);
      } else if (direction === 'next') {
        this.setLogLine(neighborLog, currentLog);
      }
    }
  }

  setLogLine(log, prevLog) {
    const prevDot = prevLog.querySelector('.dot');
    const currentDot = log.querySelector('.dot');
    const lineStart = prevLog.querySelector('.line.bottom');
    const lineEnd = log.querySelector('.line.top');

    this.clearLogLineClasses([lineStart, lineEnd]);

    let lineClass;
    if (prevDot.classList.contains('completed') && currentDot.classList.contains('completed')) {
      lineClass = 'completed';
    } else {
      const currentDate = new Date(log.dataset.date);
      const currentIsToday = this.dateToString(currentDate) === this.dateToString(this.todayDate);

      if (currentIsToday) {
        const prevDate = new Date(prevLog.dataset.date);
        const prevIsToday = this.dateToString(prevDate) === this.dateToString(this.todayDate);

        if (prevIsToday) {
          lineClass = 'pending';
        } else {
          lineClass = 'missed';
        }
      } else if (currentDate > this.todayDate) {
        // This means they are future (pending) logs
        lineClass = 'pending';
      } else {
        lineClass = 'missed';
      }
    }
    lineStart.classList.add(lineClass);
    lineEnd.classList.add(lineClass);
  }

  clearLogLineClasses(logLines) {
    logLines.forEach((logLine) => {
      logLine.classList.remove('missed');
      logLine.classList.remove('pending');
      logLine.classList.remove('completed');
    });
  }

  completeMessage() {
    const completionMessage = document.getElementById('completion-message');
    completionMessage.classList.add('display-message');

    const backgroundFilter = document.getElementById('background-filter')
    backgroundFilter.classList.add('display-message')

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

        text.insertAdjacentHTML('beforeend', `<h2 class="completion-title">Well done, ${userFirstName}!</h2>`);
        this.setEncouragement(text);
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

  setLogoAnimationDuration(components, duration) {
    components.forEach((component) => {
      component.style.setProperty('--logo-animation-duration', duration);
    });
  }

  // Date helper methods
  dateToString(dateInput) {
    const date = new Date(dateInput);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
