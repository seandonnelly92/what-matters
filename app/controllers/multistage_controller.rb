class MultistageController < ApplicationController
  def step1_input
    render partial: "multistage/life_in_years_input"
  end

  def step1_submit
    session[:user_data] ||= {}
    session[:user_data][:step1] = params[:step1_data]
    redirect_to step1_output_multistage_index_path
  end

  def step1_output
    render partial: "multistage/life_in_years_output"
  end

  def step2_input
    render partial: 'multistage/relationship_input'
  end

  def step2_submit
    session[:user_data][:step2] = params[:step2_data]
  end
end
