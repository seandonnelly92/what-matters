class Habit < ApplicationRecord
  belongs_to :user
  belongs_to :relationship
end
