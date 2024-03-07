class ChangeDaysOfWeekToArrayInHabits < ActiveRecord::Migration[7.1]
  def change
    change_column :habits, :days_of_week, :string, array: true, default: [], using: "(string_to_array(days_of_week, ','))"
  end
end
