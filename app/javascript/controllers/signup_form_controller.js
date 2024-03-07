import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="signup-form"
export default class extends Controller {
  static targets = [
    "dateOfBirth",
    "submitBtn",
    "sleepHrs",
    "workHrs",
    "workDays"
  ]

  connect() {
    console.log("We're in");
    // console.log(this.dateOfBirthTarget);
    // console.log(this.submitBtnTarget);
    // console.log(this.sleepHrsTarget);
    // console.log(this.workHrsTarget);
    // console.log(this.workDaysTarget);
    console.log(this.fetchSessionData());
  }

  fetchSessionData() {
    fetch('/multistages/fetch_session_data')
      .then(response => response.json())
      .then(data => {
        console.log("Session data:", data);
        console.log(data.step1);
      })
      .catch(error => console.error("Error fetching session data:", error));
  }
}
