import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="multistage-step2-output"
export default class extends Controller {
  connect() {
    console.log("Hello from the multistage-step2-output controller!");

    console.log(this.fetchSessionData());
  }

  fetchSessionData() {
    fetch('fetch_session_data')
      .then(response => response.json())
      .then(data => {
        console.log("Session data:", data);
        console.log(data.step1);
      })
      .catch(error => console.error("Error fetching session data:", error));
  }
}
