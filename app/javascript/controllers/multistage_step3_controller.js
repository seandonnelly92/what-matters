import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="multistage-step3"
export default class extends Controller {
  static targets = [
    "status",
    "title",
    "form",
    "workDaysInput",
    "workHoursInput",
    "submitBtn"
  ]

  connect() {
    console.log("Hello from the multistage-step3 controller!");
    console.log(`Status at connect: ${this.statusTarget.style.width}`);

    // Set status bar from previous step +3.3% (animation increment for each step)
    this.updateStatusBar(3.3);

    // Check if data is already available for the user
    this.fetchSessionData();

    // Retrieves the required CRSF token from the HTML header (used to send requests)
    this.csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
  }

  fetchSessionData() {
    fetch('fetch_session_data')
      .then(response => response.json())
      .then(data => {
        this.sessionData = data;
        this.populateSessionData();
      })
      .catch(error => console.error("Error fetching session data:", error));
  }

  populateSessionData() {
    if (this.sessionData.step3) {
      console.log(this.sessionData.step3);
      const fields = ['sleep_hours_per_day', 'work_days_per_week', 'work_hours_per_day']
      for (const field of fields) {
        const inputElement = this.element.querySelector(`[name="step3_data[${field}]"]`);
        if (!inputElement) continue; // Skip current iteration if inputElement is false/null

        inputElement.value = this.sessionData.step3[`${field}`];
      }
    }
  }

  submitForm(e) {
    e.preventDefault();

    const data = this.formDataJSON();

    fetch(`/multistages/step3_submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": this.csrfToken // Include CSRF token
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      this.clearErrors();

      if (data.errors) {
        this.handleErrors(data.errors);
      } else {
        this.updateStatusBar(15);
        window.location.href = '/multistages/step3_output';
      }
    })
  }

  formDataJSON() {
    return { user:
      { work_days_per_week: this.formTarget.querySelector(`[name="step3_data[work_days_per_week]"]`).value,
        work_hours_per_day: this.formTarget.querySelector(`[name="step3_data[work_hours_per_day]"]`).value,
        sleep_hours_per_day: this.formTarget.querySelector(`[name="step3_data[sleep_hours_per_day]"]`).value
      }
    };
  }

  handleErrors(errors) {
    for (const [key, messages] of Object.entries(errors)) {
      const inputElement = this.element.querySelector(`[name="step3_data[${key}]"]`); // Based on simple form name of input
      if (inputElement) {

        const errorsContainer = document.createElement('div'); // Will include all errors for the respective input field
        errorsContainer.classList.add('errors-container');

        // Adds the first message to the errorsContainer (we show one error at a time)
        const errorMessage = document.createElement('span');
        errorMessage.classList.add('error');
        errorMessage.innerText = messages[0];
        errorsContainer.insertAdjacentElement('beforeend', errorMessage);

        // Insert the errors container right after the input element
        inputElement.parentNode.insertBefore(errorsContainer, inputElement.nextSibling);
      }
    }
  }

  clearErrors() {
    const errorContainers = this.element.querySelectorAll('.errors-container'); // Includes multiples containers if present

    errorContainers.forEach(container => {
      container.remove();
    });
  }

  workHoursUpdate(e) {
    const workHoursField = this.element.querySelector('.step3_data_work_hours_per_day');
    if (this.workDaysInputTarget.value === '0') {
      console.log("YOU CAN REMOVE IT AND SET TO 0");
      this.workHoursInputTarget.value = '0';
      console.log(this.workHoursInputTarget);
      workHoursField.classList.add('d-none');
    } else {
      workHoursField.classList.remove('d-none');
    }
  }

  stepBack() {
    window.location.href = '/multistages/step2_input';
  }

  updateStatusBar(progress, init=false) {
    if (init) this.statusTarget.style.width = '70.5%';

    console.log(`Status update start: ${this.statusTarget.style.width}`);
    const currentWidth = parseFloat(this.statusTarget.style.width);
    this.statusTarget.style.width = `${currentWidth + progress}%`;
    console.log(`Status update end: ${this.statusTarget.style.width}`);
  }
}
