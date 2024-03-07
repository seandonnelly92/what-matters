class Habit < ApplicationRecord
  belongs_to :user
  # belongs_to :relationship
  has_many :logs
  has_one_attached :photo

  # validates :title, :identity_goal, :trigger, :reward, :duration_in_minutes, :week_recurrence, :current_streak, :best_streak, :start_time, presence: true
  validates :category, presence: true, inclusion: { in: [
    "Parents",
    "Children",
    "Relationship",
    "Family",
    "Friends",
    "Giving Back",
    "Creativity",
    "Travel",
    "Learning",
    "Wellbeing",
    "Sprituality",
    "Pets"], message: "%{value} is not a valid category" }

  CATEGORIES = [
    "Parents",
    "Children",
    "Relationship",
    "Family",
    "Friends",
    "Giving Back",
    "Creativity",
    "Travel",
    "Learning",
    "Wellbeing",
    "Sprituality",
    "Pets"]
end
