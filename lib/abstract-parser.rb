require 'csv'
require 'yaml'

class AbstractParser
  def self.call(input, additional_input, target)
    new(input, additional_input, target).call
  end

  def initialize(input, additional_input, target)
    @input = CSV.read(input, headers: true)
    @additional_input = "" # CSV.read(additional_input, headers: false) #headers are super long
    @target = target
  end

  def call
    File.open(target, 'w+') { |f| f.write(serialized_events.to_yaml) }
    print "Wrote #{confirmed_events.count} events to #{target}\n"
    nil
  end

  private
  attr_reader :input, :additional_input, :target

  def serialized_events
    confirmed_events.map do |event|
      name = event['What should we call you?']
      finalized_information = additional_information_for(event['Email Address'])

      {
        'name' (finalized_information[:name] || name).split.each(&:capitalize).join(' '),
        'searchString' name.downcase.split.join('-'),
        'title' finalized_information.fetch(:title) { random_titles.sample },
        'type' event['What are you proposing?'],
        'avatarPath' finalized_information.fetch(:avatarUrl) { event['avatarUrl'] },
        'description' finalized_information.fetch(:abstract) { lorem_ipsum },
        'bio' finalized_information.fetch(:bio) { fake_bio(name) }
      }
    end
  end

  def confirmed_events
    @confirmed_events ||= input.select do |i|
      i['Dax'] == "TRUE" && i['Giorgia'] == "TRUE"
    end
  end

  def additional_information_for(email)
    {}
    # {
    #   name:
    #   title:
    #   avatarUrl:
    #   abstract:
    #   bio:
    # }
  end

  def random_titles
    [
      "Do OCCULT Better Than Barack Obama",
      "Why Everything You Know About OCCULT Is A Lie",
      "Ho To (Do) OCCULT Without Leaving Your Office",
      "Here Is What You Should Do For Your OCCULT",
      "Picture Your OCCULT On Top. Read This And Make It So",
      "OCCULT: The Samurai Way",
      "Get Rid of OCCULT For Good",
      "I Don't Want To Spend This Much Time On OCCULT. How About You?",
      "Top 3 Ways To Buy A Used OCCULT",
      "Who Else Wants To Be Successful With OCCULT",
      "The Ultimate Secret Of OCCULT",
      "The Secrets To Finding World Class Tools For Your OCCULT Quickly",
      "Beware The OCCULT Scam",
      "10 Things You Have In Common With OCCULT",
      "Cracking The OCCULT Code",
      "The Untold Secret To OCCULT In Less Than Ten Minutes",
      "World Class Tools Make OCCULT Push Button Easy",
      "A Guide To OCCULT At Any Age",
      "How To Improve At OCCULT In 60 Minutes",
      "Now You Can Buy An App That is Really Made For OCCULT",
      "If You Want To Be A Winner, Change Your OCCULT Philosophy Now!",
      "Warning: These 9 Mistakes Will Destroy Your OCCULT",
      "Where Is The Best OCCULT?",
      "Why Ignoring OCCULT Will Cost You Time and Sales",
      "Little Known Ways to OCCULT",
      "You Don't Have To Be A Big Corporation To Start OCCULT",
      "Can You Pass The OCCULT Test?",
      "OCCULT Smackdown!",
      "The OCCULT Mystery Revealed",
      "How To Turn Your OCCULT From Zero To Hero"
    ]
  end

  def lorem_ipsum
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
    ullamcorper dolor at lacus tincidunt laoreet. Donec consectetur, ante vitae
    cursus mattis, nisi enim egestas neque, vel posuere dui nisl vel arcu.
    Aliquam pulvinar tincidunt arcu ac imperdiet. Sed condimentum laoreet lorem,
    ac tincidunt erat mattis eu. In consequat rutrum nibh, sed iaculis mauris
    finibus et. Sed in leo vel leo porta porttitor ac sed nisl. Praesent aliquet
    nibh id lectus mattis, auctor placerat metus mattis. Nam vel nisl aliquet,
    sagittis mauris in, bibendum tortor. Ut eget leo id elit vulputate
    ullamcorper ut et leo. Etiam quis finibus odio, ut lobortis dui.

    Maecenas et maximus nunc, ornare hendrerit quam. Nulla vestibulum sagittis
    lectus eu bibendum. Quisque scelerisque dui sit amet elit rutrum, eget
    euismod mi suscipit. Phasellus sed turpis dolor. Curabitur placerat est
    mauris, at efficitur mi varius molestie. Donec tortor nunc, efficitur eu
    iaculis sed, commodo sit amet metus. Fusce hendrerit eu risus imperdiet
    convallis. Aenean porta dui in tortor bibendum, nec faucibus odio venenatis.
    Donec dapibus eros ut neque suscipit, eget convallis velit iaculis. Etiam
    bibendum tincidunt purus, eu venenatis urna blandit aliquet. Fusce sagittis
    tincidunt quam, ac elementum tellus hendrerit tincidunt. Aenean et dolor in
    lorem porttitor auctor."
  end

  def fake_bio(name)
    [
      "Award-winning coffee guru. Passionate social media expert. Avid travel nerd.",
      "Passionate pop culture evangelist. Total zombie geek. Beer trailblazer.",
      "Extreme twitter fanatic. Social media enthusiast. Award-winning travel junkie.",
      "Proud bacon maven. Writer. Zombie geek. Certified pop culture trailblazer.",
      "Organizer. Twitter practitioner. Certified analyst. Friendly beer specialist.",
      "Tv aficionado. Devoted thinker. Evil troublemaker. Certified communicator.",
      "Certified analyst. Introvert. Amateur zombie lover. Avid student.",
      "Lifelong travel ninja. Infuriatingly humble coffee fanatic.",
      "Hardcore creator. Bacon fanatic.  Infuriatingly humble writer. Coffee guru."
    ].sample.prepend("#{name} has dedicated themselves against all odds to being a ")
  end
end

input = ENV.fetch('ABSTRACTS')
additional_input = ENV.fetch('CONFIRMATION') { '' } # when i get this file can remove this
target = "./_data/2019/events.yml"

print "Calling this parser is destructive!\n\n"
print "If you continue, you will overwrite file '#{target}'\n\n"
print "Are you sure you want to proceed? (y/n)"

response = gets.chomp.strip == 'y' ? true : false
AbstractParser.call(input, additional_input, target) if response == true
