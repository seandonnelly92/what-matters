class CreateHabits < ActiveRecord::Migration[7.1]
  def change
    create_table :habits do |t|
      t.references :user, null: false, foreign_key: true
      t.references :relationship, null: false, foreign_key: true
      t.string :title
      t.string :category
      t.string :identity_goal
      t.string :trigger
      t.string :reward
      t.integer :duration_in_minutes
      t.integer :week_recurrence
      t.integer :current_streak
      t.integer :best_streak

      t.timestamps
    end
  end
end
