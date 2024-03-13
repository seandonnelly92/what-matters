import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="linetracker"
export default class extends Controller {

  static targets = ["line", "circle"]

  connect() {
    console.log("hello from the line tracker controller");
    console.dir(this.lineTarget)
    console.dir(this.circleTarget)
    // console.log(this.circleTarget.classlist)

    if (this.circleTarget.completed?) {
      console.log("log is completed");
    } else {
      console.log("log not completed");
    }
    end




    // if circle.
  }
}
