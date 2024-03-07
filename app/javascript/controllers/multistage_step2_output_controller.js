import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="multistage-step2-output"
export default class extends Controller {
  static targets = [
    "title"
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
        this.createOutput();
      })
      .catch(error => console.error("Error fetching session data:", error));
    }

    createOutput() {
    const relation_to = this.sessionData.step2.relation_to;

    switch(relation_to.toLowerCase()) {
      case 'parent':
        this.handleParent();
        break;
      case 'child':
        this.handleChild();
        break;
      default:
        this.handleOther();
    }

    this.setTitle();

  }

  handleParent() {
    console.log("It is a parent");
    const userDoB = new Date(this.sessionData.step1.date_of_birth);
    const parentDoB = new Date(this.sessionData.step2.date_of_birth);

    const parentAge = this.getAge(parentDoB)
    const sharedYrs = this.totalYrs - parentAge;
    console.log(`Shared years: ${sharedYrs}`);
  }

  handleChild() {
    console.log("It is a child");
    const userDoB = new Date(this.sessionData.step1.date_of_birth);
    const childDoB = new Date(this.sessionData.step2.date_of_birth);

    const userAge = this.getAge(userDoB)
    const sharedYrs = this.totalYrs - userAge;
    console.log(`Shared years: ${sharedYrs}`);
  }

  handleOther() {
    console.log("It is another relation");
    const userDoB = new Date(this.sessionData.step1.date_of_birth);
    const relationDoB = new Date(this.sessionData.step2.date_of_birth);

    const userAge = this.getAge(userDoB);
    const relationAge = this.getAge(relationDoB);

    const futureYrs = this.totalYrs - Math.max(userAge, relationAge); // Bases it on the older person

    const meetdate = new Date(this.sessionData.step2.meet_date);
    const pastYrs = this.getAge(meetdate);

    console.log(`User is ${userAge} and relation is ${relationAge}`);
    console.log(`You have ${futureYrs} left`);

    console.log(`You met ${pastYrs} years ago on ${meetdate}`);
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

  setTitle() {
    const nickname = this.sessionData.step2.nickname;
    this.titleTarget.innerText = `Assuming you and ${nickname} both live to 90, you’ll share 72 years of co-existence on planet Earth.`;
  }
}
