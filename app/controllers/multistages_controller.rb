class MultistagesController < ApplicationController
  skip_before_action :authenticate_user!

  def step1_input
  end

  def step1_submit
    date_of_birth = user_params[:date_of_birth] # Gets the date_of_birth as a string from the params
    session[:user_data] ||= {}
    session[:user_data][:step1] = user_params

    @user = User.new

    unless date_of_birth.empty?
      date_array = date_of_birth.split("-")
      date_array.map!(&:to_i)
      @user.date_of_birth = DateTime.new(date_array[0], date_array[1], date_array[2])
    end

    respond_to do |format|
      if @user.valid?(:step1_valid)
        format.json { render json: { data: date_of_birth }, status: :created }
      else
        format.json { render json: { errors: @user.errors }, status: :unprocessable_entity }
      end
    end
  end

  def step1_output
  end

  def step2_input
    raise
  end

  def step2_submit
    session[:user_data][:step2] = params[:step2_data]
    redirect_to step2_output_multistages_path
  end

  def step2_output
    @relation_data = session[:user_data]["step2"]
  end

  private

  def user_params
    params.require(:user).permit(:date_of_birth)
  end
end
