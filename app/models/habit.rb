class Habit < ApplicationRecord
  belongs_to :user
  belongs_to :relationship
  has_many :logs
end
