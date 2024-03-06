class HabitsController < ApplicationController

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

  private

  def habit_params
    params.require(:habit).permit(:title, :category, :identity_goal, :trigger, :reward, :duration_in_minutes, :week_recurrence, :days, :start_times)
  end
end
