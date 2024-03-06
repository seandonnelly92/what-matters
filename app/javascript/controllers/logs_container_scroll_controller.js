import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="logs-container-scroll"
export default class extends Controller {
  connect() {
    console.log("Hello from logs container scroller")
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.element.scrollTop = this.element.scrollHeight;
    };
};
