class User < ApplicationRecord
  attr_accessor
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable
         ## temporarily removed 'validatable' in order to allow for seed file to be generated... should restore

  has_many :habits
  has_many :relationships

  validates :first_name, :last_name, :date_of_birth, :work_days_per_week, :work_hours_per_day, :sleep_hours_per_day, presence: true

  validates :work_days_per_week, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 7, message: "must be less than or equal to 7" }
  validates :work_hours_per_day, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 24, message: "must be less than or equal to 24" }
  validates :sleep_hours_per_day, numericality: { greater_than_or_equal_to: 0, message: "must be greater than 0" }

  # # MULTIFACTOR STEP VALIDATIONS
  validate :date_of_birth_validation, on: :step1_valid

  validate :clear_errors, on: :step3_valid
  validate :work_days_per_week_validation, on: :step3_valid
  validate :work_hours_per_day_validation, on: :step3_valid
  validate :sleep_hours_per_day_validation, on: :step3_valid

  def clear_errors
    errors.clear # Clear previous error given that we only want errors related to the partial
  end

  def date_of_birth_validation
    errors.clear # Clear previous error given that we only want errors related to the partial
    errors.add(:date_of_birth, "can't be blank") if date_of_birth.blank?
  end

  def work_days_per_week_validation
    errors.add(:work_days_per_week, "select an option") if work_days_per_week.blank?
    return if work_days_per_week.blank?

    errors.add(:work_days_per_week, "should be between 0 and 7") if work_days_per_week.negative?
    errors.add(:work_days_per_week, "should be between 0 and 7") if work_days_per_week > 7
  end

  def work_hours_per_day_validation
    errors.add(:work_hours_per_day, "select an option") if work_hours_per_day.blank?
    return if work_hours_per_day.blank?

    errors.add(:work_hours_per_day, "should be between 0 and 24") if work_hours_per_day.negative?
    errors.add(:work_hours_per_day, "should be between 0 and 24") if work_hours_per_day > 24
  end

  def sleep_hours_per_day_validation
    errors.add(:sleep_hours_per_day, "select an option") if sleep_hours_per_day.blank?
    return if sleep_hours_per_day.blank?

    errors.add(:sleep_hours_per_day, "should be between 0 and 24") if sleep_hours_per_day.negative?
    errors.add(:sleep_hours_per_day, "should be between 0 and 24") if sleep_hours_per_day > 24
  end
end
