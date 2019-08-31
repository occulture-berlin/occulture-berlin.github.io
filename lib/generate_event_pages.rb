require 'yaml'
require 'fileutils'

class GenerateEventPages
  TEMPLATE_PATH = 'templates/event_page.haml'

  def self.call(input, target_dir)
    new(input, target_dir).call
  end

  def initialize(input, target_dir)
    @events = YAML.load(File.read(input))
    @target_dir = target_dir
    @template = File.read(TEMPLATE_PATH)
  end

  def call
    # first empty target_dir
    FileUtils.rm_rf(target_dir)
    FileUtils.mkdir(target_dir)

    # build a template page for each confirmed speaker
    events.each do |event|
      build_page(event)
    end

    nil
  end

  private
  attr_reader :events, :target_dir, :template

  def build_page(event)
    filename = "#{target_dir}/#{event['searchString']}.haml"

    File.open(filename, 'w') do |f|
      event_page = template.
        gsub('__name', event['name']).
        gsub('__searchString', event['searchString']).
        gsub('__title', event['title']).
        gsub('__avatarPath', event['avatarPath'])

      f.write(event_page)
    end
  end
end

year = ENV.fetch('YEAR')
input = "./_data/events-#{year}.yml"
target_dir = "./#{year}/lineup"

print "Calling this generator is destructive!\n\n"
print "If you continue, you will overwrite speaker pages for #{year}\n\n"
print "Are you sure you want to proceed? (y/n)"

response = gets.chomp.strip == 'y' ? true : false
GenerateEventPages.call(input, target_dir) if response == true
