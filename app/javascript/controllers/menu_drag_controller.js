import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="menu-drag"
export default class extends Controller {
  connect() {
    console.log("Hello from the menu-drag controller!");

    // Listen for both mouse and touch start events (i.e. start clicking or start touching)
    this.element.addEventListener('mousedown', this.startDrag.bind(this));
    this.element.addEventListener('touchstart', this.startDrag.bind(this), { passive: false });
  }

  startDrag(e) {
    e.preventDefault();

    // Determine if the event is touch or mouse and set corresponding move and end events
    if (e.type === 'mousedown') {
      this.moveEvent = 'mousemove';
      this.stopEvent = 'mouseup';
    } else if (e.type === 'touchstart') {
      this.moveEvent = 'touchmove';
      this.stopEvent = 'touchend';
    }

    // Add event listeners for move and stop events
    document.addEventListener(this.moveEvent, this.drag.bind(this));
    document.addEventListener(this.stopEvent, this.stopDrag.bind(this));
  }

  drag(e) {
    let clientX, clientY;

    if (e.type === 'touchmove') {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Calculates the center of the burger-menu based on its dimensions
    const rect = this.element.getBoundingClientRect();
    const centerX = clientX - (rect.width / 2);
    const centerY = clientY - (rect.height / 2);

    // Update the element's position to be centered
    this.element.style.left = `${centerX}px`;
    this.element.style.top = `${centerY}px`;
  }

  stopDrag(e) {
    document.removeEventListener(this.moveEvent, this.drag);
    document.removeEventListener(this.stopEvent, this.stopDrag);
  }
}
