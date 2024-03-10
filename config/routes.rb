Rails.application.routes.draw do
  devise_for :users
  root to: "pages#home"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  get '/application/fetch_user_name', to: 'application#fetch_user_name', as: :fetch_user_name

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
  get 'habits/tracker', to: 'habits#tracker'
  resources :habits

  resources :logs, only: [:update]

  resources :relationships, only: %i[new create delete]

  resources :multistages, only: %i[new create] do
    collection do
      get 'step1_input'
      post 'step1_submit'
      get 'step2_input'
      post 'step2_submit'
      get 'step2_output'
      get 'step3_input'
      post 'step3_submit'
      get 'step3_output'
      get 'fetch_session_data', as: :fetch_session_data
      post 'add_session_data', as: :add_session_data
    end
  end
end
