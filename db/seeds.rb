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

puts 'destroying all Habits'
Habit.destroy_all
puts 'destroying all Users...'
User.destroy_all


puts 'seeding Users...'
scare_crow = User.create!(
  email: "scareyC@example.com",
  encrypted_password: "password",
  reset_password_token: "[reset_password_token_1]",
  reset_password_sent_at: "[reset_password_sent_at_1]",
  remember_created_at: "[remember_created_at_1]",
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
    first_name: "Tin",
    last_name: "Man",
    nickname: "Heartless",
    date_of_birth: DateTime.new(1979, 5, 1),
    work_days_per_week: 6,
    work_hours_per_day: 10,
    sleep_hours_per_day: 5,
    terms_agreed: true
  )

puts "Users seeded successfully."

puts 'seeding Relationships...'

relat_lion = Relationship.create!(
  user_id: tin_man.id,
  nickname: "Lion",
  relation_to: "Friend",
  date_of_birth: DateTime.new(2002, 8, 25),
  meet_date: DateTime.new(2012, 8, 25),
  contact_minutes_per_week: 30,
  created_at: Time.current
)

# relat_dorothy = Relationship.create!(
#   user_id: scare_crow.id,
#   nickname: "Lion",
#   relation_to: "Friend",
#   date_of_birth: DateTime.new(2002, 8, 25),
#   meet_date: DateTime.new(2012, 8, 25),
#   contact_minutes_per_week: 30,
#   created_at: Time.current
# )

puts "relationship_1 created"


puts 'seeding Habits...'
scare_crow_habit = Habit.create!(
  user_id: scare_crow.id,
  # relationship_id: relationship_1.id,
  title: "learn my times tables",
  category: "Learning",
  identity_goal: "a mathematician",
  trigger: "before breakfast",
  reward: "a snack",
  duration_in_minutes: 15,
  week_recurrence: 3,
  current_streak: 0,
  best_streak: 0,
  days: ["Monday", "Wednesday", "Friday"],
  start_times: ["06:00", "06:00", "06:00"],
)

tin_man_habit = Habit.create!(
  user_id: tin_man.id,
  # relationship_id: null,
  title: "give my best friend a call",
  category: "Friends",
  identity_goal: "a better friend",
  trigger: "after I brush my teeth",
  reward: "watch a film",
  duration_in_minutes: 20,
  week_recurrence: 1,
  current_streak: 0,
  best_streak: 0,
  days: ["Saturday"],
  start_times: ["11:00"],
)

puts 'Habits seeded successfully.'
