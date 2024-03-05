class AddColumnsToHabits < ActiveRecord::Migration[7.1]
  def change
    add_column :habits, :days, :string, array: true, default: []
    add_column :habits, :start_times, :time, array: true, default: []
  end
end
