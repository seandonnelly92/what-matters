class Review < ApplicationRecord
  belongs_to :user

  validates :content, :rating, presence: true
  validates :content, length: { minimum: 5 }
  validates :rating, numericality: { only_integer: true }
  validates :rating, comparison: { greater_than_or_equal_to: 1, less_than_or_equal_to: 5 }
end
