# server.rb
require 'sinatra'
require "sinatra/namespace"
require 'mongoid'
require 'rack'
require 'rack/cors'
# DB Setup
Mongoid.load! "mongoid.yml"


use Rack::Cors do
  allow do
    origins '*'
    resource '*', :headers => :any, :methods => [:get, :post, :delete, :put, :options, :patch]
  end
end

#Data Models
class Company
  include Mongoid::Document

  #all the variables that a company can contain
  field :companyID, type: String
  field :companyName, type: String
  field :address, type: String
  field :city, type: String
  field :country, type: String
  field :owners, type: String
  field :email, type: String
  field :phoneNumber, type: String

  #validates makes sure that the user provide the correct information, the email and phoneNumber is optional
  validates :companyID, presence: true
  validates :companyName, presence: true
  validates :address, presence: true
  validates :city, presence: true
  validates :country, presence: true
  validates :owners, presence: true

  #assigning a "primary key" I decided to make the companyID unique
  index({ companyID: 'text'})
  index({ companyID: 1},{unique: true,drop_dups: true ,name: "companyID_index"})

  #sorting on the different fields
  scope :companyName, -> (companyName) { where(companyName: /^#{companyName}/i) }
  scope :companyID, -> (companyID) { where(companyID: /^#{companyID}/) }
  scope :city, -> (city) { where(city: /^#{city}/i) }
  scope :country, -> (country) { where(country: /^#{country}/i) }
  scope :owners, -> (owners) { where(owners: /^#{owners}/i)}
end


#Serializers
class CompanySerializer
  def initialize(company)
    @company = company
  end

  def as_json(*)
    data = {
      id:@company.id.to_s,
      companyID:@company.companyID,
      companyName:@company.companyName,
      address:@company.address,
      city:@company.city,
      country:@company.country,
      owners:@company.owners,
      email:@company.email,
      phoneNumber:@company.phoneNumber
    }
    data[:errors] = @company.errors if@company.errors.any?
    data
  end
end


#api namespace
namespace '/api/v1' do
  before do
    content_type 'application/json'
    headers 'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => ['GET', 'POST', 'DELETE', 'PATCH']
  end
  #set :protection, false

  #generates base_url and parse the request body
  helpers do
    def base_url
      @base_url ||= "#{request.env['rack.url_scheme']}://{request.env['HTTP_HOST']}"
      #found a bug in the @base_url which would return curl(52): Empty reply from server the "" fixed the problem.
      ""
    end
    def json_params
      begin
        JSON.parse(request.body.read)
      rescue
        halt 400,{message:'Invalid JSON'}.to_json
      end
    end
  end



  get '/companies/:companyID' do
    index = params['companyID']
    company = Company.where(companyID: index).first
    halt(404, {message:'The company you are searching for do not exist'}.to_json) unless company
    CompanySerializer.new(company).to_json
  end

  #returns all created companies
  get '/companies' do
  companies = Company.all
  [:companyName, :companyID, :city, :country, :owners].each do |filter|
    companies = companies.send(filter, params[filter]) if params[filter]
  end
  companies.map {|company| CompanySerializer.new(company)}.to_json
  end

  #create a new company
  post '/companies' do
    company = Company.new(json_params)
    if company.save
      response.headers['Location'] = "#{base_url}/api/v1/company/#{company.companyID}"
      status 201
    else
      status 422
      body CompanySerializer.new(company).to_json
    end
  end
  #updates the specific company and the client can update a specific field
  patch '/companies/:companyID' do |companyID|
    company = Company.where(companyID: companyID).first
    halt(404, {message:'The company you are searching for do not exist'}.to_json) unless company
    if company.update_attributes(json_params)
      CompanySerializer.new(company).to_json
    else
      status 422
      body CompanySerializer.new(company).to_json
    end
  end

  delete '/companies/:companyID' do
    response.headers['Location'] = "deleted"
    tempCompanyID = params['companyID']
    company = Company.where(companyID: tempCompanyID).first
    company.destroy
  end
end
#Endpoint
