class EncouragementsController < ApplicationController
  def sample_encouragement
    render json: { encouragement: Encouragement.all.sample.encouragement }
  end
end
