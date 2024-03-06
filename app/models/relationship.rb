class Relationship < ApplicationRecord
  attr_reader :relation_to

  belongs_to :user, optional: true

  validates :nickname, :relation_to, :date_of_birth, :meet_date, :contact_minutes_per_week, presence: true
  validate :meet_date_cannot_be_in_future
  validates :contact_minutes_per_week, numericality: { less_than_or_equal_to: 10_080, message: "must be less than than 10080" }

  def initialize(attr = {})
    super(attr)
    @relation_to = %w[Parent Partner Child Family Friend]
  end

  def meet_date_cannot_be_in_future
    errors.add(:meet_date, "meet date cannot be in the future") if meet_date > created_at
  end
end
