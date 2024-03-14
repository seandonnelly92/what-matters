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
    "log",
    "sideMenu",
    "sideMenuSelector",
    "habitsList",
    "habitsButton",
    "streak"
  ]

  connect() {
    console.log("Hello from tracker-menu controller!");

    this.screenWidth = this.daysTarget.offsetWidth;
    this.todayDate = new Date();

    this.createMenu();

    this.timer = null;
    this.scrollWait = 500;

    this.pageScroll = this.pageScroll.bind(this);
    this.boundYearInputScrollEvent = this.yearInputScrollEvent.bind(this);
    this.boundMenuInputChangeMonth = this.menuInputChangeMonth.bind(this);
    this.boundChangeHabitsSelection = this.changeHabitsSelection.bind(this);

    window.addEventListener('scroll', this.pageScroll); // Binding controller instance

    this.setAllLogLines();
  }

  disconnect() {
    window.removeEventListener('scroll', this.pageScroll);
  }

  setAllLogLines() {
    const logs = this.logTargets;

    let prevLog = null;
    let logCount = 0;
    for (const log of logs) {
      if (log.classList.contains('hide-log')) continue;

      if (logCount === 0) {
        const lineTop = log.querySelector('.line.top');
        if(lineTop) lineTop.classList.add('missed');
      } else if (prevLog) {
        this.setLogLine(log, prevLog);
      }
      prevLog = log; // Set previous log equal to current for next loop iteration
      logCount += 1;
    }
    this.setCurrentStreak();
  }

  setLogLine(log, prevLog) {
    const prevDot = prevLog.querySelector('.dot');
    const currentDot = log.querySelector('.dot');
    const lineStart = prevLog.querySelector('.line.bottom');
    const lineEnd = log.querySelector('.line.top');

    this.clearLogLineClasses([lineStart, lineEnd]);

    let lineClass;
    if (prevDot.classList.contains('completed') && currentDot.classList.contains('completed')) {
      lineClass = 'completed';
    } else {
      const currentDate = new Date(log.dataset.date);
      const currentIsToday = this.dateToString(currentDate) === this.dateToString(this.todayDate);

      if (currentIsToday) {
        const prevDate = new Date(prevLog.dataset.date);
        const prevIsToday = this.dateToString(prevDate) === this.dateToString(this.todayDate);

        if (prevIsToday) {
          lineClass = 'pending';
        } else {
          lineClass = 'missed';
        }
      } else if (currentDate > this.todayDate) {
        // This means they are future (pending) logs
        lineClass = 'pending';
      } else {
        lineClass = 'missed';
      }
    }
    lineStart.classList.add(lineClass);
    lineEnd.classList.add(lineClass);
  }

  clearLogLineClasses(logLines) {
    logLines.forEach((logLine) => {
      logLine.classList.remove('missed');
      logLine.classList.remove('pending');
      logLine.classList.remove('completed');
    });
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
      this.activateInputMenu(clickedMenu, type, 'close');
    } else {
      this.activateInputMenu(clickedMenu, type, 'open');
    }
  }

  activateInputMenu(clickedMenu, type, action) {
    if (action === 'close') {
      if (type === 'year') this.yearInputScroll(clickedMenu, 'remove');
      this.menuInputChange(type, 'remove')

      clickedMenu.classList.remove('show')
      setTimeout(() => {
        clickedMenu.classList.remove('visible')
      }, 300); // Set timeout equal to the transition of the menu

    } else if (action === 'open') {
      this.inputMenuActive(clickedMenu, type);

      clickedMenu.classList.add('visible')
      clickedMenu.classList.add('show')

      if (type == 'year') this.yearInputScroll(clickedMenu, 'add');
      this.menuInputChange(type, 'add')
    }
  }

  yearInputScroll(clickedMenu, action) {
    const scrollUp = clickedMenu.querySelector('.input-menu .up');
    const scrollDown = clickedMenu.querySelector('.input-menu .down');

    if (action === 'add') {
      scrollUp.addEventListener('click', this.boundYearInputScrollEvent);
      scrollDown.addEventListener('click', this.boundYearInputScrollEvent);
    } else if (action === 'remove') {
      scrollUp.removeEventListener('click', this.boundYearInputScrollEvent)
      scrollDown.removeEventListener('click', this.boundYearInputScrollEvent)
    }
  }

  yearInputScrollEvent(e) {
    const years = this.yearMenuTarget.querySelectorAll('a');
    const selectedDate = new Date(this.selectedTarget.dataset.date);
    const activeYear = selectedDate.getFullYear().toString();

    let direction;
    if (e.currentTarget.classList.contains('up')) {
      direction = -1;
    } else if (e.currentTarget.classList.contains('down')) {
      direction = 1;
    }
    years.forEach((year) => {
      year.innerHTML = parseInt(year.innerHTML, 10) + direction;
      if (year.innerHTML === activeYear) {
        year.classList.add('active');
      } else {
        year.classList.remove('active');
      }
    });
  }

  menuInputChange(type, action) {
    if (type === 'month') {
      const menu = this.monthMenuTarget;
      const items = menu.querySelectorAll('a');
      items.forEach((item) => {
        if (action === 'add') {
          item.addEventListener('click', this.boundMenuInputChangeMonth);
        } else if (action === 'remove') {
          item.removeEventListener('click', this.boundMenuInputChangeMonth);
        }
      });
    } else if (type === 'year') {
      const menu = this.yearMenuTarget;
      const items = menu.querySelectorAll('a');
      items.forEach((item) => {
        if (action === 'add') {
          item.addEventListener('click', this.menuInputChangeYear.bind(this));
        } else if (action === 'remove') {
          item.removeEventListener('click', this.menuInputChangeYear.bind(this));
        }
      });
    }
  }

  menuInputChangeMonth(e) {
    e.preventDefault();
    const referenceDate = new Date(this.selectedTarget.dataset.date);
    const selectedMonth = this.dateMonthNumber(e.currentTarget.innerHTML);
    referenceDate.setMonth(selectedMonth);
    this.matchMenuScroll(null, false, referenceDate);
    this.activateInputMenu(this.monthMenuTarget, 'month', 'close');
  }

  menuInputChangeYear(e) {
    e.preventDefault();
    const referenceDate = new Date(this.selectedTarget.dataset.date);
    referenceDate.setFullYear(e.currentTarget.innerHTML);
    this.matchMenuScroll(null, false, referenceDate);
    this.activateInputMenu(this.yearMenuTarget, 'year', 'close');
  }

  inputMenuActive(clickedMenu, type) {
    const activeDate = new Date(this.selectedTarget.dataset.date)
    if (type === 'month') {
      const activeMonth = activeDate.toLocaleDateString('en-US', { month: 'long' });
      const links = clickedMenu.querySelectorAll('a');
      links.forEach((l) => {
        if (l.innerHTML === activeMonth) {
          l.classList.add('active')
        } else {
          l.classList.remove('active')
        }
      });
    } else if (type === 'year') {
      const activeYear = `${activeDate.getFullYear()}`;
      const links = clickedMenu.querySelectorAll('a');
      links.forEach((l) => {
        if (l.innerHTML === activeYear) {
          l.classList.add('active')
        } else {
          l.classList.remove('active')
        }
      });
    }
  }

  scrollToSelected(scrollMenu = false) {
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

      // Probably just need to add a continue if the log has the 'hide-log' class included (and then call this when filtering habits);
      // Also think about blocking the click on a future habit with a ::before pseudo card
      if (log.classList.contains('hide-log')) continue;

      const logDate = new Date(log.dataset.date)
      const logDateStr = this.dateToString(logDate);
      if (selectedDateStr === logDateStr) {
        selectLog = log;
      } else if (selectedDate < logDate) {
        selectLog = prevLog;
      }

      if (selectLog) {
        break;
      } else {
        prevLog = log;
      }
    }
    if (!selectLog) selectLog = this.logTargets[this.logTargets.length - 1]; // Set equal to last log
    // Maybe add a psuedo element to indicate when the above happens (i.e. taking the last log)

    console.log("Entering select log");
    console.log(selectLog);

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

    if (scrollMenu) this.matchMenuScroll(selectLog);
  }

  pageScroll(e) {
    // Here you may want to have a boolean which states whether the previous scroll is being executed to avoid it calling again (if method takes long than scrollWait)
    this.resetTimer();

    this.timer = setTimeout(() => {
      this.onPageScrollStop(e);
    }, this.scrollWait);
  }

  onPageScrollStop() {
    console.log("Checking for center log");

    const centerLog = this.findCenterElement(this.logTargets);
    if (centerLog) {
      this.matchMenuScroll(centerLog);
    }
  }

  findCenterElement(elements) {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const viewportCenter = viewportHeight / 2;

    let closestElement = null;
    let closestDistance = Infinity;

    for (const element of elements ) {
      if (element.classList.contains('hide-log')) continue;

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

  matchMenuScroll(log, isLog = true, inputDate = null) {
    // Note: Can also be used with Date object if isLog set to false in argument
    console.log("Matching menu scroll to:");
    console.log(log);
    const logDate = isLog ? new Date(log.dataset.date) : inputDate;
    // const logDate = new Date(log.dataset.date);
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
      }
      if (loopBreak > 5) break;
      loopBreak += 1;


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

  // Actions related to tracker side-menu
  openSideMenu(e) {
    if (this.sideMenuTarget.classList.contains('show')) {
      this.activateSideMenu('close');
    } else {
      this.activateSideMenu('open');
    }
  }

  activateSideMenu(action) {
    if (action === 'open') {
      this.sideMenuTarget.classList.add('show');
      this.sideMenuSelectorTarget.innerHTML = '<i class="fa-solid fa-caret-right"></i>';
    } else if (action === 'close') {
      this.sideMenuTarget.classList.remove('show');
      this.sideMenuSelectorTarget.innerHTML = '<i class="fa-solid fa-caret-left"></i>';
      this.activateHabitsFilter(action);
    }
  }

  goToToday() {
    const dayToday = this.daysTarget.querySelector('.t-day.today');
    if (dayToday) {
      dayToday.click();
      console.log(dayToday);
    } else {
      this.matchMenuScroll(null, false, this.todayDate);
      setTimeout(() => {
        const dayToday = this.daysTarget.querySelector('.t-day.today');
        dayToday.click();
      }, 300);
    }
    this.activateSideMenu('close');
  }

  openHabitsFilter(e) {
    if (this.habitsListTarget.classList.contains('show')) {
      this.activateHabitsFilter('close');
    } else {
      this.activateHabitsFilter('open');
    }
  }

  activateHabitsFilter(action) {
    if (action === 'open') {
      this.habitsListTarget.classList.add('show');
      this.habitsButtonTarget.innerHTML = 'Select habits <i class="fa-solid fa-caret-up"></i>';

      this.changeHabitsFilter('add');
    } else if (action === 'close') {
      this.changeHabitsFilter('remove');

      this.habitsListTarget.classList.remove('show');
      this.habitsButtonTarget.innerHTML = 'Select habits <i class="fa-solid fa-caret-down"></i>';
    }
  }

  changeHabitsFilter(action) {
    const items = this.habitsListTarget.querySelectorAll('a');
    items.forEach((item) => {
      if (action === 'add') {
        item.addEventListener('click', this.boundChangeHabitsSelection);
      } else if (action === 'remove') {
        item.removeEventListener('click', this.boundChangeHabitsSelection);
      }
    });
  }

  changeHabitsSelection(e) {
    e.preventDefault();

    const innerHTML = e.currentTarget.innerHTML;
    const habitTitle = innerHTML.split('</i> ')[1];

    this.updateHabitLabel(e.currentTarget, habitTitle);

    this.updateLogsDisplay(habitTitle);
  }

  updateHabitLabel(habit, habitTitle) {
    if (habit.classList.contains('included')) {
      habit.classList.remove('included');
      habit.innerHTML = `<i class="fa-regular fa-square"></i> ${habitTitle}`;
    } else {
      habit.classList.add('included');
      habit.innerHTML = `<i class="fa-regular fa-square-check"></i> ${habitTitle}`;
    }
  }

  updateLogsDisplay(habitTitle) {
    const logs = this.logTargets;
    logs.forEach((log) => {
      const logHabit = log.querySelector('.log-habit-title');
      if (habitTitle === logHabit.innerText) {
        log.classList.toggle('hide-log');
      }
    });
    this.setAllLogLines();
    this.scrollToSelected(true);
  }

  // Set streak
  setCurrentStreak() {
    console.log("Updating the current streak!!!");
    const logs = this.logTargets;

    let streak = 0;
    for (const log of logs) {
      if (log.classList.contains('hide-log')) continue;

      const dot = log.querySelector('.dot');

      const currentDate = new Date(log.dataset.date);
      const currentIsToday = this.dateToString(currentDate) === this.dateToString(this.todayDate);

      if (currentIsToday || currentDate < this.todayDate) {
        if (dot.classList.contains('completed')) {
          streak += 1;
        } else {
          streak = 0;
        }
        console.log(`Current streak is: ${streak}`);
      } else {
        break;
      }
    }
    // this.streakTarget.innerText = streak;

    const fixedStreak = document.getElementById('fixed-streak-container');
    const streakText = fixedStreak.querySelector('p');
    console.log(streakText);
    streakText.innerText = streak;
    console.log("UPDATED THE STREAK");
  }



  // Method related to completion message
  closeCompletionMessage(event) {
    const logo = document.getElementById('logo-container')
    const topLine = logo.querySelector('.logo-line.top');
    const logoCircle = logo.querySelector('#logo-circle');
    const bottomLine = logo.querySelector('.logo-line.bottom');

    this.setLogoAnimationDuration([topLine, logoCircle, bottomLine], '0.5s');
    topLine.classList.remove('show');
    logoCircle.classList.remove('show');
    bottomLine.classList.remove('show');

    setTimeout(() => {
      const text = document.getElementById('text-container');
      text.innerHTML = '';
      const completionMessage = document.getElementById('completion-message');
      completionMessage.classList.remove('display-message');
      const backgroundFilter = document.getElementById('background-filter')
      backgroundFilter.classList.remove('display-message')
    }, 500);
  }

  setLogoAnimationDuration(components, duration) {
    components.forEach((component) => {
      component.style.setProperty('--logo-animation-duration', duration);
    });
  }

  // Date helper methods
  datesDifferenceInDays(date1, date2) {
    const differenceInMilliseconds = date1 - date2;
    const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
    return differenceInDays;
  }

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

  dateMonthNumber(monthString) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const monthNumber = monthNames.indexOf(monthString);
    return monthNumber;
  }
}
