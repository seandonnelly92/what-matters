import { Controller } from "@hotwired/stimulus"
// import { Swiper } from 'swiper/swiper-bundle'
// import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs'

// Connects to data-controller="tracker-menu"
export default class extends Controller {
  static targets = [
    "month",
    "year",
    "days",
    "selected"
  ]

  connect() {
    console.log("Hello from tracker-menu controller!");

    this.screenWidth = this.daysTarget.offsetWidth;
    this.todayDate = new Date();
    this.createMenu();

    this.timer = null;
    this.scrollWait = 500;
  }

  createMenu() {
    let currentDate = new Date(this.todayDate);

    if (this.hasSelectedTarget) {
      console.log("YESS");
      console.log(this.selectedTarget.dataset.date);
      currentDate = new Date(this.selectedTarget.dataset.date);
      console.log(currentDate);
      this.resetMenu();
    }

    // Need a separate IF for the current date (probably replace that with this.todayDate as that can be used directly)

    this.prevMonth = this.getRelativeMonth(currentDate, -1);
    this.buildMenuMonth(this.prevMonth, this.todayDate, 'afterbegin');

    this.currMonth = this.getRelativeMonth(currentDate);
    this.buildMenuMonth(this.currMonth, this.todayDate, 'beforeend')

    this.nextMonth = this.getRelativeMonth(currentDate, 1);
    this.buildMenuMonth(this.nextMonth, this.todayDate, 'beforeend');

    this.setMenuMargins();
    this.menuCenter();
  }

  getRelativeMonth(inputDate, delta = 0) {
    // Note: Will return month with calendar day 1
    const relativeMonth = new Date(inputDate);
    relativeMonth.setDate(1);
    relativeMonth.setMonth(relativeMonth.getMonth() + delta);
    return relativeMonth;
  }

  buildMenuMonth(date, today, position) {
    date = new Date(date); // Esnures the original date is not updated
    const todayStr = today.toLocaleDateString();

    const referenceMonth = date.getMonth();
    // After begin requires the month to be added from end to begin
    if (position === 'afterbegin') {
      date.setMonth(date.getMonth() + 1); // First get next month
      date.setDate(date.getDate() - 1); // Subtract a day to get to end of previous month
    }
    while (date.getMonth() === referenceMonth) {
      const dateStr = date.toLocaleDateString();

      const todayClass = (dateStr === todayStr) ? 'today selected' : '';
      const todayTarget = (dateStr === todayStr) ? 'data-tracker-menu-target="selected"' : '';
      const todayValue = (dateStr === todayStr) ? 'Today' : date.getDate();

      const dayHTML = `<div class="t-day ${todayClass}" data-action="click->tracker-menu#selectDay" ${todayTarget} data-date="${date.toDateString()}">${todayValue}</div>`
      this.daysTarget.insertAdjacentHTML(position, dayHTML)

      position === 'afterbegin' ? date.setDate(date.getDate() + -1) : date.setDate(date.getDate() + 1); // Determines direction of iterating through month
    }
  }

  setMenuMargins(margin = 2) {
    this.daysMenuWidth = this.daysTarget.scrollWidth; // Total container width after adding the three months

    this.scrollMarginLeft = this.screenWidth * margin;
    console.log(`Scroll margin left is: ${this.scrollMarginLeft}`);
    this.scrollMarginRight = (this.daysMenuWidth - this.screenWidth) - (this.screenWidth * margin);
    console.log(`Scroll margin right is: ${this.scrollMarginRight}`);
  }

  menuScroll() {
    if (this.timer !== null) {
      clearTimeout(this.timer);
    }

    this.menuFindCenter(); // This will be done contiuously on scrolling

    this.timer = setTimeout(() => {
      this.onScrollStop();
    }, this.scrollWait);
  }

  onScrollStop() {
    const scrollLeft = this.daysTarget.scrollLeft;

    if (scrollLeft < this.scrollMarginLeft) {
      console.log("Too far to the left");
      this.menuExpand('left');
    } else if (scrollLeft > this.scrollMarginRight) {
      console.log("Too far to the right");
      this.menuExpand('right')
    }
  }

  menuExpand(direction) {
    console.log("EXPANDING - before");
    console.log(`Scroll width is: ${this.daysTarget.scrollWidth}`);
    console.log(`Left scroll is: ${this.daysTarget.scrollLeft}`);
    if (direction === 'left') {
      this.prevMonth = this.getRelativeMonth(this.prevMonth, -1);
      this.buildMenuMonth(this.prevMonth, this.todayDate, 'afterbegin');
      console.log(`Left scroll is: ${this.daysTarget.scrollLeft}`);
      this.setMenuScroll(this.daysTarget.scrollLeft + (this.daysTarget.scrollWidth - this.daysMenuWidth));
    } else if (direction === 'right') {
      this.nextMonth = this.getRelativeMonth(this.nextMonth, +1);
      this.buildMenuMonth(this.nextMonth, this.todayDate, 'beforeend');
    }
    console.log("EXPANDING - after");
    console.log(`Current width is: ${this.daysTarget.scrollWidth}`);
    console.log(`Left scroll is: ${this.daysTarget.scrollLeft}`);
    this.setMenuMargins();
  }

  menuFindCenter() {
    const scrollElement = this.daysTarget;
    const allDays = scrollElement.querySelectorAll('.t-day');

    let dayIndex = Math.floor((allDays.length - 1) / 2);
    let calcDay = allDays[dayIndex];

    const dayWidth = (calcDay.classList.contains('today')) ? calcDay.nextSibling.offsetWidth : calcDay.offsetWidth;

    const midScreen = this.daysTarget.scrollLeft + (this.screenWidth / 2);
    let delta = midScreen - calcDay.offsetLeft;

    // Note: included 0.5 of the daywidth as margin for finding the center
    while (delta < (dayWidth * -1.5) || delta > (dayWidth * 1.5)) {
      const dayJump = Math.floor(delta / dayWidth);
      dayIndex += dayJump;
      calcDay = allDays[dayIndex];
      delta = midScreen - calcDay.offsetLeft;
    }

    this.setTrackerInput(calcDay);
  }

  menuCenter() {
    // Centers the menu on the this.selectedTarget
    const scrollElement = this.daysTarget;
    const selectElement = this.selectedTarget;

    if (scrollElement && selectElement) {
      const leftScrollPosition = selectElement.offsetLeft + (selectElement.offsetWidth / 2) - (scrollElement.offsetWidth / 2);
      // scrollElement.scrollLeft = leftScrollPosition;
      this.setMenuScroll(leftScrollPosition);
    }
  }

  setMenuScroll(scrollPosition) {
    this.daysTarget.scrollLeft = scrollPosition;
  }

  setTrackerInput(day) {
    const date = new Date(day.dataset.date);
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.getFullYear();

    this.monthTarget.innerHTML = `${month} <i class="fa-solid fa-caret-down"></i>`
    this.yearTarget.innerHTML = `${year} <i class="fa-solid fa-caret-down"></i>`
  }

  selectDay(e) {
    this.selectedTarget.classList.remove('selected');
    this.selectedTarget.removeAttribute('data-tracker-menu-target');

    e.currentTarget.classList.add('selected');
    e.currentTarget.setAttribute('data-tracker-menu-target', 'selected');

    this.menuCenter();
    this.createMenu();
  }

  resetMenu() {
    const allDays = this.daysTarget.querySelectorAll('.t-day');
    allDays.forEach((day) => {
      day.remove();
    });
  }

  // Tried SWIPER below

  // initCarousel() {
  //   console.log(document.querySelector('.swiper-container'));
  //   this.swiper = new Swiper('.swiper-container', {
  //     slidesPerView: 7,
  //     centeredSlides: true,
  //     initialSlide: 4,
  //     // initialSlide: this.indexOfToday(),
  //   });

  //   console.log(this.swiper);

  //   this.swiper.on('slideChange', () => {
  //     this.updateDaysBasedOnCarousel();
  //   });
  // }
}
