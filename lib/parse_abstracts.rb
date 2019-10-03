require 'csv'
require 'yaml'

class ParseAbstracts
  def self.call(abstracts, diviners, target)
    new(abstracts, diviners, target).call
  end

  def initialize(abstracts, diviners, target)
    @search_strings = []
    @events = serialize_events(CSV.read(abstracts, headers: true))
    @diviners = serialize_diviners(CSV.read(diviners, headers: true))
    @target = target
  end

  def call

    write_full_lineup
    log_output
    nil
  end

  private
  attr_reader :events, :diviners, :target

  def write_full_lineup
    File.open(target, 'w+') do |f|
      f.write(lineup.to_yaml)
    end
  end

  def lineup
    events + diviners
  end

  def log_output
    print "Writing to #{target}\n"
    events.group_by { |e| e['type'] }.each do |type, events|
      print "#{events.count} #{type.downcase} events\n"
    end
    print "#{diviners.count} diviners\n"
  end

  def serialize_events(abstracts)
    events = abstracts.map do |event|
      search_string = ensure_unique_identifier(event['Name'], event['Type'])

      {
        'name' => event['Name'].split.each(&:capitalize).join(' '),
        'searchString' => search_string,
        'title' => event['Title'],
        'type' => event['Type'],
        'keynote' => (event['Keynote'] == 'TRUE' ? 1 : 0),
        'avatarPath' => event['Avatar'],
        'description' => event['Abstract'],
        'bio' => event['Bio'],
        'duration' => calculate_duration(event)
      }
    end

    events.sort_by { |e| e['keynote'] }.reverse
  end

  def serialize_diviners(input)
    input.map do |diviner|
      search_string = ensure_unique_identifier(diviner['Name'], 'divination')

      {
        'name' => diviner['Name'].split.each(&:capitalize).join(' '),
        'searchString' => search_string,
        'type' => 'Divination',
        'divinationOffered' => diviner['Types'],
        'avatarPath' => diviner['Avatar'],
        'availableOn' => diviner['Dates'],
        'bio' => diviner['Bio'],
      }
    end
  end

  def ensure_unique_identifier(name, secondary_identifier)
    id = name.downcase.split.join('-')
    backup_id = "#{id}-#{secondary_identifier.downcase}"

    @search_strings << (@search_strings.include?(id) ? backup_id : id)
    @search_strings.last
  end

  def calculate_duration(event)
    event.fetch('Duration') do
      event['Keynote'] == 'TRUE' ? 60 : 30
    end
  end
end

abstracts = ENV.fetch('ABSTRACTS')
diviners = ENV.fetch('DIVINERS')
year = ENV.fetch('YEAR')
target = "./_data/events-#{year}.yml"

print "Calling this parser is destructive!\n\n"
print "If you continue, you will overwrite file '#{target}'\n\n"
print "Are you sure you want to proceed? (y/n)"

response = gets.chomp.strip == 'y' ? true : false
ParseAbstracts.call(abstracts, diviners, target) if response == true
