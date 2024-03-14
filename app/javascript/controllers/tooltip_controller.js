import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["tticon", "ttcard", "ttcross"]

  connect() {
    console.log('Hello from the tooltip controller');
  }

  open(event) {
    console.log('Tooltip clicked to open');
    this.ttcardTarget.classList.add('display-message');
    console.log(this.ttcardTarget);
    // debugger
  }

  close(event) {
    const clickedElement = event.target;
    if (!clickedElement.closest('.tooltip-card')) {
      this.ttcardTarget.classList.remove('display-message')
    }
    console.log('Tooltip clicked to close')
  }

  cross(event) {
    if (event.Target = this.ttcrossTarget) {
      console.log('cross clicked')
      this.ttcardTarget.classList.remove('display-message')
    }
  }
}
