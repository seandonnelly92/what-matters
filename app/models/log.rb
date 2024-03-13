class Log < ApplicationRecord
  belongs_to :habit

  validates :date_time, presence: true

  def format_message

    if date_time.to_date < Time.now.to_date
      completed ? "#{habit.title.capitalize}": "'#{habit.title.capitalize}"
    elsif date_time.to_date == Time.now.to_date
      completed ? "#{habit.title.capitalize}": " Remember to '#{habit.title.capitalize}' today!"
    else date_time.to_date > Time.now.to_date
    #   if habit.duration_in_minutes.present?
    #     "#{habit.title.capitalize} for #{habit.duration_in_minutes}"
    #   end
    #   "#{habit.title.capitalize}"
    # end

    "#{habit.title.capitalize}"
    end
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



    day = date_time.strftime("%d").to_i
    formatted_date = "#{day}#{ordinal_suffix(day)} #{date_time.strftime("%B")}"

    "on #{formatted_date} for #{habit.duration_in_minutes} minutes"
  end


end
