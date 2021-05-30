require "sinatra"
require "pry"

set :public_folder, "public"

get "/" do
  erb :index
end

get "*" do
  "What was THAT?"
end
