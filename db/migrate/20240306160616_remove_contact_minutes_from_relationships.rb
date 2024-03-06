class RemoveContactMinutesFromRelationships < ActiveRecord::Migration[7.1]
  def change
    remove_column :relationships, :contact_minutes_per_week, :integer
  end
end
