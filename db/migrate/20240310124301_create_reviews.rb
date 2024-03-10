class CreateReviews < ActiveRecord::Migration[7.1]
  def change
    create_table :reviews do |t|
      t.text :content, null: false
      t.integer :rating, null: false

      t.timestamps
    end
  end
end
