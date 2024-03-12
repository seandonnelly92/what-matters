import { Controller } from "@hotwired/stimulus"
// import { Swiper } from 'swiper/swiper-bundle'
// import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs'

// Connects to data-controller="tracker-menu"
export default class extends Controller {
  static targets = [
    "month",
    "monthMenu",
    "year",
    "yearMenu",
    "days",
    "selected",
    "log"
  ]

  connect() {
    console.log("Hello from tracker-menu controller!");

    this.screenWidth = this.daysTarget.offsetWidth;
    this.todayDate = new Date();

    this.createMenu();

    this.timer = null;
    this.scrollWait = 500;

    window.addEventListener('scroll', this.pageScroll.bind(this)); // Binding controller instance
  }

  createMenu() {
    let currentDate = new Date(this.todayDate); // Default value is today

    if (this.hasSelectedTarget) {
      currentDate = new Date(this.selectedTarget.dataset.date);
      this.resetMenu();
    }

    this.prevMonth = this.getRelativeMonth(currentDate, -1);
    this.buildMenuMonth(this.prevMonth, currentDate, 'afterbegin');

    this.currMonth = this.getRelativeMonth(currentDate);
    this.buildMenuMonth(this.currMonth, currentDate, 'beforeend')

    this.nextMonth = this.getRelativeMonth(currentDate, 1);
    this.buildMenuMonth(this.nextMonth, currentDate, 'beforeend');

    this.setMenuMargins();
    this.menuCenter(false);
  }

  getRelativeMonth(inputDate, delta = 0) {
    // Note: Will return month with calendar day 1
    const relativeMonth = new Date(inputDate);
    relativeMonth.setDate(1);
    relativeMonth.setMonth(relativeMonth.getMonth() + delta);
    return relativeMonth;
  }

  buildMenuMonth(date, currentDate, position) {
    date = new Date(date); // Esnures the original date is not updated
    const todayStr = this.todayDate.toLocaleDateString();
    const selectedStr = currentDate.toLocaleDateString()

    const referenceMonth = date.getMonth();
    // After begin requires the month to be added from end to begin
    if (position === 'afterbegin') {
      date.setMonth(date.getMonth() + 1); // First get next month
      date.setDate(date.getDate() - 1); // Subtract a day to get to end of previous month
    }
    while (date.getMonth() === referenceMonth) {
      const dateStr = date.toLocaleDateString();

      const currentClass = (dateStr === selectedStr) ? 'selected' : '';
      const todayTarget = (dateStr === selectedStr) ? 'data-tracker-menu-target="selected"' : '';
      const todayClass = (dateStr === todayStr) ? 'today' : '';
      const todayValue = (dateStr === todayStr) ? 'Today' : date.getDate();

      const dayHTML = `<div class="t-day ${currentClass} ${todayClass}" data-action="click->tracker-menu#selectDay" ${todayTarget} data-date="${date.toDateString()}">${todayValue}</div>`
      this.daysTarget.insertAdjacentHTML(position, dayHTML)

      position === 'afterbegin' ? date.setDate(date.getDate() + -1) : date.setDate(date.getDate() + 1); // Determines direction of iterating through month
    }
  }

  setMenuMargins(margin = 2) {
    this.daysMenuWidth = this.daysTarget.scrollWidth; // Total container width after adding the three months

    this.scrollMarginLeft = this.screenWidth * margin;
    // console.log(`Scroll margin left is: ${this.scrollMarginLeft}`);
    this.scrollMarginRight = (this.daysMenuWidth - this.screenWidth) - (this.screenWidth * margin);
    // console.log(`Scroll margin right is: ${this.scrollMarginRight}`);
  }

  menuScroll() {
    this.resetTimer();

    this.menuFindCenter(); // This will be done contiuously on scrolling

    this.timer = setTimeout(() => {
      this.onScrollStop();
    }, this.scrollWait);
  }

  resetTimer() {
    if (this.timer !== null) {
      clearTimeout(this.timer);
    }
  }

  onScrollStop() {
    const scrollLeft = this.daysTarget.scrollLeft;

    if (scrollLeft < this.scrollMarginLeft) {
      console.log("Expanding on the left");
      this.menuExpand('left');
    } else if (scrollLeft > this.scrollMarginRight) {
      console.log("Expanding on the right");
      this.menuExpand('right')
    }
  }

  menuExpand(direction) {
    // console.log("EXPANDING - before");
    // console.log(`Scroll width is: ${this.daysTarget.scrollWidth}`);
    // console.log(`Left scroll is: ${this.daysTarget.scrollLeft}`);
    const currentDate = new Date(this.selectedTarget.dataset.date);
    if (direction === 'left') {
      this.prevMonth = this.getRelativeMonth(this.prevMonth, -1);
      this.buildMenuMonth(this.prevMonth, currentDate, 'afterbegin');
      // console.log(`Left scroll is: ${this.daysTarget.scrollLeft}`);
      this.setMenuScroll(this.daysTarget.scrollLeft + (this.daysTarget.scrollWidth - this.daysMenuWidth), false);
    } else if (direction === 'right') {
      this.nextMonth = this.getRelativeMonth(this.nextMonth, +1);
      this.buildMenuMonth(this.nextMonth, currentDate, 'beforeend');
    }
    // console.log("EXPANDING - after");
    // console.log(`Current width is: ${this.daysTarget.scrollWidth}`);
    // console.log(`Left scroll is: ${this.daysTarget.scrollLeft}`);
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

  menuCenter(smooth = true) {
    // Centers the menu on the this.selectedTarget
    const scrollElement = this.daysTarget;
    const selectElement = this.selectedTarget;

    if (scrollElement && selectElement) {
      const leftScrollPosition = selectElement.offsetLeft + (selectElement.offsetWidth / 2) - (scrollElement.offsetWidth / 2);
      this.setMenuScroll(leftScrollPosition, smooth);
    }

    setTimeout(() => {
      this.scrollToSelected();
    }, this.scrollWait + 200);
  }

  setMenuScroll(scrollPosition, smooth = true) {
    if (smooth) {
      this.daysTarget.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    } else {
      this.daysTarget.scrollLeft = scrollPosition;
    }
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
    const prevDate = new Date(this.selectedTarget.dataset.date);
    const prevMonth = prevDate.getMonth();
    // console.log(`Previous selected month is: ${prevMonth}`);
    this.selectedTarget.removeAttribute('data-tracker-menu-target');

    e.currentTarget.classList.add('selected');
    e.currentTarget.setAttribute('data-tracker-menu-target', 'selected');
    const newDate = new Date(this.selectedTarget.dataset.date);
    const newMonth = newDate.getMonth();

    // console.log(`New selected month is: ${newMonth}`);

    if (prevMonth !== newMonth) {
      this.menuCenter(false);
      this.createMenu();
    } else {
      this.menuCenter(true);
    }
  }

  resetMenu() {
    const allDays = this.daysTarget.querySelectorAll('.t-day');
    allDays.forEach((day) => {
      day.remove();
    });
  }

  openInputMenu(e) {
    let clickedMenu = e.currentTarget;
    let type;
    if (clickedMenu === this.monthTarget) {
      console.log("Month");
      clickedMenu = this.monthMenuTarget;
      type = 'month';
    } else if (clickedMenu === this.yearTarget) {
      console.log("Year");
      clickedMenu = this.yearMenuTarget;
      type = 'year';
    }
    console.log("Clicked menu is:");
    console.log(clickedMenu);
    if (clickedMenu.classList.contains('show')) {
      clickedMenu.classList.remove('show')
      setTimeout(() => {
        clickedMenu.classList.remove('visible')
      }, 300); // Set timeout equal to the transition of the menu
      if (type === 'year') this.yearInputScroll(clickedMenu, 'remove');

    } else {
      this.inputMenuActive(clickedMenu, type);

      clickedMenu.classList.add('visible')
      clickedMenu.classList.add('show')

      if (type == 'year') this.yearInputScroll(clickedMenu, 'add');
    }
  }

  yearInputScroll(clickedMenu, action) {
    const scrollUp = clickedMenu.querySelector('.input-menu .up');
    console.log(scrollUp);
    const scrollDown = clickedMenu.querySelector('.input-menu .down');
    console.log(scrollDown);

    if (action == 'add') {

    }
  }

  inputMenuActive(clickedMenu, type) {
    const activeDate = new Date(this.selectedTarget.dataset.date)
    if (type === 'month') {
      const activeMonth = activeDate.toLocaleDateString('en-US', { month: 'long' });
      console.log(`Active month: ${activeMonth}`);
      const links = clickedMenu.querySelectorAll('a');
      links.forEach((l) => {
        console.log(l);
        console.log(`Link month: ${l.innerHTML}`);
        if (l.innerHTML === activeMonth) {
          l.classList.add('active')
        } else {
          l.classList.remove('active')
        }
      });
    } else if (type === 'year') {
      const activeYear = `${activeDate.getFullYear()}`;
      console.log(`Active year: ${activeYear}`);
      const links = clickedMenu.querySelectorAll('a');
      links.forEach((l) => {
        console.log(l);
        console.log(`Link year: ${l.innerHTML}`);
        if (l.innerHTML === activeYear) {
          l.classList.add('active')
        } else {
          l.classList.remove('active')
        }
      });
    }
  }

  scrollToSelected() {
    // const selectedDate = this.dateToString(this.selectedTarget.dataset.date);
    const selectedDate = new Date(this.selectedTarget.dataset.date);
    const selectedDateStr = this.dateToString(selectedDate);
    console.log(`Selected date: ${selectedDateStr}`);

    const selectedLog = document.querySelector('.date-start');
    selectedLog.classList.remove('date-start');
    console.log(selectedLog);


    const today = selectedDateStr === this.dateToString(this.todayDate);
    console.log(`Today variable is: ${today}`);
    console.log(`because today date is: ${this.dateToString(this.todayDate)}`);

    let prevLog = this.logTarget; // Sets initial log
    let selectLog = null;
    for (const log of this.logTargets) {
      const logDate = new Date(log.dataset.date)
      const logDateStr = this.dateToString(logDate);
      if (selectedDateStr === logDateStr) {
        selectLog = log;
      } else if (selectedDate < logDate) {
        selectLog = prevLog;
      }

      if (selectLog) {
        console.log("Entering select log");
        selectLog.classList.add('date-start');
        if (today) {
          console.log("It is today");
          selectLog.style.setProperty('--date-start-content', '"Today"');
        } else {
          const dateFormat = this.dateToFormat(selectLog.dataset.date);
          selectLog.style.setProperty('--date-start-content', `"${dateFormat}"`);
        }
        console.log('Scrolling into view!');
        selectLog.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        console.log("Select log at end is:");
        console.log(selectLog);
        break;
      } else {
        prevLog = log;
      }
    }
  }

  pageScroll(e) {
    this.resetTimer();

    this.timer = setTimeout(() => {
      this.onPageScrollStop(e);
    }, this.scrollWait);
  }

  onPageScrollStop() {
    console.log("Checking for center log");

    const centerLog = this.findCenterElement(this.logTargets);
    this.matchMenuScroll(centerLog);
  }

  findCenterElement(elements) {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const viewportCenter = viewportHeight / 2;

    let closestElement = null;
    let closestDistance = Infinity;

    for (const element of elements ) {
      const rect = element.getBoundingClientRect();
      const elementCenter = rect.top + (rect.height / 2);

      const distanceFromCenter = Math.abs(viewportCenter - elementCenter);

      if (distanceFromCenter > closestDistance) {
        break;
      } else {
        closestDistance = distanceFromCenter;
        closestElement = element;
      }
    }
    return closestElement;
  }

  matchMenuScroll(log) {
    console.log("Matching menu scroll to:");
    console.log(log);
    const logDate = new Date(log.dataset.date);
    const logDateStr = this.dateToString(logDate);
    console.log(`Date string of log is: ${logDateStr}`);

    let menuDays = document.querySelectorAll('.t-day');
    let totalDays = menuDays.length;
    console.log(`Total days is: ${totalDays}`);
    let findingMatch = true;
    let dayCounter = 0;
    // let searcher = 1;
    let day = menuDays[dayCounter];
    console.log(`Counter is: ${dayCounter}`);
    console.log("Day is:");
    console.log(day);
    let loopBreak = 0;
    while (findingMatch) {
      const dayDate = new Date(day.dataset.date);
      const datesDelta = this.datesDifferenceInDays(logDate, dayDate);
      const dayDateStr = this.dateToString(dayDate);
      console.log(`logDateStr: ${logDateStr}`);
      console.log(`dayDateStr: ${dayDateStr}`);

      if (logDateStr === dayDateStr) {
        console.log("Matched!");
        findingMatch = false;
      } else if (logDate < dayDate) {
        console.log("Checking to the left");
        dayCounter = Math.max(0, dayCounter + datesDelta); // Avoids being less than 0 on the index

        if (dayCounter === 0 ) {
          this.menuExpand('left');
          menuDays = document.querySelectorAll('.t-day');
          totalDays = menuDays.length;
          console.log(`Menu expanded to the left with totalDays now: ${totalDays}`);
        }
      } else if (logDate > dayDate) {
        console.log("Checking to the right");
        dayCounter = Math.min(totalDays - 1, dayCounter + datesDelta); // Avoids being >= than length on the index
        if (dayCounter === totalDays -1) {
          this.menuExpand('right');
          menuDays = document.querySelectorAll('.t-day');
          totalDays = menuDays.length;
          console.log(`Menu expanded to the right with totalDays now: ${totalDays}`);
        }
      } else {
        if (loopBreak > 15) break;
        loopBreak += 1;
      }

      console.log(`Counter is: ${dayCounter}`);
      day = menuDays[dayCounter];
      console.log("Day is:");
      console.log(day);
    }
    this.matchMenuScrollExecute(day);
  }

  matchMenuScrollExecute(menuDay) {
    console.log("!!! Executing Scroll !!!");
    console.log(menuDay);
    const leftScrollPosition = menuDay.offsetLeft + (menuDay.offsetWidth / 2) - (this.daysTarget.offsetWidth / 2);
    this.setMenuScroll(leftScrollPosition);
  }

  datesDifferenceInDays(date1, date2) {
    const differenceInMilliseconds = date1 - date2;
    const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
    return differenceInDays;
  }

  // Date helper methods
  dateToString(dateInput) {
    const date = new Date(dateInput);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  dateToFormat(dateInput) {
    const date = new Date(dateInput);

    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}
