class CreateLogs < ActiveRecord::Migration[7.1]
  def change
    create_table :logs do |t|
      t.references :habit, null: false, foreign_key: true
      t.datetime :date_time
      t.boolean :completed

      t.timestamps
    end
  end
end
