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
    @habit.user = current_user
    if @habit.save
      redirect_to habits_path, notice: "Habit was successfully created!"
    else
      render :new, status: :unprocessable_entity, notice: "Failed"
      # Not sure what to do here. Reload page but keep values?
    end
  end

  def tracker
    @scare_crow = User.find_by(first_name: "Scare")
    @scare_crow_habits = Habit.where(user_id: @scare_crow.id)

    # @scare_crow_logs = Habit.Log.all
    # @scare_crow_habit.logs
  end

  def show
    puts "connected"
  end

  private

  def habit_params
    params.require(:habit).permit(:title,
      :category,
      :identity_goal,
      :trigger,
      :reward,
      :duration_in_minutes,
      :week_recurrence,
      :start_time,
      :photo,
      :days_of_week => [])
  end
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
