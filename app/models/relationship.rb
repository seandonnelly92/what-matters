class Relationship < ApplicationRecord
  belongs_to :user, , optional: true
end
