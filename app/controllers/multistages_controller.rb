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
    @relationship = Relationship.new
  end

  def step2_submit
    @relationship_params = params[:step2_data]
    @relationship_params[:date_of_birth] = make_date(@relationship_params[:date_of_birth])
    @relationship_params[:meet_date] = make_date(@relationship_params[:meet_date])
    Relationship.new(relationship_params)
    raise
    redirect_to step2_output_multistages_path
  end

  def step2_output
    @relation_data = session[:user_data]["step2"]
  end

  def step3_input
  end

  def step3_submit
    session[:user_data] ||= {}
    session[:user_data][:step3] = step3_user_params
    raise
  end

  private

  def make_date(date)
    date_array = date.split("-")
    date_array.map!(&:to_i)
    DateTime.new(date_array[0], date_array[1], date_array[2])
  end

  def relationship_params
    params.require(:relationship).permit(:nickname, :relation_to, :date_of_birth, :meet_date, :contact_minutes_per_week)
  end

  def user_params
    params.require(:user).permit(:date_of_birth)
  end

  # MAY NEED TO ADD BELOW TO USER_PARAMS ABOVE
  def step3_user_params
    params.require(:user).permit(:work_days_per_week, :work_hours_per_day, :sleep_hours_per_day)
  end
end
