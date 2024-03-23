class LogsController < ApplicationController
  def update
    log = Log.find(params[:id])
    log.completed = !log.completed
    log.save
    head 200
  end

  private

  def log_params
    params.require(:log).permit(:completed)
  end
end
