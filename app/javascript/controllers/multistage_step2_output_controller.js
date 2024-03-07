import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="multistage-step2-output"
export default class extends Controller {
  static targets = [
    "title",
    "table",
    "nextBtn",
    "divStep3" // Note: divStep3 is dynamically added in the third step of the output so can only be targetted after creation
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
    // Colors the circles of the table based on the pastYrs together
    this.colorCircles(this.pastYrs);

    // Set the title of the page
    const percentage = Math.round((this.pastYrs / this.sharedYrs) * 100);
    const secondTitle = `You've used up ${this.pastYrs} of those ${this.sharedYrs} years. That's ${percentage}%. You have ${this.futureYrs} left.`;
    this.setTitle(secondTitle);

    // Update the next button to be used for the thirdStepOutput() if the relation_to is a 'parent' or 'child'
    const relation_to = this.sessionData.step2.relation_to.toLowerCase();
    if (relation_to === 'parent' || relation_to === 'child') {
      this.nextBtnTarget.setAttribute('data-action', 'click->multistage-step2-output#thirdStepOutput');
    } else {
      window.location.href = '/multistages/step3_input'; // Redirects to next step if relation is not 'parent' or 'child'
    }
  }

  thirdStepOutput() {
    const nickname = this.sessionData.step2.nickname;

    // Set the title of the page
    const thirdTitle = `But wait. What about actual contact time with ${nickname}?`;
    this.setTitle(thirdTitle);

    // Empty the table with the years on the page
    this.resetYearsTable();

    // Add a div below the table which will include the additional information
    this.tableTarget.insertAdjacentHTML('afterend', '<div data-multistage-step2-output-target="divStep3"></div>');

    // Include the narrative of the page for the different paragraphs
    const part1 = `If you’re like the average person in the UK, you probably moved out at 18 and started seeing ${nickname} considerably less.`
    this.divStep3Target.insertAdjacentHTML('beforeend', `<p>${part1}</p>`);

    const part2 = `If so, you’ve probably used up a lot more time with ${nickname} than you realise... Let’s assume you spent 7 days per week with ${nickname} until you were 18 (on average, over those years).`
    this.divStep3Target.insertAdjacentHTML('beforeend', `<p>${part2}</p>`);

    const part3 = `That’s roughly 365 days per year.`
    this.divStep3Target.insertAdjacentHTML('beforeend', `<p>${part3}</p>`);

    const daysPer = this.sessionData.step2.contact_days_per.toLowerCase();
    const contactDays = this.sessionData.step2.contact_days;
    const annualContact = this.annualContactDays(daysPer, contactDays)


    const part4 = `Now, you spend ${this.sessionData.step2.contact_days} days per ${daysPer} with ${nickname}. ${annualContact}`
    this.divStep3Target.insertAdjacentHTML('beforeend', `<p>${part4}</p>`);

    console.log(`Youth years is: ${this.youthYrs}`);
    console.log(`Future years is: ${this.futureYrs}`);
    console.log(`Annual contact is: ${annualContact} days`);
    const totalDays = (this.youthYrs * 365) + (this.futureYrs * annualContact); // Calculates total based on youth years and customised annual contact in future years
    const part5 = `Based on this, the total time you’ll ever spend with ${nickname} is ${totalDays} days.`;
    this.divStep3Target.insertAdjacentHTML('beforeend', `<h3>${part5}</h3>`);
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

    // We also need the time spent together until the child is 18 in the parent/child relationships
    if (relation_to === 'parent' || relation_to === 'child') {
      relation_to === 'parent' ? this.sharedYouthYears(userAge) : this.sharedYouthYears(relationAge);
    }
  }

  sharedYouthYears(childAge) {
    const delta = childAge - (childAge - this.partYrs); // Based on the different between the age of the child vs the years since meetdate
    this.youthYrs = 18 - delta; // Accounts for the days prior to the parent 'meeting' the child, if any
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

  resetYearsTable() {
    this.tableTarget.innerHTML = '';
  }

  colorCircles(years) {
    const circles = this.tableTarget.querySelectorAll('.year-circle');
    let delay = 0; // Initial delay in milliseconds
    const delayIncrement = 30; // Delay increment for each circle to create the animation effect

    circles.forEach(circle => {
      const circleYear = parseInt(circle.getAttribute('data-year'), 10);
      if (circleYear <= years) {
        setTimeout(() => {
          circle.classList.add('colored');
        }, delay);
        delay += delayIncrement;
      } else {
        circle.classList.remove('colored');
      }
    });
  }

  setTitle(newTitle) {
    this.titleTarget.innerText = newTitle;
  }

  annualContactDays(daysPer, contactDays) {
    let annualContact;
    switch (daysPer) {
      case 'week':
        annualContact = Math.round(contactDays * 52);
        break;
      case 'month':
        annualContact = Math.round(contactDays * 12);
        break;
      default:
        annualContact = '';
    }
    return annualContact;
  }
}
