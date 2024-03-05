class MultistageController < ApplicationController
  def step1_input
  end

  def step1_submit
    session[:user_data] ||= {}
    session[:user_data][:step1] = params[:step1_data]
    redirect_to step1_output_multistage_index_path
  end

  def step1_output
  end

  def step2_input
  end

  def step2_submit
    session[:user_data][:step2] = params[:step2_data]
    redirect_to step2_output_multistage_index_path
  end

  def step2_output
    @relation_data = session[:user_data][:step2]
  end
end
