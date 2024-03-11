class PagesController < ApplicationController
  before_action :authenticate_user!, except: [:home]

  def home
    @custom_column_class = "col-12" # Override default column class for the home page
  end

  def take_quiz
    redirect_to new_relationship
  end

  def user_profile
    @user = current_user
  end

  def profile_edit
    @user = User.find(params[:id])
    raise
  end
end
