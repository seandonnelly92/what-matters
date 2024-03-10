class Encouragement < ApplicationRecord
  validates :encouragement, presence: true
  validates :encouragement, uniqueness: true
end
