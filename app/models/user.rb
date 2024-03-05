class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :habits
  has_many :relationships

  validates :first_name, :last_name, :date_of_birth, :work_days_per_week, :work_hours_per_day, :sleep_hours_per_day, presence: true

  validates :work_days_per_week, numericality: {greater_than_or_equal_to: 0, less_than_or_equal_to: 7, message: "must be less than or equal to 7" }
  validates :work_hours_per_day, numericality: {greater_than_or_equal_to: 0, less_than_or_equal_to: 24, message: "must be less than or equal to 24" }
  validates :sleep_hours_per_day, numericality: {greater_than_or_equal_to: 0, message: "must be greater than 0" }
end
