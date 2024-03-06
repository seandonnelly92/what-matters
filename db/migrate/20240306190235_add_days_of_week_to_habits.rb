class AddDaysOfWeekToHabits < ActiveRecord::Migration[7.1]
  def change
    add_column :habits, :days_of_week, :string
  end
end
