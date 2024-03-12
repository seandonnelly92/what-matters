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

      next_90_days = []
      current_day = DateTime.now

      90.times do
        current_day += 1
        next_90_days << current_day
      end

      habit_days = @habit.days_of_week.map(&:downcase)

      next_90_days.each do |day|
        next unless habit_days.include?(day.strftime("%A").downcase)

        # if Date.new(day) == Date.today &&

        log_hour = @habit.start_time.hour
        log_minute = @habit.start_time.min
        log_timestamp = day.change(hour: log_hour, min: log_minute)

        p 'creating log'
        Log.create!(
          habit_id: @habit.id,
          date_time: log_timestamp,
          completed: false
        )
      end

      redirect_to habits_path, notice: "Habit was successfully created!"
      # next_90_day_names = next_90_days.map {|day| day.strftime("%A").downcase}
    else
      render :new, status: :unprocessable_entity, notice: "Failed"
      # Not sure what to do here. Reload page but keep values?
    end
  end

  def edit
    @habit = Habit.find(params[:id])
  end

  def update
    @habit = Habit.find(params[:id])
    @habit.update(habit_params)
    redirect_to habits_path
  end

  def destroy
    @habit = Habit.find(params[:id])
    @habit.destroy
    redirect_to habits_path, status: :see_other
  end

  def tracker
    @habits = current_user.habits
    @logs = @habits.map { |h| h.logs.to_a }.flatten.sort_by { |l| l.date_time}
    @global_streak = global_streak
    raise
  end

  def show
    puts "connected"
  end

  private

  def global_streak
    totals = []
    @user_habits = current_user.habits
    if @user_habits.count > 1
      @user_habits.each do |habit|
        logs = habit.logs.order!(date_time: :asc)
        habit.current_streak = iterate_logs(logs)
        totals << habit.current_streak
      end
    else
      logs = @user_habits.last.logs.order!(date_time: :asc)
      @user_habits.last.current_streak = iterate_logs(logs)
      totals << @user_habits.last.current_streak
    end
    totals.include?(0) ? 0 : totals.sum
  end

  def iterate_logs(logs)
    increment = 0
    logs.each do |log|
      increment += 1 if log[:completed]
    end
    increment
  end

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
