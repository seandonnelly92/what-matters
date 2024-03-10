import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="reviews"
export default class extends Controller {
  static targets = [
    "menu",
    "container",
    "label"
  ]

  connect() {
    console.log("Hello from the reviews controller!");
  }

  sortbyMenu() {
    if (this.menuTarget.classList.contains('show')) {
      this.menuTarget.classList.remove('show')
      setTimeout(() => {
        this.menuTarget.classList.remove('visible')
      }, 300); // Set timeout equal to the transition of the menu
    } else {
      this.menuTarget.classList.add('visible')
      this.menuTarget.classList.add('show')
    }
  }

  recentSort(e) {
    e.preventDefault();
    this.updateReviews('/reviews/sort_recent', 'Reviews - Recent');
  }

  ratingHighSort(e) {
    e.preventDefault();
    this.updateReviews('/reviews/sort_rating_high', 'Reviews - High to low');
  }

  ratingLowSort(e) {
    e.preventDefault();
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
