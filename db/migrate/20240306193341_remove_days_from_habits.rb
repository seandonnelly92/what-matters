class RemoveDaysFromHabits < ActiveRecord::Migration[7.1]
  def change
    remove_column :habits, :days, :array
  end
end
