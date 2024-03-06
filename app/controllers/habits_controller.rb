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
    # Merging the standard habit params with the params that hold the correct start time.
    # habit_params_with_start_time = habit_params.merge(combine_start_time_params)

    @habit = Habit.new(habit_params)
    if @habit.save
      redirect_to habits_path, notice: "Habit was successfully created!"
    else
      render :new
      # render :new, status: :unprocessable_entity, notice: "Failed"
      # Not sure what to do here. Reload page but keep values?
    end
  end

  private

  def habit_params
    # FYI the start_time parameter(s) are permitted individually
    params.require(:habit).permit(:title, :week_recurrence, :identity_goal, :category, :trigger, :reward, :photo, days_of_week: [])
  end

#   def combine_start_time_params
#     # :habit is a hash. .Slice takes only the :start_time attribute from the hash.
#     # 1i, 2i etc are generated in Ruby for the different parts of the TIME value.
#     start_time_params = params[:habit].slice(:start_time)
#     # Create a variable called start_time which is TIME formatted as HH:MM
#     start_time = "#{start_time_params["start_time(4i)"]}:#{start_time_params["start_time(5i)"]}"
#     # Make the value of the start_time key as above
#     { start_time: start_time }
#   end
end
