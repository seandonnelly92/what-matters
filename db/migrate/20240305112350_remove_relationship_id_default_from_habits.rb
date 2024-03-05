class RemoveRelationshipIdDefaultFromHabits < ActiveRecord::Migration[7.1]
  def change
    change_column_null :habits, :relationship_id, true
  end
end
