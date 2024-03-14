class RegistrationsController < Devise::RegistrationsController
<<<<<<< HEAD
  protected

  # WHEN A USER SIGNS UP, THEY ARE REDIRECT TO ADD A HABIT
  def after_sign_up_path_for(resource)
    new_habit_path
  end

  # WHEN A USER SIGNS IN, THEY ARE REDIRECTED TO TRACKER
  def after_sign_in_path_for(resource)
    '/habits'
  end
=======

  protected

  def after_sign_up_path_for(resource)
    new_habit_path
  end
>>>>>>> fa2b532ded049697e65e7e05fca84599c058e932
end
