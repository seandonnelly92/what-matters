# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_03_05_112517) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "habits", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "relationship_id"
    t.string "title"
    t.string "category"
    t.string "identity_goal"
    t.string "trigger"
    t.string "reward"
    t.integer "duration_in_minutes"
    t.integer "week_recurrence"
    t.integer "current_streak"
    t.integer "best_streak"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "days", default: [], array: true
    t.time "start_times", default: [], array: true
    t.index ["relationship_id"], name: "index_habits_on_relationship_id"
    t.index ["user_id"], name: "index_habits_on_user_id"
  end

  create_table "logs", force: :cascade do |t|
    t.bigint "habit_id", null: false
    t.datetime "date_time"
    t.boolean "completed"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["habit_id"], name: "index_logs_on_habit_id"
  end

  create_table "relationships", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "nickname"
    t.string "relation_to"
    t.datetime "date_of_birth"
    t.datetime "meet_date"
    t.integer "contact_minutes_per_week"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_relationships_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "first_name"
    t.string "last_name"
    t.string "nickname"
    t.datetime "date_of_birth"
    t.integer "work_days_per_week"
    t.integer "work_hours_per_day"
    t.integer "sleep_hours_per_day"
    t.boolean "terms_agreed"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "habits", "relationships"
  add_foreign_key "habits", "users"
  add_foreign_key "logs", "habits"
  add_foreign_key "relationships", "users"
end
