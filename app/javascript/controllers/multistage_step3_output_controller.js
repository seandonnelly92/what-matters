import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="multistage-step3-output"
export default class extends Controller {
  static targets = [
    "status",
    "title",
    "timeBreakdown",
    "legend",
    "nextBtn",
    "backBtn"
  ]

  connect() {
    console.log("Hello from the multistage-step3-output controller!");

    // Set status bar from input step +15% (to include animation)
    this.updateStatusBar(15);

    this.fetchSessionData();
  }

  fetchSessionData() {
    fetch('fetch_session_data')
      .then(response => response.json())
      .then(data => {
        this.sessionData = data;
        this.breakdownCalcs();
        this.breakdownChart();
      })
      .catch(error => console.error("Error fetching session data:", error));
  }

  breakdownCalcs() {
    const sleepHrs = this.sessionData.step3.sleep_hours_per_day;
    const workDays = this.sessionData.step3.work_days_per_week;
    const workHrs = this.sessionData.step3.work_hours_per_day;

    this.unavoidables = (7 * sleepHrs) + (workDays * workHrs);
    this.freeTime = (24 * 7) - this.unavoidables;

    const annualContactDays = this.sessionData.various.annual_contact_days; // This are the annual contact days  with the user's key relationship
    const annualContactHrs = annualContactDays * 8; // Assuming a contact day is 8 hours
    this.keyRelationship = annualContactHrs / 52; // Reflects weekly contact hours
  }

  breakdownChart(e) {
    // Update status bar
    if (e) {
      e.target === this.nextBtnTarget ? this.updateStatusBar(5) : this.updateStatusBar(-5);
    } else {
      this.updateStatusBar(5);
    }

    // Update title and legend
    const title = `Here’s a breakdown of your unavoidables vs free time in a typical week:`;
    this.setTitle(title);
    this.legendTarget.innerHTML = `<span class="second">Free time</span> vs <span class="first">unavoidables</span>`;

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
      options: {
        responsive: true,
        legend: {
            display: false,
        }
      }
    };

    this.outputChart = new Chart(this.timeBreakdownTarget, config);

    // Update next and back buttons
    this.nextBtnTarget.setAttribute('data-action', 'click->multistage-step3-output#breakdownChartDetailed');
    this.backBtnTarget.setAttribute('data-action', 'click->multistage-step3-output#backToInput');
  }

  breakdownChartDetailed(e) {
    // Update status bar
    e.target === this.nextBtnTarget ? this.updateStatusBar(5) : this.updateStatusBar(-5);

    const nickname = this.sessionData.step2.nickname;

    // Update title and legend
    const title = `Here is how much of that you spend with ${nickname}:`;
    this.setTitle(title);
    this.legendTarget.innerHTML = `<span class="third">Time w/ ${nickname}</span> vs <span class="second">other free time</span> vs <span class="first">unavoidables</span>`;

    const adjustedFreeTime = this.freeTime - this.keyRelationship;

    // Update labels
    this.outputChart.data.labels = [
        'Unavoidables',
        'Free time',
        `Weekly time w/ ${nickname}`
    ];

    // Update datasets
    this.outputChart.data.datasets.forEach((dataset) => {
        dataset.data = [this.unavoidables, adjustedFreeTime, this.keyRelationship];
        dataset.backgroundColor = [
            'rgb(168, 213, 186)',
            'rgb(34, 82, 70)',
            'rgb(255, 119, 119)'
        ];
    });

    // Re-render the chart to animate the changes
    this.outputChart.update();

    // Update next and back buttons
    this.nextBtnTarget.setAttribute('data-action', 'click->multistage-step3-output#whatMattersChart');
    this.backBtnTarget.setAttribute('data-action', 'click->multistage-step3-output#breakdownChart');
  }

  whatMattersChart(e) {
    // Update status bar
    e.target === this.nextBtnTarget ? this.updateStatusBar(5) : this.updateStatusBar(-5);

    const nickname = this.sessionData.step2.nickname;

    // Update title and legend
    const title = `Ready to grow into new habits and refocus your freetime on what matters?`;
    this.setTitle(title);
    this.legendTarget.innerHTML = `<span class="third">Time w/ ${nickname}</span> and <span class="second">other free time</span>`;

    // Assuming `this.chart` is the chart instance
    // Update labels
    this.outputChart.data.labels = [
      'Free time',
      `Weekly time w/ ${nickname}`
    ];

    // Update datasets
    this.outputChart.data.datasets.forEach((dataset) => {
        dataset.data = [(this.freeTime - this.keyRelationship), this.keyRelationship];
        dataset.backgroundColor = [
            'rgb(34, 82, 70)',
            'rgb(255, 119, 119)'
        ];
    });

    // Re-render the chart to animate the changes
    this.outputChart.update();

    // Update next and back buttons
    this.nextBtnTarget.setAttribute('data-action', 'click->multistage-step3-output#finalStep');
    this.nextBtnTarget.innerText = 'Get Started!'
    this.backBtnTarget.setAttribute('data-action', 'click->multistage-step3-output#breakdownChartDetailed');
  }

  finalStep() {
    // Redirect to sign up
    window.location.href = '/users/sign_up';
  }

  setTitle(newTitle) {
    this.titleTarget.innerText = newTitle;
  }

  backToInput() {
    window.location.href = '/multistages/step3_input';
  }

  updateStatusBar(progress, init=false) {
    if (init) this.statusTarget.style.width = '81%';

    const currentWidth = parseFloat(this.statusTarget.style.width);
    this.statusTarget.style.width = `${currentWidth + progress}%`;
  }
}
