class Log < ApplicationRecord
  belongs_to :habit

  validates :date_time, presence: true

  def format_message

    if date_time.to_date < Time.now.to_date
      completed ? "#{habit.title.capitalize} completed on ": "'#{habit.title.capitalize}' not completed for"
    elsif date_time.to_date == Time.now.to_date
      completed ? "Well done for completing your habit, '#{habit.title.capitalize}' today!": " Remember to '#{habit.title.capitalize}' today!' You set your trigger to be '#{habit.trigger}'"
    else date_time.to_date > Time.now.to_date
      if habit.duration_in_minutes.present?
        "#{habit.title.capitalize} for #{habit.duration_in_minutes} minutes on #{formatted_date}"
      else
        "#{habit.title.capitalize} on #{formatted_date}"
      end
    end

    "#{habit.title.capitalize}"
  end

  def format_date_message
    day = date_time.strftime("%d").to_i
    formatted_date = "#{day}#{ordinal_suffix(day)} #{date_time.strftime("%B")}"

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

    "Test date"

    "#{formatted_date}"
  end


end
