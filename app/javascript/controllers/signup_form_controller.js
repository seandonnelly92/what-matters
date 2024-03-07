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
    console.log(this.workDaysTarget);
    console.log(this.fetchSessionData());
  }

  fetchSessionData() {
    fetch('/multistages/fetch_session_data')
      .then(response => response.json())
      .then(data => {
        console.log("Session data:", data);
        this.autofillForm(data)
      })
      .catch(error => console.error("Error fetching session data:", error));
  }

  autofillForm(data) {
    // console.log(data.step1.date_of_birth)
    if(typeof data.step1.date_of_birth != "undefined") {
      const dateOfBirth = new Date(data.step1.date_of_birth);
      this.dateOfBirthTarget.value = `${dateOfBirth.getFullYear()}-${dateOfBirth.getMonth()+1}-${dateOfBirth.getDate()}`;
      this.ElementDisplay(this.dateOfBirthTarget);
      // if(this.dateOfBirthTarget.value != '') {
      //   this.dateOfBirthTarget.classList.add("form-optional")
      //   this.dateOfBirthTarget.previousElementSibling.style.display = "none"
      // }
    }

    if(typeof data.step3.work_days_per_week != "undefined") {
      this.workHrsTarget.value = data.step3.work_days_per_week
      this.ElementDisplay(this.workHrsTarget);
    }

    if(typeof data.step3.work_hours_per_day != "undefined") {
      this.workDaysTarget.value = data.step3.work_hours_per_day
      this.ElementDisplay(this.workDaysTarget);
    }

    if(typeof data.step3.sleep_hours_per_day != "undefined") {
      this.sleepHrsTarget.value = data.step3.sleep_hours_per_day
      this.ElementDisplay(this.sleepHrsTarget);
    }
  }

  ElementDisplay(element) {
    if(element.value != '') {
      element.classList.add("form-optional")
      element.previousElementSibling.style.display = "none"
    }
  }
}