class MultistagesController < ApplicationController
  skip_before_action :authenticate_user!

  def step1_input
  end

  def step1_submit
    session[:user_data] ||= {}
    session[:user_data][:step1] = params[:step1_data]
    @date_of_birth = session[:user_data][:step1]['date_of_birth']
    @user = User.new
    @date_array = @date_of_birth.split("-")
    @date_array.map!(&:to_i)
    @user.date_of_birth = DateTime.new(@date_array[0], @date_array[1], @date_array[2])

    # @user.valid?(:step1_valid) <= CHECKS INDIVIDUAL VALIDATION FOR TESTING PURPOSES
    redirect_to step1_output_multistages_path
  end

  def step1_output
  end

  def step2_input
  end

  def step2_submit
    session[:user_data][:step2] = params[:step2_data]
    redirect_to step2_output_multistages_path
  end

  def step2_output
    @relation_data = session[:user_data]["step2"]
  end
end
