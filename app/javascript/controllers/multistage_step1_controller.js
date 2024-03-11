import { Controller } from "@hotwired/stimulus"
import flatpickr from "flatpickr"

// Connects to data-controller="multistage-step1"
export default class extends Controller {
  static targets = [
    "title",
    "table",
    "form",
    "dateOfBirth",
    "submitBtn",
    "backBtn"
  ]

  connect() {
    console.log("Hello from the multistage step1 controller!");

    this.validForm = false;

    const totalYrs = 90;
    const totalRows = totalYrs / 10; // Showing 10 years (circles) on each row

    let currentYear = 1;
    for (let row = 0; row < totalRows; row++) {
      let rowHTML = "<tr>";
      for (let year = 0; year < 10; year++) {
        // The data-year in the div will add the respective year which will be used to color the circles
        rowHTML = rowHTML.concat(`<td><div class="year-circle" data-year="${currentYear}"></div></td>`);
        currentYear++; // Adding to currenty year for each cell
      }
      rowHTML = rowHTML.concat("</tr>");
      this.tableTarget.insertAdjacentHTML('beforeend', rowHTML);
    }

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
    if (this.sessionData.step1.date_of_birth) {
      const inputElement = this.element.querySelector(`[name="step1_data[date_of_birth]"]`);

      const dateStr = this.rubyDateToString(this.sessionData.step1.date_of_birth);
      const fp = flatpickr(inputElement, {
        dateFormat: "Y-m-d",
      });
      fp.setDate(dateStr);
    }
  }

  submitForm(e) {
    e.preventDefault();

    if (this.validForm) window.location.href = '/multistages/step2_input';

    const data = { user: { date_of_birth: this.dateOfBirthTarget.value } };

    fetch(`/multistages/step1_submit`, {
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
        this.handleErrors(data.errors);
      } else {
        this.resetScrollPosition();

        const dateOfBirth = new Date(data.data);
        const yearsOld = this.differenceInYears(dateOfBirth, new Date()) // new Date() will reflects today's date

        this.titleTarget.innerText = 'Here is how much you’ve used and how much you’ve got left:'
        this.colorCircles(yearsOld);
        this.backBtnTarget.classList.remove('d-none'); // Shows the back button to reset the form
        this.validForm = true;
      }
    })
  }

  colorCircles(years) {
    const circles = this.tableTarget.querySelectorAll('.year-circle');
    let delay = 0; // Initial delay in milliseconds
    const delayIncrement = 30; // Delay increment for each circle to create the animation effect

    circles.forEach(circle => {
      const circleYear = parseInt(circle.getAttribute('data-year'), 10);
      if (circleYear <= years) {
        setTimeout(() => {
          circle.classList.add('colored');
        }, delay);
        delay += delayIncrement;
      } else {
        circle.classList.remove('colored');
      }
    });
  }

  // Error handling
  handleErrors(errors) {
    for (const [key, messages] of Object.entries(errors)) {
      console.log(`Current error is: ${key}`);
      const inputElement = this.element.querySelector(`[name="step1_data[${key}]"]`); // Based on simple form name of input
      if (inputElement) {

        const errorsContainer = document.createElement('div');
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

  // Helper methods
  rubyDateToString(dateInput) {
    const date = new Date(dateInput);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  differenceInYears(date1, date2) {
    let yearsDifference = date2.getFullYear() - date1.getFullYear();
    if (date2.getMonth() < date1.getMonth() || (date2.getMonth() === date1.getMonth() && date2.getDate() < date1.getDate())) {
      yearsDifference--;
    }
    return yearsDifference;
  }

  resetForm() {
    this.formTarget.reset();
    this.titleTarget.innerText = 'Here is your whole life in years if you live until 90 years old:'
    this.colorCircles(0); // Will set all the circles to white
    this.backBtnTarget.classList.add('d-none');
    this.validForm = false;
  }

  resetScrollPosition() {
    window.scrollTo(0, 0);
  }
}
