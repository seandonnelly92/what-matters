import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="multistage-step1"
export default class extends Controller {
  static targets = [
    "title",
    "table",
    "dateOfBirth"
  ]

  connect() {
    console.log("Hello from the multistage step1 controller!");

    const total_yrs = 90;
    const total_rows = total_yrs / 10; // Showing 10 years (circles) on each row

    let currentYear = 1;
    for (let row = 0; row < total_rows; row++) {
      let rowHTML = "<tr>";
      for (let year = 0; year < 10; year++) {
        // The data-year in the div will add the respective year which will be used to color the circles
        rowHTML = rowHTML.concat(`<td><div class="year-circle" data-year="${currentYear}"></div></td>`);
        currentYear++; // Adding to currenty year for each cell
      }
      rowHTML = rowHTML.concat("</tr>");
      this.tableTarget.insertAdjacentHTML('beforeend', rowHTML);
    }

    // Retrieves the required CRSF token from the HTML header (used to send requests)
    this.csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
  }

  DoBSubmission(e) {
    e.preventDefault();

    const dateOfBirth = new Date(this.dateOfBirthTarget.value);
    const yearsOld = this.differenceInYears(dateOfBirth, new Date()) // new Date() will reflects today's date

    this.titleTarget.innerText = 'Here is how much you’ve used and how much you’ve got left:'
    this.colorCircles(yearsOld);
  }

  differenceInYears(date1, date2) {
    let yearsDifference = date2.getFullYear() - date1.getFullYear();
    if (date2.getMonth() < date1.getMonth() || (date2.getMonth() === date1.getMonth() && date2.getDate() < date1.getDate())) {
      yearsDifference--;
    }
    return yearsDifference;
  }

  colorCircles(years) {
    const circles = this.tableTarget.querySelectorAll('.year-circle');
    let delay = 0; // Initial delay in milliseconds
    const delayIncrement = 50; // Delay increment for each circle to create the animation effect

    circles.forEach(circle => {
      const circleYear = parseInt(circle.getAttribute('data-year'), 10);
      if (circleYear <= years) {
        setTimeout(() => {
          circle.classList.add('colored');
        }, delay);
        delay += delayIncrement;
      }
    });
  }
}
