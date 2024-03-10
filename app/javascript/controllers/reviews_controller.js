import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="reviews"
export default class extends Controller {
  static targets = [
    "formDisplay",
    "star",
    "form",
    "menu",
    "container",
    "label"
  ]

  connect() {
    console.log("Hello from the reviews controller!");

    this.showForm() = this.showForm().bind(this);
    this.hideForm() = this.hideForm().bind(this);

    // Retrieves the required CRSF token from the HTML header (used to send requests)
    this.csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
  }

  showForm() {
    this.formDisplayTarget.classList.add('show')
    this.formDisplayTarget.classList.add('visible')

    this.target.innerText = 'Close';
    this.target.removeEventListener('click', this.showForm());
    this.target.addEventListener('click', this.resetForm());
  }

  hideForm() {
    this.formDisplayTarget.classList.remove('show')
    setTimeout(() => {
      this.formDisplayTarget.classList.remove('visible');

      this.target.innerText = 'Leave a review';
      this.target.addEventListener('click', this.showForm());
      this.target.removeEventListener('click', this.resetForm());
    }, 300);

  }

  setRating(e) {
    const clickedStar = e.target;
    if (this.rating && clickedStar.value === this.rating) {
      this.rating = 0;
    } else {
      this.rating = clickedStar.value;
    }

    this.starTargets.forEach((star, index) => {
      if (index < this.rating) {
        star.classList.add('selected');
      } else {
        star.classList.remove('selected');
      }
    });
  }

  submitReview(e) {
    e.preventDefault();

    const data = this.formDataJSON();

    fetch(`/reviews/add_review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json", // Explicitly accept JSON
        "X-CSRF-Token": this.csrfToken
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      this.clearErrors();

      if (data.errors) {
        console.log("ERRORS");
        console.log(data);
        console.log(data.errors);
        this.handleErrors(data.errors);
      } else {
        console.log("SUCCESS");
        console.log(data);
        this.resetForm();
        this.recentSort();
      }
    })
  }

  formDataJSON() {
    return { review:
      { content: this.formTarget.querySelector(`[name="review[content]"]`).value,
        rating: this.rating,
      }
    };
  }

  handleErrors(errors) {
    for (const [key, messages] of Object.entries(errors)) {
      const inputElement = this.element.querySelector(`[name="review[${key}]"]`);
      if (inputElement) {

        const errorsContainer = document.createElement('div');
        errorsContainer.classList.add('errors-container');

        // Adds the first message to the errorsContainer (we show one error at a time)
        const errorMessage = document.createElement('span');
        errorMessage.classList.add('error');
        errorMessage.innerText = messages[0];
        errorsContainer.insertAdjacentElement('beforeend', errorMessage);

        // Insert the errors container right after the input element
        inputElement.parentNode.insertBefore(errorsContainer, inputElement.nextSibling);
      }
    }
  }

  clearErrors() {
    const errorContainers = this.element.querySelectorAll('.errors-container');

    errorContainers.forEach(container => {
      container.remove();
    });
  }

  resetForm() {
    this.formTarget.reset();
    this.starTargets.forEach((star, index) => {
      star.classList.remove('selected');
    });
  }

  sortbyMenu(e) {
    if (this.menuTarget.classList.contains('show')) {
      this.menuTarget.classList.remove('show')
      setTimeout(() => {
        this.menuTarget.classList.remove('visible')
      }, 300); // Set timeout equal to the transition of the menu
    } else if (e) {
      this.menuTarget.classList.add('visible')
      this.menuTarget.classList.add('show')
    }
  }

  recentSort(e) {
    if (e) e.preventDefault();
    this.updateReviews('/reviews/sort_recent', 'Reviews - Recent');
  }

  ratingHighSort(e) {
    if (e) e.preventDefault();
    this.updateReviews('/reviews/sort_rating_high', 'Reviews - High to low');
  }

  ratingLowSort(e) {
    if (e) e.preventDefault();
    this.updateReviews('/reviews/sort_rating_low', 'Reviews - Low to high');
  }

  updateReviews(url, label) {
    fetch(url)
      .then(response => response.text())
      .then(html => {
        this.resetReviews();
        this.containerTarget.insertAdjacentHTML('beforeend', html);
        this.labelTarget.innerText = label;
        this.sortbyMenu();
      })
      .catch(error => console.log(error));
  }

  resetReviews() {
    const reviews = document.querySelectorAll('.card-review');
    reviews.forEach((review) => {
      review.remove();
    });
  }
}
