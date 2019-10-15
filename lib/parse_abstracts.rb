require 'csv'
require 'yaml'
require 'date'

class ParseAbstracts
  def self.call(abstracts, diviners, vendors, target)
    new(abstracts, diviners, vendors, target).call
  end

  def initialize(abstracts, diviners, vendors, target)
    @search_strings = []
    @events = serialize_events(CSV.read(abstracts, headers: true))
    @diviners = serialize_diviners(CSV.read(diviners, headers: true))
    @vendors = serialize_vendors(CSV.read(vendors, headers: true))
    @target = target
  end

  def call
    inject_placeholder_events
    inject_static_events
    calculate_running_order
    write_full_lineup
    log_output
    nil
  end

  private
  attr_reader :events, :diviners, :vendors, :target

  def inject_placeholder_events
    placeholder_events =  [
      {
        'date' => 'day_one',
        'duration' => 30,
        'keynote' => 0,
        'time' => '19:00',
        'title' => 'Doors Open',
        'universal' => true,
        'visible' => false
      },
      {
        'date' => 'day_one',
        'location' => 'workshop_room',
        'duration' => 90,
        'keynote' => 0,
        'time' => '19:30',
        'title' => 'Visual Performance & DJ Set (TBA)',
        'universal' => false,
        'visible' => false
      },
      {
        'date' => 'day_one',
        'location' => 'workshop_room',
        'duration' => 90,
        'keynote' => 0,
        'time' => '00:30',
        'type' => 'Performance',
        'title' => 'Jimmy Trash (DJ Set)',
        'universal' => false,
        'visible' => false
      },
      {
        'date' => 'day_two',
        'duration' => 60,
        'keynote' => 0,
        'time' => '10:30',
        'title' => 'Doors Open',
        'universal' => true,
        'visible' => false
      },
      {
        'date' => 'day_two',
        'location' => 'lecture_room',
        'duration' => 30,
        'keynote' => 0,
        'time' => '16:30',
        'title' => 'TBA',
        'universal' => false,
        'visible' => false
      },
      {
        'date' => 'day_two',
        'duration' => 60,
        'keynote' => 0,
        'time' => '19:00',
        'title' => 'Dinner Break',
        'universal' => true,
        'visible' => false
      },
      {
        'date' => 'day_two',
        'location' => 'workshop_room',
        'duration' => 60,
        'keynote' => 0,
        'time' => '20:00',
        'type' => 'Performance',
        'title' => 'Sam Waks (DJ Set)',
        'universal' => false,
        'visible' => false
      },
      {
        'date' => 'day_two',
        'location' => 'workshop_room',
        'duration' => 90,
        'keynote' => 0,
        'time' => '22:00',
        'type' => 'Performance',
        'title' => 'Gabriel Soma (DJ Set)',
        'universal' => false,
        'visible' => false
      },
      {
        'date' => 'day_two',
        'location' => 'workshop_room',
        'duration' => 90,
        'keynote' => 0,
        'time' => '23:30',
        'type' => 'Performance',
        'title' => 'Alma Omega (DJ Set)',
        'universal' => false,
        'visible' => false
      },
      {
        'date' => 'day_two',
        'location' => 'workshop_room',
        'duration' => 90,
        'keynote' => 0,
        'time' => '01:00',
        'type' => 'Performance',
        'title' => 'La Nuar (DJ Set)',
        'universal' => false,
        'visible' => false
      },
      {
        'date' => 'day_three',
        'duration' => 60,
        'keynote' => 0,
        'time' => '10:30',
        'title' => 'Doors Open',
        'universal' => true,
        'visible' => false
      },
      {
        'date' => 'day_three',
        'location' => 'lecture_room',
        'duration' => 30,
        'keynote' => 0,
        'time' => '15:30',
        'title' => 'TBA',
        'universal' => false,
        'visible' => false
      },
      {
        'date' => 'day_three',
        'duration' => 90,
        'keynote' => 0,
        'time' => '19:00',
        'title' => 'Dinner Break',
        'universal' => true,
        'visible' => false
      },
      {
        'date' => 'day_three',
        'location' => 'lecture_room',
        'duration' => 60,
        'keynote' => 0,
        'time' => '02:30',
        'type' => 'Performance',
        'title' => 'Warte Mal (DJ Set)',
        'universal' => false,
        'visible' => false
      },
      {
        'date' => 'day_three',
        'location' => 'lecture_room',
        'duration' => 90,
        'keynote' => 0,
        'time' => '03:30',
        'type' => 'Performance',
        'title' => 'Ulises (DJ Set)',
        'universal' => false,
        'visible' => false
      },
      {
        'date' => 'day_three',
        'location' => 'workshop_room',
        'duration' => 90,
        'keynote' => 0,
        'time' => '20:30',
        'type' => 'Performance',
        'title' => 'Tigre Contro Tigre',
        'universal' => false,
        'visible' => false
      },
      {
        'date' => 'day_three',
        'location' => 'workshop_room',
        'duration' => 60,
        'keynote' => 0,
        'time' => '22:00',
        'type' => 'Performance',
        'title' => 'ANTHONY ALVARADO',
        'universal' => false,
        'visible' => false
      },
      {
        'date' => 'day_three',
        'location' => 'workshop_room',
        'duration' => 90,
        'keynote' => 0,
        'time' => '23:00',
        'type' => 'Performance',
        'title' => 'ODYSSEUS',
        'universal' => false,
        'visible' => false
      },
      {
        'date' => 'day_four',
        'duration' => 60,
        'keynote' => 0,
        'time' => '11:00',
        'title' => 'Doors Open',
        'universal' => true,
        'visible' => false
      }
    ]

    placeholder_events.each { |e| events << e }
  end

  def inject_static_events
    %w[day_two day_three day_four].each do |day|
      universal_events.each do |e|
        e['date'] = day
        events << e
      end

      panel_discussions.each do |e|
        # no evening panel discussion on sunday
        next if e['time'].split(':').first.to_i > 17 and day == 'day_four'

        e['date'] = day
        events << e
      end
    end
  end

  def universal_events
    [
      {
        'duration' => 60,
        'keynote' => 0,
        'time' => '13:30',
        'title' => 'Lunch Break',
        'universal' => true,
        'visible' => false
      },
      {
        'duration' => 30,
        'keynote' => 0,
        'time' => '16:00',
        'title' => 'Coffee Break',
        'universal' => true,
        'visible' => false
      }
    ]
  end

  def panel_discussions
    [
      {
        'duration' => 30,
        'keynote' => 0,
        'time' => '13:00',
        'location' => 'lecture_room',
        'title' => 'Panel Discussion (TBA)',
        'universal' => false,
        'visible' => false
      },
      {
        'duration' => 60,
        'keynote' => 0,
        'time' => '18:00',
        'location' => 'lecture_room',
        'title' => 'Panel Discussion (TBA)',
        'universal' => false,
        'visible' => false
      }
    ]
  end

  def write_full_lineup
    File.open(target, 'w+') do |f|
      f.write(lineup.to_yaml)
    end
  end

  def lineup
    events + diviners + vendors
  end

  def log_output
    print "Writing to #{target}\n"
    events.group_by { |e| e['type'] }.each do |type, events|
      next if type.nil?
      print "#{events.count} #{type.downcase} events\n"
    end
    print "#{diviners.count} diviners\n"
    print "#{vendors.count} vendors\n"
  end

  def serialize_events(abstracts)
    events = abstracts.map do |event|
      search_string = ensure_unique_identifier(event['Name'], event['Type'])
      santized_search_string = sanitize(search_string)
      event_datetime = parse_start_time(event['Start Time'])

      {
        'avatarPath' => event['Avatar'],
        'bio' => event['Bio'],
        'date' => event_datetime['date'],
        'description' => event['Abstract'],
        'duration' => event['Duration'].to_i,
        'keynote' => (event['Keynote'] == 'TRUE' ? 1 : 0),
        'location' => determine_location(event),
        'name' => event['Name'].split.each(&:capitalize).join(' '),
        'searchString' => santized_search_string,
        'time' => event_datetime['time'],
        'title' => event['Title'],
        'type' => event['Type'],
        'universal' => false,
        'visible' => true
      }
    end

    events.sort_by { |e| e['keynote'] }.reverse
  end

  def serialize_diviners(input)
    input.map do |diviner|
      search_string = ensure_unique_identifier(diviner['Name'], 'divination')
      santized_search_string = sanitize(search_string)
      service_type = determine_service_type(santized_search_string)

      {
        'name' => diviner['Name'].split.each(&:capitalize).join(' '),
        'searchString' => santized_search_string,
        'type' => service_type,
        'servicesOffered' => diviner['Types'],
        'avatarPath' => diviner['Avatar'],
        'availableOn' => diviner['Dates'],
        'servicesString' => build_diviner_string(diviner),
        'bio' => diviner['Bio'],
        'universal' => false,
        'visible' => true
      }
    end
  end

  def serialize_vendors(input)
    input.map do |vendor|
      search_string = ensure_unique_identifier(vendor['Name'], 'vendor')
      santized_search_string = sanitize(search_string)

      {
        'name' => vendor['Name'].split.each(&:capitalize).join(' '),
        'searchString' => santized_search_string,
        'type' => 'Vendor',
        'avatarPath' => vendor['Avatar'],
        'shopUrl' => vendor['Shop url'],
        'bio' => vendor['Bio'],
        'universal' => false,
        'visible' => true
      }
    end
  end

  def determine_service_type(search_string)
    return 'Wellness' if search_string == 'nina-kim' # hack. don't overwrite her type
    'Divination'
  end

  def build_diviner_string(diviner)
    offerings = diviner['Types'].split(', ').join(' / ')
    availability = diviner['Dates'].split(', ').join(' and ')

    "Offering #{offerings} on #{availability}"
  end

  def ensure_unique_identifier(name, secondary_identifier)
    id = name.downcase.split.join('-')
    backup_id = "#{id}-#{secondary_identifier.downcase}"

    @search_strings << (@search_strings.include?(id) ? backup_id : id)
    @search_strings.last
  end

  def sanitize(str)
    str.gsub(/[äéèöüß]/) do |match|
      case match
      when "ä" then 'ae'
      when "é" then 'e'
      when "è" then 'e'
      when "ö" then 'oe'
      when "ü" then 'ue'
      when "ß" then 'ss'
      end
    end
  end

  def parse_start_time(timestamp)
    return {} if timestamp.nil?

    parsed = DateTime.parse(timestamp)
    {
      'date' => determine_date(parsed),
      'time' => parsed.strftime('%H:%M')
    }
  end

  def determine_date(datetime)
    case datetime.strftime('%m%d%H%M').to_i
    when 10311900..11010200 then 'day_one'
    when 11010800..11020200 then 'day_two'
    when 11020800..11030600 then 'day_three'
    when 11030800..11032200 then 'day_four'
    else
      raise ArgumentError, "DateTime seems to be out of range: #{datetime}"
    end
  end

  def calculate_running_order
    days = events.select { |e| !e['date'].nil? }.group_by { |e| e['date'] }
    days.each do |day, events|
      sorted = events.sort_by do |e|
        e['time'].split(':').join
      end

      rotate_by_time(sorted)
      write_running_order(sorted)
    end
  end

  def rotate_by_time(events)
    prima_nocte = events.first['time'].split(':').first.to_i

    return events if  prima_nocte > 8

    events.rotate!
    rotate_by_time(events)
  end

  def write_running_order(events)
    events.each_with_index do |event, i|
      event['runningOrder'] = i + 1
    end
  end

  def determine_location(event)
    return event['Location'] if event['Location']
    location_map[event['Type']]
  end

  def location_map
    {
      'Lecture' => 'lecture_room',
      'Workshop' => 'workshop_room',
      'Ritual' => 'workshop_room',
      'Performance' => 'lecture_room',
      'Film' => 'lecture_room',
    }
  end
end

abstracts = ENV.fetch('ABSTRACTS')
diviners = ENV.fetch('DIVINERS')
vendors = ENV.fetch('VENDORS')
year = ENV.fetch('YEAR')
target = "./_data/events-#{year}.yml"

print "Calling this parser is destructive!\n\n"
print "If you continue, you will overwrite file '#{target}'\n\n"
print "Are you sure you want to proceed? (y/n)"

response = gets.chomp.strip == 'y' ? true : false
ParseAbstracts.call(abstracts, diviners, vendors, target) if response == true
