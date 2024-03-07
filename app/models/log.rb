class Log < ApplicationRecord
  belongs_to :habit

  validates :date_time, presence: true
  validates :completed, inclusion: [true, false]
end
