class Log < ApplicationRecord
  belongs_to :habit

  validates :date_time, :completed, presence: true
end
