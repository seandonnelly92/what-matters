class RegistrationsController < Devise::RegistrationsController
  protected

  # WHEN A USER SIGNS UP, THEY ARE REDIRECTED TO TRACKER
  def after_sign_up_path_for(resource)
    new_habit_path
  end
end
