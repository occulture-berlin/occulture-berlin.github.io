require 'csv'
require 'date'

class GenerateUniverseAccessKeys
  def self.call(input, target_dir, cut_off)
    new(input, target_dir, cut_off).call
  end

  def initialize(input, target_dir, cut_off)
    @target_dir = target_dir
    @cut_off = cut_off
    @rejects = serialize_rejects(CSV.read(input, headers: true))
  end

  def call
    rejects.group_by{ |p| p['ticket_type'] }.each do |ticket_type, proposals|
      create_csv(ticket_type, proposals)
    end

    nil
  end

  private
  attr_reader :rejects, :target_dir, :cut_off

  def serialize_rejects(input)
    input.map do |proposal|
      next unless proposal['should reject'] == 'TRUE'

      {
        'key' => generate_key_name(proposal),
        'ticket_type' => determine_ticket_type(proposal)
      }
    end.compact
  end

  def create_csv(ticket_type, proposals)
    file_name = "#{target_dir}/#{ticket_type}_access_keys.csv"

    CSV.open(file_name, 'w+') do |csv|
      csv << ['Access Key','Total Available','Uses','Applies To','Is Active']
      proposals.each do |proposal|
        type = build_type(proposal)
        csv << [proposal['key'],1,1,type,true]
      end
    end

    print "Wrote #{proposals.count} access keys to #{file_name}\n"
  end

  def generate_key_name(proposal)
    proposal['Email Address'].chars.first(3).join + 'tckt' + Time.now.year.to_s
  end

  def determine_ticket_type(proposal)
    compare_time(proposal['Timestamp']) == true ? :early_bird : :normal
  end

  def compare_time(datestamp)
    Date.parse(cut_off) >= Date.parse(datestamp)
  end

  def build_type(proposal)
    base = 'rejected_proposal'
    proposal['ticket_type'] == :normal ? base : "early_bird_#{base}"
  end
end

input = ENV.fetch('REJECTED_PROPOSALS')
target_dir = Dir.home
early_bird_cut_off = "2019-08-30" # same format as google sheets

GenerateUniverseAccessKeys.call(input, target_dir, early_bird_cut_off)
