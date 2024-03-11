class HabitsController < ApplicationController
  def index
    @habits = Habit.where(user: current_user).order(created_at: :desc)
    if @habits.blank?
      redirect_to new_habit_path
    end
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
    @habit.start_time = Time.parse("#{params["habit"]["start_time(4i)"]}:#{params["habit"]["start_time(5i)"]}")
    if @habit.save
      redirect_to habits_path, notice: "Habit was successfully created!"

      Log.create!(
        habit_id: current_user.id,
        date_time: @habit.start_time,
        completed: false
      )


    else
      render :new, status: :unprocessable_entity, notice: "Failed"
      # Not sure what to do here. Reload page but keep values?
    end
  end

  def tracker
    # @scare_crow = User.find_by(first_name: "Scare")
    # @scare_crow_habits = Habit.where(user_id: @scare_crow.id)
    # @times_table_habit = @scare_crow_habits.find_by(title: "learn my times tables")

    @habits = current_user.habits

    # if @times_table_habit.present?
    #   # Find the most recent log associated with the times_table habit
    #   @latest_log = @times_table_habit.logs.order(id: :desc).first
    # else
    #   # Handle case when times_table habit is not found
    #   @latest_log = nil
    # end
  end




    # @scare_crow_logs = Habit.Log.all
    # @scare_crow_habit.logs


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
      days_of_week: [])
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
