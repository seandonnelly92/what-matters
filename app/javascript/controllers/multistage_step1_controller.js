import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="multistage-step1"
export default class extends Controller {
  static targets = [
    "table",
    "dateOfBirth"
  ]

  connect() {
    console.log("Hello from the multistage step1 controller!");

    const total_yrs = 90;
    const total_rows = total_yrs / 10; // Showing 10 years (circles) on each row

    for (let row = 0; row < total_rows; row++) {
      let rowHTML = "<tr>";
      for (let year = 0; year < 10; year++) {
        rowHTML = rowHTML.concat('<td><div class="year-circle"></div></td>');
      }
      rowHTML = rowHTML.concat("</tr>");
      this.tableTarget.insertAdjacentHTML('beforeend', rowHTML);
    }
  }

  DoBSubmission(e) {
    e.preventDefault();
    console.log(e);
    console.log(e.currentTarget);

    console.log(this.dateOfBirthTarget);
    let dateOfBirth = this.dateOfBirthTarget.value;
    console.log(dateOfBirth);

    dateOfBirth = new Date(dateOfBirth);
    const yearsOld = this.differenceInYears(dateOfBirth, new Date()) // new Date() will reflects today's date
    console.log(yearsOld);
  }

  differenceInYears(date1, date2) {
    let yearsDifference = date2.getFullYear() - date1.getFullYear();
    if (date2.getMonth() < date1.getMonth() || (date2.getMonth() === date1.getMonth() && date2.getDate() < date1.getDate())) {
      yearsDifference--;
    }
    return yearsDifference;
  }
}
