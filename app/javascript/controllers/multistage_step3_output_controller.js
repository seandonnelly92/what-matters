import { Controller } from "@hotwired/stimulus"

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
    console.log(Chart);

    this.fetchSessionData();
  }

  fetchSessionData() {
    fetch('fetch_session_data')
      .then(response => response.json())
      .then(data => {
        console.log("Fetching data...");
        console.log(data);
        this.sessionData = data;
        this.breakdownCalcs();
        this.breakdownChart();
        // this.breakdownChartDetailed();
      })
      .catch(error => console.error("Error fetching session data:", error));
  }

  breakdownCalcs() {
    const sleepHrs = this.sessionData.step3.sleep_hours_per_day;
    const workDays = this.sessionData.step3.work_days_per_week;
    const workHrs = this.sessionData.step3.work_hours_per_day;

    console.log(`Sleep hours is: ${sleepHrs}`);
    console.log(`Work days is: ${workDays}`);
    console.log(`Work hours is: ${workHrs}`);
    this.unavoidables = (7 * sleepHrs) + (workDays * workHrs);
    this.freeTime = (24 * 7) - this.unavoidables;
    console.log(`Unavoidables is: ${this.unavoidables}`);
    console.log(`Free time is: ${this.freeTime}`);
  }

  breakdownChart() {
    const data = {
      labels: [
        'Unavoidables',
        'Free time'
      ],
      datasets: [{
        label: 'Time breakdown',
        data: [this.unavoidables, this.freeTime],
        backgroundColor: [
          'rgb(168, 213, 186)',
          'rgb(34, 82, 70)'
        ],
        hoverOffset: 4
      }]
    };

    const config = {
      type: 'pie',
      data: data,
    };

    const chart = new Chart(this.timeBreakdownTarget, config);
  }

  breakdownChartDetailed() {
    const nickname = this.sessionData.step2.nickname;

    const data = {
      labels: [
        'Unavoidables',
        'Free time',
        `Weekly time w/ ${nickname}`
      ],
      datasets: [{
        label: 'Time breakdown',
        data: [this.unavoidables, this.freeTime],
        backgroundColor: [
          'rgb(168, 213, 186)',
          'rgb(34, 82, 70)',
          'rgb(255, 119, 119)'
        ],
        hoverOffset: 4
      }]
    };

    const config = {
      type: 'pie',
      data: data,
    };

    const chart = new Chart(this.timeBreakdownTarget, config);
  }
}
