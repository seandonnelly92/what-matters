class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [ :home ]

  def home
    @custom_column_class = "col-12" # Override default column class for the home page
  end
end
