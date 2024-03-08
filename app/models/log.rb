class Log < ApplicationRecord
  belongs_to :habit

  validates :date_time, presence: true
  validates :completed, inclusion: [true, false]

# building TODAY MESSAGE
# def today_message
# today = Time.now
# test_date = Log.date_time
# "#{today} and then ##{test_date}"
# end
##

  def format_message
    day = date_time.strftime("%d").to_i

    def ordinal_suffix(day)
        if (11..13).include?(day % 100)
          "th"
        else
          case day % 10
          when 1
            "st"
          when 2
            "nd"
          when 3
            "rd"
          else
            "th"
          end
        end
      end

    formatted_date = "#{day}#{ordinal_suffix(day)} #{date_time.strftime("%B")}"
    # completed ? "Well done! You completed on  #{date_time.strftime("%Y-%m-%d %H:%M")}" : "Not completed. Remember your trigger for this habit: #{habit.trigger}!"
    completed ? "Well done! You completed on  #{formatted_date}": "Not completed. Remember your trigger for this habit: #{habit.trigger}!"
  end
end
