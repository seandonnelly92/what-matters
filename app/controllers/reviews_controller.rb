class ReviewsController < ApplicationController
  def index
    @reviews = Review.order(created_at: :desc)
  end
end
