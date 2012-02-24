spec_location = "spec/javascripts/%s.spec"

guard 'jasmine-headless-webkit' do
  watch(%r{^public/javascripts/(.*)\.js$}) { |m| newest_js_file(spec_location % m[1]) }
  watch(%r{^spec/javascripts/helpers*})
  watch(%r{^spec/javascripts/(.*)\.spec\..*}) { |m| newest_js_file(spec_location % m[1]) }
end