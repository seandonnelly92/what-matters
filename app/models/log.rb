class Log < ApplicationRecord
  belongs_to :habit

  validates :date_time, presence: true
  validates :completed, inclusion: [true, false]

  def format_message
    completed ? "Well done! You completed on  #{date_time.strftime("%Y-%m-%d %H:%M")}" : "Not completed. Remember your trigger for this habit: #{habit.trigger}!"
  end
end
