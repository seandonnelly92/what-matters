class Relationship < ApplicationRecord
  attr_reader :relation_to

  belongs_to :user, optional: true

  validates :nickname, :relation_to, :date_of_birth, :meet_date, :contact_days, :contact_days_per, presence: true
  validate :meet_date_cannot_be_in_future
  # commented out validations to make seed work, as Rowan and Jasper have probably changed on their branch
  # validates :contact_minutes_per_week, numericality: { less_than_or_equal_to: 10_080, message: "must be less than than 10080" }

  def initialize(attr = {})
    super(attr)
    @relation_to = %w[Parent Partner Child Family Friend]
    @contact_days_per = %w[Week Month Year]
  end

  def meet_date_cannot_be_in_future
    errors.add(:meet_date, "meet date cannot be in the future") if meet_date > created_at
    # validates :contact_minutes_per_week, numericality: {less_than_or_equal_to: 10_080, message: "must be less than than 10080" }
    # Later: we should implement validations dependent on whether contact_days_per is week/month/year.
  end
end
