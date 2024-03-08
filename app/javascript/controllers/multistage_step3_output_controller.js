import { Controller } from "@hotwired/stimulus"

import { Chart } from "chart.js";
import * as Chartjs from "chart.js";

const controllers = Object.values(Chartjs).filter(
  (chart) => chart.id !== undefined
);
Chart.register(...controllers);

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

    const firstChart = this.timeBreakdownTarget;

    const data = {
      labels: [
        'Red',
        'Blue',
        'Yellow'
      ],
      datasets: [{
        label: 'My First Dataset',
        data: [300, 50, 100],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
      }]
    };

    const config = {
      type: 'pie',
      data: data,
    };

    new Chart(firstChart, config);

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
