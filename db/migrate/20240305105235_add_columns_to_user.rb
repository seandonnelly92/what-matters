class AddColumnsToUser < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :first_name, :string
    add_column :users, :last_name, :string
    add_column :users, :nickname, :string
    add_column :users, :date_of_birth, :datetime
    add_column :users, :work_days_per_week, :integer
    add_column :users, :work_hours_per_day, :integer
    add_column :users, :sleep_hours_per_day, :integer
    add_column :users, :terms_agreed, :boolean
  end
end
