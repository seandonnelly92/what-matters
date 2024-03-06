class Relationship < ApplicationRecord
  attr_reader :relation_to, :contact_days_per

  belongs_to :user, optional: true

  validates :nickname, :relation_to, :date_of_birth, :meet_date, :contact_days, :contact_days_per, presence: true
  # validate :meet_date_cannot_be_in_future
  # validates :contact_minutes_per_week, numericality: { less_than_or_equal_to: 10_080, message: "must be less than than 10080" }

  def initialize(attr = {})
    super(attr)
    @relation_to = %w[Parent Partner Child Family Friend]
    @contact_days_per = %w[week month year]
  end

  def meet_date_cannot_be_in_future
    errors.add(:meet_date, "meet date cannot be in the future") if meet_date > DateTime.current
    # validates :contact_minutes_per_week, numericality: {less_than_or_equal_to: 10_080, message: "must be less than than 10080" }
    # Later: we should implement validations dependent on whether contact_days_per is week/month/year.
  end

  # MULTIFACTOR STEP VALIDATIONS
  validate :relationship_valid?, on: :step2_valid

  def relationship_valid?
    # errors.clear
    # # nickname validation
    # errors.add(:nickname, "can't be blank") if nickname.blank?
    # errors.add(:nickname, "should be less than 20 characters") if nickname.length > 20

    # # relation_to validation
    # errors.add(:relation_to, "can't be blank") if relation_to.blank?

    # # date_of_birth validation
    # errors.add(:date_of_birth, "can't be blank") if date_of_birth.blank?

    # # contact_days_per validation
    # errors.add(:contact_days_per, "can't be blank") if contact_days_per.blank?

    # # days_per validation
    # errors.add(:days_per, "can't be blank") if days_per.blank?
    # unless contact_days_per.blank?
    #   errors.add(:days_per, "must be greater than 0") if days_per <= 0
    #   case contact_days_per
    #   when "week"
    #     errors.add(:days_per, "must be 7 or less for days") if days_per > 7
    #   when "month"
    #     errors.add(:days_per, "must be 30 or less for months") if days_per > 30
    #   when "year"
    #     errors.add(:days_per, "must be 30 or less for years") if days_per > 365
    #   end
    # end
  end
end
