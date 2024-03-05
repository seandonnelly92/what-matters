class Relationship < ApplicationRecord
  belongs_to :user, optional: true

  validates :nickname, :relation_to, :date_of_birth, :meet_date, :contact_time_per_week, presence: true
  validate :meet_date_cannot_be_in_future
  validates :contact_minutes_per_week, numericality: {less_than_or_equal_to: 10_080, message: "must be greater than 10080" }
end

def meet_date_cannot_be_in_future
  if meet_date > created_at
    errors.add(:meet_date, "meet date cannot be in the future")
  end
end
