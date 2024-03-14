class RegistrationsController < Devise::RegistrationsController

  protected

  # WHEN A USER SIGNS IN, THEY ARE REDIRECTED TO TRACKER
  def after_sign_up_path_for(resource)
    new_habit_path
  end

  # WHEN A USER SIGNS IN, THEY ARE REDIRECTED TO TRACKER
  def after_sign_in_path_for(resource)
    habits_tracker_path
  end

end
