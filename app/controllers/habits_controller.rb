class HabitsController < ApplicationController
  skip_before_action :authenticate_user!
  # Remove this skip later

  def new
    @habit = Habit.new
  end

  def create
    @habit = Habit.new(habit_params)
    if @habit.save
      redirect_to habit_path(@habit)
    else
      render 'lists/show', status: :unprocessable_entity
      # Not sure what to do here. Reload page but keep values?
    end
  end

  def tracker
    puts "connected to tracker"
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
    params.require(:habit).permit(:title, :category, :identity_goal, :trigger, :reward, :duration_in_minutes, :week_recurrence, :days, :start_times)
  end
end
