class ApplicationController < ActionController::Base
  before_action :authenticate_user!

  def fetch_user_name
    render json: { user_name: current_user.first_name }
  end
end
