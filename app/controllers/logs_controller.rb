class LogsController < ApplicationController
  respond_to do |format|
    format.json do
      render json: { message: log.format_message, date: log.format_date_message, habit: log.habit.title}
    end
  end
end

def update
  log = Log.find(params[:id])
  log.completed = !log.completed
  log.save
  habit = log.habit
  if log.completed
    log_index = habit.logs.find_index(log)
    prev_index = log_index - 1
    if prev_index >= 0
      if habit.logs[prev_index].completed
        habit.current_streak += 1
      else
        habit.current_streak = 1
      end
      habit.best_streak = habit.current_streak if habit.current_streak > habit.best_streak
      habit.save
    end
  end

  private

  def log_params
    params.require(:log).permit(:completed)
  end
end
