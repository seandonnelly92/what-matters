class MultistagesController < ApplicationController
  skip_before_action :authenticate_user!

  def step1_input
  end

  def step1_submit
    session[:user_data] ||= {}
    session[:user_data][:step1] = params[:step1_data]
    @date_of_birth = session[:user_data][:step1]['date_of_birth']
    @user = User.new
    date_array = @date_of_birth.split("-")
    date_array.map!(&:to_i)
    @user.date_of_birth = DateTime.new(@date_array[0], @date_array[1], @date_array[2])

    # @user.valid?(:step1_valid) <= CHECKS INDIVIDUAL VALIDATION FOR TESTING PURPOSES
    redirect_to step1_output_multistages_path
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

  private

  def make_date(date)
    date_array = date.split("-")
    date_array.map!(&:to_i)
    DateTime.new(date_array[0], date_array[1], date_array[2])
  end

  def relationship_params
    params.require(:relationship).permit(:nickname, :relation_to, :date_of_birth, :meet_date, :contact_minutes_per_week)
  end
end
