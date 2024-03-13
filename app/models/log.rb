class Log < ApplicationRecord
  belongs_to :habit

  validates :date_time, presence: true

  def format_message
    "#{habit.title.capitalize}"
  end

  def format_date_message

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
  end

    day = date_time.strftime("%d").to_i
    formatted_date = "#{day}#{ordinal_suffix(day)} #{date_time.strftime("%B")}"

    if date_time.to_date < Time.now.to_date
      completed ? "completed on #{formatted_date} for #{habit.duration_in_minutes} minutes": "not completed on #{formatted_date} for #{habit.duration_in_minutes} minutes"
    elsif date_time.to_date == Time.now.to_date
      completed ? "completed today, well done!": " Remember to '#{habit.title.capitalize}' today!' You set your trigger to be '#{habit.trigger}'"
    else date_time.to_date > Time.now.to_date
      "on #{formatted_date} for #{habit.duration_in_minutes} minutes"
    end
end
