class ReviewsController < ApplicationController
  def index
    @reviews = Review.order(created_at: :desc)
  end

  def sort_recent
    @reviews = Review.order(created_at: :desc)
    render_review_html
  end

  def sort_rating_high
    @reviews = Review.order(rating: :desc)
    render_review_html
  end

  def sort_rating_low
    @reviews = Review.order(rating: :asc)
    render_review_html
  end

  private

  def render_review_html
    rendered_reviews = @reviews.map do |review|
      render_to_string(partial: 'reviews/review', locals: { review: review }, formats: [:html])
    end.join

    render html: rendered_reviews.html_safe
  end
end
