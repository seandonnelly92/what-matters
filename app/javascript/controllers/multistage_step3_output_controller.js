import { Controller } from "@hotwired/stimulus"

import Chartkick from "chartkick"
import "chartkick/chart.js"

// Connects to data-controller="multistage-step3-output"
export default class extends Controller {
  static targets = [
    "title",
    "timeBreakdown",
    "timeBreakdownDetail",
    "nextBtn"
  ]

  connect() {
    console.log("Hello from the multistage-step3-output controller!");

    new Chartkick.PieChart(this.timeBreakdownTarget, [["Blueberry", 44], ["Strawberry", 23]])

    this.fetchSessionData();
  }

  fetchSessionData() {
    fetch('fetch_session_data')
      .then(response => response.json())
      .then(data => {
        console.log("Fetching data...");
        console.log(data);
        this.sessionData = data;
        // this.firstStepOutput();
      })
      .catch(error => console.error("Error fetching session data:", error));
  }
}
