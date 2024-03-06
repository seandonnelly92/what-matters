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

  def step2_input
    @relationship = Relationship.new
  end

  def step2_submit
    custom_params = relationship_params

    custom_params[:date_of_birth] = make_date(custom_params[:date_of_birth]) unless custom_params[:date_of_birth].empty?
    custom_params[:meet_date] = years_to_date(custom_params[:meet_date].to_i) unless custom_params[:meet_date].empty?

    @relationship = Relationship.new(custom_params)

    respond_to do |format|
      if @relationship.save
        format.json { render json: { data: custom_params }, status: :created }
      else
        format.json { render json: { errors: @relationship.errors }, status: :unprocessable_entity }
      end
    end

    # @relationship_params[:date_of_birth] = make_date(@relationship_params[:date_of_birth])
    # @relationship_params[:meet_date] = make_date(@relationship_params[:meet_date])
    # Relationship.new(relationship_params)
    # redirect_to step2_output_multistages_path
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

  def years_to_date(years)
    meet_date = DateTime.current
    meet_date.change(year: (meet_date.year - years))
    meet_date
  end

  def relationship_params
    params.require(:relationship).permit(:nickname, :relation_to, :date_of_birth, :contact_days, :contact_days_per, :meet_date)
  end

  def user_params
    params.require(:user).permit(:date_of_birth)
  end
end
