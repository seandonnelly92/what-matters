import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="multistage-step3"
export default class extends Controller {
  static targets = [
    "title",
    "form",
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
      // this.clearErrors();
      // this.submitBtnTarget.classList = ["primary-btn"]; // Resets the submit button

      if (data.errors) {
        console.log("ERRORS");
        console.log(data.errors);
        // this.handleErrors(data.errors);
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
}
