import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="log-scroll"
export default class extends Controller {

  static targets = ["log", "today"]

  connect() {
    console.log("hello from log scroll")
    // console.log(this.logTargets)

    this.today = new Date(Date.now()).setHours(0,0,0,0)

    this.logTargets.forEach((log) => {

      let logDate = new Date(Date.parse(log.dataset.logClickDateValue)).setHours(0,0,0,0)

      // console.log(logDate)
      if (logDate < this.today) {
        log.scrollIntoView()

      }
      // console.log("connected for today message")
      }
    )

  }

  scroll() {
    const thisDate = this.element.dataset.log_date
  }

  // today_message() {
  //   console.log("connected")
  //   console.log(this.todayTarget)
  // }

}
