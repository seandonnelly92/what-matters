class AddContactDaysAndPerToRelationships < ActiveRecord::Migration[7.1]
  def change
    add_column :relationships, :contact_days, :integer
    add_column :relationships, :contact_days_per, :string
  end
end
