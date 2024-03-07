class Relationship < ApplicationRecord
  belongs_to :user, optional: true

  validates :nickname, :relation_to, :date_of_birth, :meet_date, :contact_days, :contact_days_per, presence: true
  validates :nickname, length: { maximum: 20, message: "maximum %{count} characters" }
  validates :relation_to, inclusion: { in: ->(_relationship) { relation_to_options(true) }, message: "select option" }
  # validates :meet_date, numericality: { only_integer: true, in: 1..100 }
  validates :contact_days, numericality: { only_integer: true, greater_than: 0 }
  validate :contact_days_range
  validates :contact_days_per, inclusion: { in: ->(_relationship) { contact_days_per_options }, message: "select option" }

  def self.relation_to_options(capitalise = false)
    options = %w[parent partner child family friend]
    capitalised_options = options.map(&:capitalize)
    capitalise ? capitalised_options : options
  end

  def self.contact_days_per_options
    %w[week month year]
  end

  private

  def contact_days_range
    return if contact_days_per.blank? || contact_days.blank?

    case contact_days_per
    when "week"
      errors.add(:contact_days, "must be 7 or less for week") if contact_days > 7
    when "month"
      errors.add(:contact_days, "must be 30 or less for month") if contact_days > 30
    when "year"
      errors.add(:contact_days, "must be 365 or less for year") if contact_days > 365
    end
  end
end
