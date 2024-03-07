class MultistagesController < ApplicationController
  skip_before_action :authenticate_user!

  def step1_input
  end

  def step1_submit
    custom_params = step1_user_params
    unless custom_params[:date_of_birth].empty?
      date_of_birth = make_date(custom_params[:date_of_birth])
      custom_params[:date_of_birth] = date_of_birth
    end

    session[:user_data] ||= {}
    session[:user_data][:step1] = custom_params

    @user = User.new
    @user.date_of_birth = date_of_birth if date_of_birth

    respond_to do |format|
      if @user.valid?(:step1_valid)
        format.json { render json: { data: date_of_birth }, status: :created }
      else
        format.json { render json: { errors: @user.errors }, status: :unprocessable_entity }
      end
    end
  end

  def step2_input
  end

  def step2_submit
    custom_params = relationship_params

    custom_params[:date_of_birth] = make_date(custom_params[:date_of_birth]) unless custom_params[:date_of_birth].empty?
    custom_params[:meet_date] = years_to_date(custom_params[:meet_date].to_i) unless custom_params[:meet_date].empty?

    session[:user_data][:step2] = custom_params

    @relationship = Relationship.new(custom_params)

    respond_to do |format|
      if @relationship.valid?
        format.json { render json: { data: custom_params }, status: :created }
      else
        format.json { render json: { errors: @relationship.errors }, status: :unprocessable_entity }
      end
    end
  end

  def step2_output
  end

  def step3_input
  end

  def step3_submit
    session[:user_data][:step3] = step3_user_params

    @user = User.new(step3_user_params)

    respond_to do |format|
      if @user.valid?
        format.json { render json: { data: step3_user_params }, status: :created }
      else
        format.json { render json: { errors: @user.errors }, status: :unprocessable_entity }
      end
    end
  end

  def step3_output
    raise
  end

  def fetch_session_data
    session_data = session[:user_data] || {}

    respond_to do |format|
      format.json { render json: session_data }
    end
  end

  private

  def make_date(date)
    date_array = date.split("-")
    date_array.map!(&:to_i)
    DateTime.new(date_array[0], date_array[1], date_array[2])
  end

  def years_to_date(years)
    meet_date = DateTime.current
    meet_date.change(year: (meet_date.year - years)) # Returns the upated meet_date with changed year as new DateTime object
  end

  def relationship_params
    params.require(:relationship).permit(:nickname, :relation_to, :date_of_birth, :contact_days, :contact_days_per, :meet_date)
  end

  def step1_user_params
    params.require(:user).permit(:date_of_birth)
  end

  def step3_user_params
    params.require(:user).permit(:work_days_per_week, :work_hours_per_day, :sleep_hours_per_day)
  end
end
