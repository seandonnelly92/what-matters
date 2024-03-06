class Habit < ApplicationRecord
  belongs_to :user
  # belongs_to :relationship
  has_many :logs
  has_one_attached :photo

  validates :title, :identity_goal, :trigger, :reward, :duration_in_minutes, :week_recurrence, :current_streak, :best_streak, :days, :start_times, presence: true
  validates :category, presence: true, inclusion: { in: ['Giving Back', 'Family', 'Friends', 'Partner', 'Creativity', 'Travel', 'Learning', 'Well-being', 'Spirituality', 'Pets'],
     message: "%{value} is not a valid category" }
end
