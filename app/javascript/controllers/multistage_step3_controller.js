import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="multistage-step3"
export default class extends Controller {
  static targets = [
    "title",
    "form",
    "workDaysInput",
    "workHoursInput",
    "submitBtn"
  ]

  connect() {
    console.log("Hello from the multistage-step3 controller!");

    // Retrieves the required CRSF token from the HTML header (used to send requests)
    this.csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
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
        console.log("ERRORS");
        console.log(data.errors);
        this.handleErrors(data.errors);
      } else {
        console.log("SUCCESS");
        console.log(data);
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
}
