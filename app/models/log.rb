class Log < ApplicationRecord
  belongs_to :habit

  validates :date_time, presence: true
  validates :completed, inclusion: [true, false]

#buildingtoday_message
def today_message
  if date_time.to_date == Time.now.to_date
    "Today:"
  end
end

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
    completed ? "Well done! '#{habit.title.capitalize}' completed on  #{formatted_date}": "'#{habit.title.capitalize}' not completed for #{formatted_date}. Remember your trigger for this habit is '#{habit.trigger}!'"
  end

end
