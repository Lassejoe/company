$:.unshift File.expand_path("../", __FILE__)
require 'rubygems'
require 'sinatra'
require './server'
use Rack::MethodOverride
run Sinatra::Application
