import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="multistage-step2-output"
export default class extends Controller {
  static targets = [
    "title",
    "table"
  ]

  connect() {
    console.log("Hello from the multistage-step2-output controller!");

    this.fetchSessionData();

    this.totalYrs = 90;
  }

  fetchSessionData() {
    fetch('fetch_session_data')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.sessionData = data;
        this.firstStepOutput();
      })
      .catch(error => console.error("Error fetching session data:", error));
    }

  firstStepOutput() {
    this.relationYears(); // Get the relevant instances variables for the relation

    this.buildYearsTable(this.sharedYrs); // Build empty years table based on the total shared years

    // Set the title of the page
    const firstTitle = `Assuming you and ${this.sessionData.step2.nickname} both live to 90, you’ll share ${this.sharedYrs} years of co-existence on planet Earth.`;
    this.setTitle(firstTitle);
  }

  secondStepOutput() {
    

    // Set the title of the page
    const percentage = Math.round((this.pastYrs / this.sharedYrs) * 100);
    const secondTitle = `You've used up ${this.pastYrs} of those ${this.sharedYrs} years. That's ${percentage}%. You have ${this.futureYrs} left.`;
    this.setTitle(secondTitle);
  }

  relationYears() {
    const relation_to = this.sessionData.step2.relation_to;
    console.log(`Relation is a ${relation_to}`);

    const userDoB = new Date(this.sessionData.step1.date_of_birth);
    const relationDoB = new Date(this.sessionData.step2.date_of_birth);

    const userAge = this.getAge(userDoB);
    const relationAge = this.getAge(relationDoB);

    this.futureYrs = this.totalYrs - Math.max(userAge, relationAge); // Bases it on the older person

    const meetdate = new Date(this.sessionData.step2.meet_date);
    this.pastYrs = this.getAge(meetdate);

    this.sharedYrs = this.pastYrs + this.futureYrs;

    console.log(`User is ${userAge} and ${relation_to} is ${relationAge}`);
    console.log(`You have ${this.futureYrs} years left of the total ${this.sharedYrs} years`);
  }

  getAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  }

  buildYearsTable(years) {
    const maxRowYrs = 10; // Showing 10 years (circles) on each row
    const totalRows = years / maxRowYrs;

    let currentYear = 1;
    for (let row = 0; row < totalRows; row++) {
      let rowHTML = "<tr>";
      let rowYrs = Math.min(maxRowYrs, (years - currentYear + 1)); // Will account for the last row having less than 10 years
      for (let year = 0; year < rowYrs; year++) {
        // The data-year in the div will add the respective year which will be used to color the circles
        rowHTML = rowHTML.concat(`<td><div class="year-circle" data-year="${currentYear}"></div></td>`);
        currentYear++; // Adding to currenty year for each cell
      }
      rowHTML = rowHTML.concat("</tr>");
      this.tableTarget.insertAdjacentHTML('beforeend', rowHTML);
    }
  }

  setTitle(newTitle) {
    this.titleTarget.innerText = newTitle;
  }
}
