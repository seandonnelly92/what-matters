import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="multistage-step2"
export default class extends Controller {
  static targets = [
    "form"
  ]

  connect() {
    console.log("Hello from the multistage step2 controller!");

    let validForm = false;

    // Retrieves the required CRSF token from the HTML header (used to send requests)
    this.csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
  }

  submitForm(e) {
    e.preventDefault();
    console.log(e);

    if (this.validForm) window.location.href = '/multistages/step2_output';

    const data = this.formDataJSON();
    console.log(data);
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
}
