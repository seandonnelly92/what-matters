class AddUniqueIndexToEncouragements < ActiveRecord::Migration[7.1]
  def change
    add_index :encouragements, :encouragement, unique: true
  end
end
