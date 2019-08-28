require 'csv'
require 'yaml'

class ParseAbstracts
  def self.call(input, target)
    new(input, target).call
  end

  def initialize(input, target)
    @serialized_events = serialize_events(CSV.read(input, headers: true))
    @target = target
  end

  def call
    File.open(target, 'w+') { |f| f.write(serialized_events.to_yaml) }
    print "Wrote #{serialized_events.count} events to #{target}\n"
    nil
  end

  private
  attr_reader :serialized_events, :target

  def serialize_events(input)
    input.map do |event|
      {
        'name' => event['Name'].split.each(&:capitalize).join(' '),
        'searchString' => event['Name'].downcase.split.join('-'),
        'title' => event['Title'],
        'type' => event['Type'],
        'avatarPath' => event['Avatar'],
        'description' => event['Abstract'],
        'bio' => event['Bio'],
        'duration' => 30
      }
    end
  end
end

input = ENV.fetch('ABSTRACTS')
target = "./_data/2019/events.yml"

print "Calling this parser is destructive!\n\n"
print "If you continue, you will overwrite file '#{target}'\n\n"
print "Are you sure you want to proceed? (y/n)"

response = gets.chomp.strip == 'y' ? true : false
ParseAbstracts.call(input, target) if response == true
