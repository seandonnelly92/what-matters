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

puts 'destroying all logs'
Log.destroy_all

puts 'destroying all Relationships'
Relationship.destroy_all

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

# relat_lion = Relationship.create!(
#   user_id: tin_man.id,
#   nickname: "Lion",
#   relation_to: "friend",
#   date_of_birth: DateTime.new(2002, 8, 25),
#   meet_date: DateTime.new(2012, 8, 25),
#   contact_days: 2,
#   contact_days_per: "week",
#   created_at: Time.current
# )

puts 'relationship (Tin Man to Lion) creates successfully.'


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
  ##changed to days_of_week to match changes to schema
  days_of_week: ["Monday", "Wednesday", "Friday"],
  start_time: "2024-03-06 17:15:00.000000000 +0000",
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
  ##changed to days_of_week to match changes to schema
  days_of_week: ["Saturday"],
  start_time: "2024-03-06 17:15:00.000000000 +0000",
)

puts 'Habits seeded successfully.'

puts 'seeding Logs...'

scare_crow_habit_past_dates = [
  "2024-01-29 06:00:00",
  "2024-01-31 06:00:00",
  "2024-02-02 06:00:00",
  "2024-02-05 06:00:00",
  "2024-02-07 06:00:00",
  "2024-02-09 06:00:00",
  "2024-02-12 06:00:00",
  "2024-02-14 06:00:00",
  "2024-02-16 06:00:00",
  "2024-02-19 06:00:00",
  "2024-02-21 06:00:00",
  "2024-02-23 06:00:00",
  "2024-02-26 06:00:00",
  "2024-02-28 06:00:00",
  "2024-03-01 06:00:00",
  "2024-03-04 06:00:00",
  "2024-03-06 06:00:00",
  "2024-03-08 06:00:00",
]

scare_crow_habit_future_dates = [

"2024-03-11 06:00:00",
  "2024-03-13 06:00:00",
  "2024-03-15 06:00:00",
  "2024-03-18 06:00:00",
  "2024-03-20 06:00:00",
  "2024-03-22 06:00:00",
  "2024-03-25 06:00:00",
  "2024-03-27 06:00:00",
  "2024-03-29 06:00:00",
  "2024-04-01 06:00:00",
  "2024-04-03 06:00:00",
  "2024-04-05 06:00:00",
]


scare_crow_habit_past_dates.each do |datetime|
  Log.create!(
    habit_id: scare_crow_habit.id,
    date_time: datetime,
    ## change the value below if we want to create more "falses" to show is a user hasn'e managed to complete a habit
    completed: rand <= 0.8,
    # completed: true,
    created_at: datetime,
    updated_at: datetime
  )
end

scare_crow_habit_future_dates.each do |datetime|
  Log.create!(
    habit_id: scare_crow_habit.id,
    date_time: datetime,
    ## change the value below if we want to create more "falses" to show is a user hasn'e managed to complete a habit
    # completed: random_number <= 0.9, temporarily set to "true, will change later"
    completed: false,
    created_at: datetime,
    updated_at: datetime
  )
end


tin_man_habit_dates = [
  "2023-12-20 11:00:00",
  "2024-01-06 11:00:00",
  "2024-01-13 11:00:00",
  "2024-01-20 11:00:00",
  "2024-01-27 11:00:00",
  "2024-02-03 11:00:00",
  "2024-02-10 11:00:00",
  "2024-02-17 11:00:00",
  "2024-02-24 11:00:00",
  "2024-03-02 11:00:00"
]

tin_man_habit_dates.each do |datetime|
  Log.create!(
    habit_id: tin_man_habit.id,
    date_time: datetime,
    ## change the value below if we want to create more "falses" to show is a user hasn'e managed to complete a habit
    completed: rand <= 0.8,
    created_at: datetime,
    updated_at: datetime
  )
end


puts "Logs seeded successfully."
