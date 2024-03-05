class CreateRelationships < ActiveRecord::Migration[7.1]
  def change
    create_table :relationships do |t|
      t.references :user, null: false, foreign_key: true
      t.string :nickname
      t.string :relation_to
      t.datetime :date_of_birth
      t.datetime :meet_date
      t.integer :contact_minutes_per_week

      t.timestamps
    end
  end
end
