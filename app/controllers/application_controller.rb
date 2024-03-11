class ApplicationController < ActionController::Base
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: %i[email password first_name last_name date_of_birth work_days_per_week work_hours_per_day sleep_hours_per_day])

  def fetch_user_name
    render json: { user_name: current_user.first_name }
  end
end
