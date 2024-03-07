import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="multistage-step2"
export default class extends Controller {
  static targets = [
    "form",
    "nicknameInput",
    "meetdateLabel",
    "submitBtn"
  ]

  connect() {
    console.log("Hello from the multistage step2 controller!");

    // Retrieves the required CRSF token from the HTML header (used to send requests)
    this.csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
  }

  submitForm(e) {
    e.preventDefault();

    const data = this.formDataJSON();

    fetch(`/multistages/step2_submit`, {
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
      this.submitBtnTarget.classList = ["primary-btn"]; // Resets the submit button

      if (data.errors) {
        // console.log("ERROR");
        console.log(data.errors);
        this.handleErrors(data.errors);
      } else {
        console.log(data);
        window.location.href = '/multistages/step2_output';
      }
    })
  }

  formDataJSON() {
    return { relationship:
      { nickname: this.formTarget.querySelector(`[name="step2_data[nickname]"]`).value,
        relation_to: this.formTarget.querySelector(`[name="step2_data[relation_to]"]`).value,
        date_of_birth: this.formTarget.querySelector(`[name="step2_data[date_of_birth]"]`).value,
        contact_days: this.formTarget.querySelector(`[name="step2_data[contact_days]"]`).value,
        contact_days_per: this.formTarget.querySelector(`[name="step2_data[contact_days_per]"]`).value,
        meet_date: this.formTarget.querySelector(`[name="step2_data[meet_date]"]`).value
      }
    };
  }

  handleErrors(errors) {
    for (const [key, messages] of Object.entries(errors)) {
      const inputElement = this.element.querySelector(`[name="step2_data[${key}]"]`); // Based on simple form name of input
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

  updateMeetdateLabel(e) {
    const nickname = this.nicknameInputTarget.value;
    const labelText = nickname ? `How long has ${nickname} been important to you?` : "How long has ... been important to you?";
    this.meetdateLabelTarget.innerText = labelText;
  }
}
