import { Controller } from "@hotwired/stimulus"
import flatpickr from "flatpickr"

// Connects to data-controller="signup-form"
export default class extends Controller {
  static targets = [
    "dateOfBirth",
    "submitBtn",
    "sleepHrs",
    "workHrs",
    "workDays",
    "showAllButton"
  ]

  connect() {
    console.log("We're in");
    // console.log(this.dateOfBirthTarget);
    // console.log(this.submitBtnTarget);
    // console.log(this.sleepHrsTarget);
    // console.log(this.workHrsTarget);
    console.log(this.workDaysTarget);
    console.log(this.fetchSessionData());
    this.showButtonActive = true;
    this.formTargets = [this.dateOfBirthTarget, this.sleepHrsTarget, this.workHrsTarget, this.workDaysTarget]
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
    if(typeof data.step1.date_of_birth != "undefined") {
      this.showAllButtonTarget.classList.remove("form-optional")
      // const dateOfBirth = new Date(data.step1.date_of_birth);
      // console.log(data.step1.date_of_birth)
      // this.dateOfBirthTarget.value = `${dateOfBirth.getFullYear()}-${dateOfBirth.getMonth()+1}-${dateOfBirth.getDate()}`;
      const inputElement = this.dateOfBirthTarget;
      const dateStr = this.rubyDateToString(data.step1.date_of_birth);
      const fp = flatpickr(inputElement, {
        dateFormat: "Y-m-d",
      });
      fp.setDate(dateStr);
      this.elementDisplay(this.dateOfBirthTarget);
    }

    if('step3' in data) {
      if(typeof data.step3.work_days_per_week != "undefined") {
        this.workDaysTarget.value = data.step3.work_days_per_week
        this.elementDisplay(this.workDaysTarget);
      }

      if(typeof data.step3.work_hours_per_day != "undefined") {
        this.workHrsTarget.value = data.step3.work_hours_per_day
        this.elementDisplay(this.workHrsTarget);
      }

      if(typeof data.step3.sleep_hours_per_day != "undefined") {
        this.sleepHrsTarget.value = data.step3.sleep_hours_per_day
        this.elementDisplay(this.sleepHrsTarget);
      }
    }
  }

  rubyDateToString(dateInput) {
    const date = new Date(dateInput);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  elementDisplay(element) {
    if(element.value != '') {
      element.classList.add("form-optional")
      element.previousElementSibling.style.display = "none"
    }
  }

  showHide(event) {
    event.preventDefault();
    if (this.showButtonActive) {
      this.showAll();
    } else {
      this.hideCompleted();
    }
  }

  showAll() {
    this.showAllButtonTarget.innerHTML = '<p>Hide previous answers</p><i class="fa-solid fa-caret-down"></i>';
    this.formTargets.forEach((target) => {
      if (target.classList.contains("form-optional")) {
        target.classList.remove("form-optional");
        target.previousElementSibling.style.display = "";
      }
    })
    this.showButtonActive = false;
  }

  hideCompleted() {
    this.showAllButtonTarget.innerHTML = '<p>Show previous answers</p><i class="fa-solid fa-caret-right"></i>';
    this.formTargets.forEach((target) => {
      if (target.value != "") {
        target.classList.add("form-optional")
        target.previousElementSibling.style.display = "none"
      }
    });
    this.showButtonActive = true;
  }
}
