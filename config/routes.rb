Rails.application.routes.draw do
  devise_for :users
  root to: "pages#home"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  resources :habits
  resources :relationships, only: %i[new create delete]

  resources :multistages, only: %i[new create] do
    collection do
      get 'step1_input'
      post 'step1_submit'
      get 'step1_output'
      get 'step2_input'
      post 'step2_submit'
      get 'step2_output'
      get 'step3_input'
      post 'step3_submit'
      get 'step3_output'
    end
  end
end
