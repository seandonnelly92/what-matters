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

puts 'destroying all Reviews'
Review.destroy_all

puts 'destroying all Users...'
User.destroy_all

puts 'destroying all Encouragements...'
Encouragement.destroy_all

puts 'seeding Users...'
scare_crow = User.create!(
  email: "scareyC@example.com",
  password: "password",
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

puts 'seeding Encouragements...'

encouragements = [
  "Well done! You're on the right track.",
  "Impressive! Keep at it and stay focused on What Matters.",
  "Fantastic progress! Every step counts.",
  "Keep going! Your dedication is inspiring.",
  "Great job today! Remember, consistency is key.",
  "You're making waves! What Matters is becoming a habit.",
  "Another step closer to your goals. Well done!",
  "Bravo! Your efforts are paying off.",
  "Excellence is not an act, but a habit. You're proving it!",
  "Yes! You're showing What Matters, matters to you.",
  "Amazing work! Let's keep the momentum going.",
  "You've got this! Every effort brings you closer to success.",
  "Outstanding commitment! You're an inspiration.",
  "Progress is progress, no matter how small. Great job!",
  "Celebrate every victory, big or small. You're doing great!",
  "Your focus on What Matters is truly commendable.",
  "Remarkable! Your dedication shines through.",
  "Keep pushing the boundaries. You're achieving greatness.",
  "You're not just dreaming, you're doing. That's powerful.",
  "Seeing your progress is a joy. Stay focused on What Matters.",
  "Your resilience is inspiring. Keep moving forward!",
  "Every day is a new chance to excel. You're doing wonderfully!",
  "Spectacular effort! You're making real progress.",
  "Your focus and dedication are making a difference.",
  "Making waves! Your progress is impressive.",
  "Remember, small steps lead to big changes. Great work!",
  "Your journey is uniquely yours, and you're navigating it beautifully.",
  "A+ effort! You're crushing your goals.",
  "You're a force to be reckoned with! Keep it up.",
  "Your commitment to What Matters is admirable.",
  "You're doing more than just trying; you're succeeding!",
  "What Matters to you, matters to us. Excellent progress!",
  "Shine on! Your dedication lights up your path to success.",
  "Each day, you're one step closer to your dreams. Amazing job!",
  "Your actions today are shaping a brighter tomorrow. Well done!",
  "You've got the power to change your life. And you're doing it!",
  "The path to success is made by walking. You're on your way!",
  "Incredible work! You're turning goals into achievements.",
  "You're not just following the path, you're creating it.",
  "Champion effort! You're leading by example.",
  "You're a beacon of motivation. Your progress is remarkable!",
  "Persistence pays off, and you're living proof. Keep going!",
  "Every achievement starts with the decision to try. Kudos to you!",
  "You're making history, one day at a time. Proud of you!",
  "You're a powerhouse of potential. Unleash it!",
  "Dedication is your superpower. You're unstoppable!",
  "Your passion and perseverance are paying off. Amazing!",
  "Every effort you put in brings you closer to your goal. Superb!",
  "Consistently impressive! What Matters is lucky to have you.",
  "You're making valuable strides. Excellent work!",
  "Your drive and ambition are second to none. Keep soaring!",
  "Making progress every day. You're a true inspiration!",
  "You're not just dreaming big—you're making big happen!",
  "Success is a journey, and you're traveling it like a star.",
  "Turning challenges into opportunities. You're amazing!",
  "Your hard work is writing a story of success. Keep the chapters coming!",
  "Believe in yourself as much as we believe in you. Outstanding!",
  "Each day's effort adds up to big achievements. Marvelous!",
  "Your dedication to What Matters shines bright.",
  "Creating a masterpiece, one day at a time. You're an artist!",
  "Leadership is action, not position. You're leading beautifully.",
  "Your progress is a beacon of hope and inspiration.",
  "Transformation isn't easy, but you're making it look that way!",
  "Your path to success is being paved by your daily efforts.",
  "Excellence is within you, and you're showing it every day.",
  "Your daily commitment to What Matters is nothing short of heroic.",
  "Keep breaking barriers. Your potential is limitless!",
  "Your journey is a powerful story of perseverance and dedication.",
  "You're not only chasing dreams—you're catching them!",
  "Every step forward is a victory. Celebrate them all!",
  "Your efforts today are the seeds for tomorrow's success.",
  "Rising to the challenge with grace and strength. Admirable!",
  "You're crafting a legacy of determination and success.",
  "Embrace your journey with pride. You're doing great!",
  "You're the architect of your future. Design it beautifully.",
  "Your dedication is the engine of your success. Full steam ahead!",
  "Progress, not perfection, is the goal. And you're achieving it!",
  "Your strength lies in your resolve. Keep pushing forward.",
  "Turning goals into achievements one step at a time. Keep it up!",
  "Your journey inspires everyone lucky enough to witness it.",
  "You're not just working hard; you're working smart. Brilliant!",
  "Success is no accident, and you're proving it every day.",
  "Your dedication to What Matters is making waves.",
  "Chase your dreams with vigor. You're on the right path!",
  "You're building a bridge to your goals with every action.",
  "Your progress is a testament to your unwavering commitment.",
  "Be proud of every step you take toward reaching your goals."
]

encouragements.each { |e| Encouragement.create(encouragement: e) }

puts "Encouragements seeded successfully"

# Adding Jasper as user
jasper = User.new(
  email: "jasper@lewagon.com",
  password: "password",
  first_name: "Jasper",
  last_name: "Warmenhoven",
  nickname: "Jap",
  date_of_birth: DateTime.new(1995, 10, 18),
  work_days_per_week: 5,
  work_hours_per_day: 10,
  sleep_hours_per_day: 7,
  terms_agreed: true
)
jasper.save

# Push ups habbit
pushups = Habit.create(
  user: jasper,
  title: "Morning push-ups",
  category: "Wellbeing",
  identity_goal: "a productive morning person",
  trigger: "before shower",
  reward: "a coffee",
  duration_in_minutes: 10,
  week_recurrence: 1,
  current_streak: 0,
  best_streak: 0,
  days_of_week: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  start_time: "2024-03-06 07:30:00.000000000 +0000"
)

pushup_past_dates = [
  '2024-02-01',
  '2024-02-02',
  '2024-02-05',
  '2024-02-06',
  '2024-02-07',
  '2024-02-08',
  '2024-02-09',
  '2024-02-12',
  '2024-02-13',
  '2024-02-14',
  '2024-02-15',
  '2024-02-16',
  '2024-02-19',
  '2024-02-20',
  '2024-02-21',
  '2024-02-22',
  '2024-02-23',
  '2024-02-26',
  '2024-02-27',
  '2024-02-28',
  '2024-02-29',
  '2024-03-01',
  '2024-03-04',
  '2024-03-05',
  '2024-03-06',
  '2024-03-07',
  '2024-03-08',
  '2024-03-11',
  '2024-03-12'

]

pushup_past_dates.each do |date|
  datetime = "#{date} 07:30:00"
  Log.create(
    habit: pushups,
    date_time: datetime,
    completed: rand <= 0.7
  )
end

pushup_future_dates = [
  '2024-03-13',
  '2024-03-14',
  '2024-03-15',
  '2024-03-18',
  '2024-03-19',
  '2024-03-20',
  '2024-03-21',
  '2024-03-22',
  '2024-03-25',
  '2024-03-26',
  '2024-03-27',
  '2024-03-28',
  '2024-03-29',
  '2024-04-01',
  '2024-04-02',
  '2024-04-03',
  '2024-04-04',
  '2024-04-05',
  '2024-04-08',
  '2024-04-09',
  '2024-04-10',
  '2024-04-11',
  '2024-04-12',
  '2024-04-15',
  '2024-04-16',
  '2024-04-17',
  '2024-04-18',
  '2024-04-19',
  '2024-04-22',
  '2024-04-23',
  '2024-04-24',
  '2024-04-25',
  '2024-04-26',
  '2024-04-29',
  '2024-04-30',
  '2024-05-01',
  '2024-05-02',
  '2024-05-03',
  '2024-05-06',
  '2024-05-07',
  '2024-05-08',
  '2024-05-09',
  '2024-05-10',
  '2024-05-13',
  '2024-05-14',
  '2024-05-15',
  '2024-05-16',
  '2024-05-17',
  '2024-05-20',
  '2024-05-21',
  '2024-05-22',
  '2024-05-23',
  '2024-05-24',
  '2024-05-27',
  '2024-05-28',
  '2024-05-29',
  '2024-05-30',
  '2024-05-31',
  '2024-06-03',
  '2024-06-04',
  '2024-06-05',
  '2024-06-06',
  '2024-06-07',
  '2024-06-10',
  '2024-06-11',
  '2024-06-12',
  '2024-06-13',
  '2024-06-14',
  '2024-06-17',
  '2024-06-18',
  '2024-06-19',
  '2024-06-20',
  '2024-06-21',
  '2024-06-24',
  '2024-06-25',
  '2024-06-26',
  '2024-06-27',
  '2024-06-28'
]

pushup_future_dates.each do |date|
  datetime = "#{date} 07:30:00"
  Log.create(
    habit: pushups,
    date_time: datetime,
    completed: false
  )
end

# Planning habbit
planning = Habit.create(
  user: jasper,
  title: "Weekly planning",
  category: "Learning",
  identity_goal: "more organised",
  trigger: "before lunch",
  reward: "watch Netflix over lunch",
  duration_in_minutes: 30,
  week_recurrence: 1,
  current_streak: 0,
  best_streak: 0,
  days_of_week: ["saturday"],
  start_time: "2024-03-06 11:30:00.000000000 +0000"
)

planning_past_dates = [
  "2024-02-03",
  "2024-02-10",
  "2024-02-17",
  "2024-02-24",
  "2024-03-02",
  "2024-03-09"
]

planning_past_dates.each do |date|
  datetime = "#{date} 11:30:00"
  Log.create(
    habit: planning,
    date_time: datetime,
    completed: true
  )
end

planning_future_dates = [
  "2024-03-16",
  "2024-03-23",
  "2024-03-30",
  "2024-04-06",
  "2024-04-13",
  "2024-04-20",
  "2024-04-27",
  "2024-05-04",
  "2024-05-11",
  "2024-05-18",
  "2024-05-25",
  "2024-06-01",
  "2024-06-08",
  "2024-06-15",
  "2024-06-22",
  "2024-06-29",
]

planning_future_dates.each do |date|
  datetime = "#{date} 11:30:00"
  Log.create(
    habit: planning,
    date_time: datetime,
    completed: false
  )
end

# Family visit habbit
fam_visit = Habit.create(
  user: jasper,
  title: "Visit family back home",
  category: "Family",
  identity_goal: "a good son/brother",
  trigger: "",
  reward: "",
  duration_in_minutes: 60,
  week_recurrence: 4,
  current_streak: 0,
  best_streak: 0,
  days_of_week: ["sunday"],
  start_time: "2024-03-06 10:00:00.000000000 +0000"
)

fam_visit_past_dates = [
  "2023-12-31",
  "2024-01-28",
  "2024-02-25"
]

fam_visit_past_dates.each do |date|
  datetime = "#{date} 10:00:00"
  Log.create(
    habit: fam_visit,
    date_time: datetime,
    completed: rand <= 0.9
  )
end

fam_visit_future_dates = [
  "2024-03-24",
  "2024-04-21",
  "2024-05-19",
  "2024-06-16",
  "2024-07-14"
]

fam_visit_future_dates.each do |date|
  datetime = "#{date} 10:00:00"
  Log.create(
    habit: fam_visit,
    date_time: datetime,
    completed: false
  )
end

# Adding Sean as user
sean = User.new(
  email: "sean@lewagon.com",
  password: "password",
  first_name: "Sean",
  last_name: "Donelly",
  nickname: "S",
  date_of_birth: DateTime.new(1995, 1, 1),
  work_days_per_week: 5,
  work_hours_per_day: 10,
  sleep_hours_per_day: 7,
  terms_agreed: true
)
sean.save

# Adding Rowan as user
rowan = User.new(
  email: "rowan@lewagon.com",
  password: "password",
  first_name: "Rowan",
  last_name: "Heptinstall",
  nickname: "R",
  date_of_birth: DateTime.new(1995, 1, 1),
  work_days_per_week: 5,
  work_hours_per_day: 10,
  sleep_hours_per_day: 7,
  terms_agreed: true
)
rowan.save



## Pitch Seed (for Tom User)

# Adding Tom as user
tom = User.new(
  email: "tom@lewagon.com",
  password: "pass",
  first_name: "Tom",
  last_name: "Ellwood",
  nickname: "T",
  date_of_birth: DateTime.new(1991, 3, 19),
  work_days_per_week: 5,
  work_hours_per_day: 10,
  sleep_hours_per_day: 7,
  terms_agreed: true
)
tom.save



#tom reading habit

reading = Habit.create(
  user: tom,
  title: "Read 5 pages of a book every day",
  category: "Learning",
  identity_goal: "a book worm",
  trigger: "before bed",
  reward: "hot chocolate",
  duration_in_minutes: 60,
  week_recurrence: 1,
  current_streak: 0,
  best_streak: 0,
  days_of_week: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  start_time: "2024-01-01 21:00:00.000000000 +0000"
)

reading_past_dates = [
  '2024-02-23',
  '2024-02-22',
  '2024-02-21',
  '2024-02-20',
  '2024-02-19',
  '2024-02-16',
  '2024-02-15',
  '2024-02-14',
  '2024-02-13',
  '2024-02-12',
  '2024-02-09',
  '2024-02-08',
  '2024-02-07',
  '2024-02-06',
  '2024-02-05'
]

reading_past_dates.each do |date|
  datetime = "#{date} 21:00:00"
  Log.create(
    habit: reading,
    date_time: datetime,
    completed: rand <= 0.9
  )
end

reading_future_dates = [
    '2024-03-14',
    '2024-03-15',
    '2024-03-16',
    '2024-03-17',
    '2024-03-18',
    '2024-03-21',
    '2024-03-22',
    '2024-03-25',
    '2024-03-28',
    '2024-03-29',
    '2024-04-01',
    '2024-04-02',
    '2024-04-03',
    '2024-04-04',
    '2024-04-05',
    '2024-04-08',
    '2024-04-09',
    '2024-04-10',
    '2024-04-11',
    '2024-04-12',
    '2024-04-15',
    '2024-04-16',
    '2024-04-17',
    '2024-04-18',
    '2024-04-19',
    '2024-04-22',
    '2024-04-23',
    '2024-04-24',
    '2024-04-25',
    '2024-04-26',
    '2024-04-29',
    '2024-04-30',
    '2024-05-01',
    '2024-05-02',
    '2024-05-03',
    '2024-05-06',
    '2024-05-07',
    '2024-05-08',
    '2024-05-09',
    '2024-05-10',
    '2024-05-13',
    '2024-05-14',
    '2024-05-15',
    '2024-05-16',
    '2024-05-17',
    '2024-05-20',
    '2024-05-21',
    '2024-05-22',
    '2024-05-23',
    '2024-05-24',
    '2024-05-27',
    '2024-05-28',
    '2024-05-29',
    '2024-05-30',
    '2024-05-31',
    '2024-06-03',
    '2024-06-04',
    '2024-06-05',
    '2024-06-06',
    '2024-06-07',
    '2024-06-10',
    '2024-06-11',
    '2024-06-12',
    '2024-06-13',
    '2024-06-14',
    '2024-06-17',
    '2024-06-18',
    '2024-06-19',
    '2024-06-20',
    '2024-06-21',
    '2024-06-24',
    '2024-06-25',
    '2024-06-26',
    '2024-06-27',
    '2024-06-28'
]

reading_future_dates.each do |date|
  datetime = "#{date} 21:00:00"
  Log.create(
    habit: reading,
    date_time: datetime,
    completed: false
  )
end

#tom gym habit

gym = Habit.create(
  user: tom,
  title: "Go to the gym",
  category: "Wellbeing",
  identity_goal: "a healthy guy",
  trigger: "before work",
  reward: "fav podcast",
  duration_in_minutes: 45,
  week_recurrence: 1,
  current_streak: 0,
  best_streak: 0,
  days_of_week: ["monday", "wednesday", "friday"],
  start_time: "2024-01-01 08:00:00.000000000 +0000"
)

gym_past_dates = [
    '2024-01-01',
    '2024-01-02',
    '2024-01-08',
    '2024-01-09',
    '2024-01-15',
    '2024-01-16',
    '2024-01-22',
    '2024-01-23',
    '2024-01-29',
    '2024-01-30',
    '2024-02-05',
    '2024-02-06',
    '2024-02-12',
    '2024-02-13',
    '2024-02-19',
    '2024-02-20',
    '2024-02-26',
    '2024-02-27',
    '2024-03-04',
    '2024-03-05',
    '2024-03-11',
    '2024-03-12'
]


gym_past_dates.each do |date|
  datetime = "#{date} 08:00:00"
  Log.create(
    habit: gym,
    date_time: datetime,
    completed: rand <= 0.9
  )
end

gym_today = [

]

gym_future_dates = [
  '2024-03-15',
  '2024-03-18',
  '2024-03-19',
  '2024-03-20',
  '2024-03-25',
  '2024-03-26',
  '2024-03-27',
  '2024-04-01',
  '2024-04-02',
  '2024-04-03',
  '2024-04-08',
  '2024-04-09',
  '2024-04-10',
  '2024-04-15',
  '2024-04-16',
  '2024-04-17',
  '2024-04-22',
  '2024-04-23',
  '2024-04-24',
  '2024-04-29',
  '2024-04-30',
  '2024-05-01',
  '2024-05-06',
  '2024-05-07',
  '2024-05-08',
  '2024-05-13',
  '2024-05-14',
  '2024-05-15',
  '2024-05-20',
  '2024-05-21',
  '2024-05-22',
  '2024-05-27',
  '2024-05-28',
  '2024-05-29',
  '2024-06-03',
  '2024-06-04',
  '2024-06-05',
  '2024-06-10',
  '2024-06-11',
  '2024-06-12',
  '2024-06-17',
  '2024-06-18',
  '2024-06-19',
  '2024-06-24',
  '2024-06-25',
  '2024-06-26',
]

gym_future_dates.each do |date|
  datetime = "#{date} 08:00:00"
  Log.create(
    habit: gym,
    date_time: datetime,
    completed: false
  )
end


#tom wife habbit
wife_date = Habit.create(
  user: tom,
  title: "Date night with wife",
  category: "Relationship",
  identity_goal: "a good husband",
  trigger: "both in office",
  reward: "dessert",
  duration_in_minutes: 120,
  week_recurrence: 2,
  current_streak: 0,
  best_streak: 0,
  days_of_week: ["wednesday"],
  start_time: "2024-01-04 18:00:00.000000000 +0000"
)
wife_date_past_dates = [
  '2024-01-17',
  '2024-01-31',
  '2024-02-14',
  '2024-02-28',
  '2024-03-13'
]


wife_date_past_dates.each do |date|
  datetime = "#{date} 18:00:00"
  Log.create(
    habit: wife_date,
    date_time: datetime,
    completed: rand <= 0.9
  )
end

wife_date_future_dates = [
  '2024-03-27',
  '2024-04-10',
  '2024-04-24',
  '2024-05-08',
  '2024-05-22',
  '2024-06-05',
  '2024-06-19'
]

wife_date_future_dates.each do |date|
  datetime = "#{date} 18:00:00"
  Log.create(
    habit: fam_visit,
    date_time: datetime,
    completed: false
  )
end

##seeding images

p "seeding images"

wife_image = File.open('app/assets/images/wife_habit_image.jpg')
wife_date = Habit.find_by(title: "Date night with wife")

wife_date.photo.attach(io: wife_image, filename: "wife_habit_image.jpg", content_type: "image/jpg")
wife_date.save

gym_image = File.open('app/assets/images/gym_habit_image.jpeg')
gym = Habit.find_by(title: "Go to the gym")

gym.photo.attach(io: gym_image, filename: "gym_habit_image.jpeg", content_type: "image/jpeg")
gym.save

reading_image = File.open('app/assets/images/reading_habit_image.jpeg')
reading = Habit.find_by(title: "Read 5 pages of a book every day")

reading.photo.attach(io: reading_image, filename: "reading_habit_image.jpeg", content_type: "image/jpeg")
reading.save

p "images seeded successfully"

# Adding reviews

p "seeding testimonials"

Review.create(
  user: sean,
  content: "What Matters has helped me dedicate quality time with my nephews! Thanks!",
  rating: 4,
  created_at: DateTime.new(2024, 3, 12),
  updated_at: DateTime.new(2024, 3, 12)
)

# Review.create(
#   user: tom,
#   content: "App does seem to have some glitches. Hoping this will be fixed soon @DWM team!",
#   rating: 2,
#   created_at: DateTime.new(2024, 1, 15),
#   updated_at: DateTime.new(2024, 1, 15)
# )

# Review.create(
#   user: tom,
#   content: "Thanks for the recent updates. Loving the app and how it has helped me follow through with what matters.",
#   rating: 5,
#   created_at: DateTime.new(2024, 2, 27),
#   updated_at: DateTime.new(2024, 2, 27)
# )

# Review.create(
#   user: rowan,
#   content: "I have become a grade 9 pianist since using What Matters!",
#   rating: 5,
#   created_at: DateTime.new(2024, 3, 5),
#   updated_at: DateTime.new(2024, 3, 5)
# )

Review.create(
  user: jasper,
  content: "This app has really helped me prioritise my free time. I'm healthier and happier!",
  rating: 5,
  created_at: DateTime.new(2024, 2, 11),
  updated_at: DateTime.new(2024, 2, 11)
)
