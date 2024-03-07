class HabitsController < ApplicationController
  skip_before_action :authenticate_user!
  # Remove this skip later

  def index
    @habits = Habit.all
  end

  def new
    @habit = Habit.new
    @categories = [
      "Parents",
      "Children",
      "Relationship",
      "Family",
      "Friends",
      "Giving Back",
      "Creativity",
      "Travel",
      "Learning",
      "Wellbeing",
      "Sprituality",
      "Pets"]
  end

  def create
    @habit = Habit.new(habit_params)
    if @habit.save
      redirect_to habit_path(@habit)
    else
      render :new, status: :unprocessable_entity
      # Not sure what to do here. Reload page but keep values?
    end
  end

  def tracker
    @scare_crow = User.find_by(first_name: "Scare")
    @scare_crow_habits = Habit.where(user_id: 1)

    # @scare_crow_logs = Habit.Log.all
    # @scare_crow_habit.logs
  end

  def show
    puts "connected"
  end

  private

  def habit_params
    params.require(:habit).permit(:title, :category, :identity_goal, :trigger,
    :reward, :duration_in_minutes, :week_recurrence, :days, :start_times, :photo)
  end
end
