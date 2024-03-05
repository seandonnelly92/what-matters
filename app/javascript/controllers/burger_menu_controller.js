import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="burger-menu"
export default class extends Controller {
  static targets = [
    "menuButton",
    "menuWindow"
  ]

  connect() {
    console.log("Hello from the burger-menu controller!");

    // Bind each once so that the same instance of the controller is used
    this.closeMenu = this.closeMenu.bind(this);
    this.drag = this.drag.bind(this);
    this.stopDrag = this.stopDrag.bind(this);

    // Listen for both mouse and touch start events (i.e. start clicking or start touching)
    this.menuButtonTarget.addEventListener('mousedown', this.startDrag.bind(this));
    this.menuButtonTarget.addEventListener('touchstart', this.startDrag.bind(this), { passive: false });
  }

  startDrag(e) {
    e.preventDefault();

    const position = this.menuButtonTarget.getBoundingClientRect();
    this.startPositionX = position.x;
    this.startPositionY = position.y;

    // Determine if the event is touch or mouse and set corresponding move and end events
    if (e.type === 'mousedown') {
      this.moveEvent = 'mousemove';
      this.stopEvent = 'mouseup';
    } else if (e.type === 'touchstart') {
      this.moveEvent = 'touchmove';
      this.stopEvent = 'touchend';
    }

    // Add event listeners for move and stop events
    document.addEventListener(this.moveEvent, this.drag);
    document.addEventListener(this.stopEvent, this.stopDrag);
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
    const rect = this.menuButtonTarget.getBoundingClientRect();
    const centerX = clientX - (rect.width / 2);
    const centerY = clientY - (rect.height / 2);

    // Update the element's position to be centered
    this.menuButtonTarget.style.left = `${centerX}px`;
    this.menuButtonTarget.style.top = `${centerY}px`;
  }

  stopDrag(e) {
    document.removeEventListener(this.moveEvent, this.drag);
    document.removeEventListener(this.stopEvent, this.stopDrag);

    const endPosition = this.menuButtonTarget.getBoundingClientRect();
    const deltaX = this.startPositionX - endPosition.x;
    const deltaY = this.startPositionY - endPosition.y;

    if (deltaX === 0 && deltaY === 0) {
      this.toggleMenu(e)
    }
  }

  toggleMenu(e) {
    this.menuWindowTarget.classList.toggle("menu-open");

    if (this.menuWindowTarget.classList.contains("menu-open")) {
      document.addEventListener("click", this.closeMenu, true);
    } else {
      document.removeEventListener("click", this.closeMenu, true);
    }
  }

  closeMenu(e) {
    if (!this.menuWindowTarget.contains(e.target) &&
      !this.menuButtonTarget.contains(e.target)) {
      this.menuWindowTarget.classList.remove("menu-open");
      document.removeEventListener("click", this.closeMenu, true);
    }
  }
}
