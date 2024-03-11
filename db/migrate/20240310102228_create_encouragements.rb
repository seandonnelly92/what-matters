class CreateEncouragements < ActiveRecord::Migration[7.1]
  def change
    create_table :encouragements do |t|
      t.string :encouragement, null: false

      t.timestamps
    end
  end
end
