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
      // this.clearErrors();

      if (data.errors) {
        console.log("ERROR");
        console.log(data.errors);
        // this.handleErrors(data.errors);
        // this.submitBtnTarget.classList = ["primary-btn"]; // Resets the submit button
      } else {
        console.log("SUCCESS");
        console.log(data);

        // const dateOfBirth = new Date(data.data);
        // const yearsOld = this.differenceInYears(dateOfBirth, new Date()) // new Date() will reflects today's date

        // this.titleTarget.innerText = 'Here is how much you’ve used and how much you’ve got left:'
        // this.colorCircles(yearsOld);
        // this.backBtnTarget.classList.remove('d-none'); // Shows the back button to reset the form
        // this.validForm = true;
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
}
