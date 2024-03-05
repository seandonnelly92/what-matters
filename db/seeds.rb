# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

require 'date'

puts 'destroying all Users...'
User.destroy_all

puts 'seeding Users...'
User.new

scare_crow = User.create!(
  email: "scareyC@example.com",
  encrypted_password: "password",
  reset_password_token: "[reset_password_token_1]",
  reset_password_sent_at: "[reset_password_sent_at_1]",
  remember_created_at: "[remember_created_at_1]",
  created_at: DateTime.new(2024, 03, 5, 16, 30, 00),
  updated_at: DateTime.new(2024, 03, 5, 16, 30, 00),
  first_name: "Scare",
  last_name: "Crow",
  nickname: "Strawbrains",
  date_of_birth: DateTime.new(2002, 3, 15),
  work_days_per_week: 5,
  work_hours_per_day: 5,
  sleep_hours_per_day: 10,
  terms_agreed: true
)


tin_man = User.create!(
    email: "TinManz@example.com",
    encrypted_password: "password",
    reset_password_token: "[reset_password_token_2]",
    reset_password_sent_at: "[reset_password_sent_at_2]",
    remember_created_at: "[remember_created_at_2]",
    created_at: DateTime.new(2024, 03, 5, 16, 30, 00),
    updated_at: DateTime.new(2024, 03, 5, 16, 30, 00),
    first_name: "Tin",
    last_name: "Man",
    nickname: "Heartless",
    date_of_birth: DateTime.new(1979, 5, 1),
    work_days_per_week: 6,
    work_hours_per_day: 10,
    sleep_hours_per_day: 5,
    terms_agreed: true
  )


puts "Users seeded successfully"
