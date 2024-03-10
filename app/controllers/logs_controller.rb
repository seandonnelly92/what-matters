class LogsController < ApplicationController
  def update
    log = Log.find(params[:id])
    log.completed = !log.completed
    log.save

    respond_to do |format|
      format.json do
        render json: { message: log.format_message, habit: log.habit.title }
      end
    end
  end

  private

  def log_params
    params.require(:log).permit(:completed)
  end
end
