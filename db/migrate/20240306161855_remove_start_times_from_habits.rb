class RemoveStartTimesFromHabits < ActiveRecord::Migration[7.1]
  def change
    remove_column :habits, :start_times, :string
    add_column :habits, :start_time, :time
  end
end
