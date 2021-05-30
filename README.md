# 45s

# Prereqs

 * Ruby / Bundler [(install)](https://www.ruby-lang.org/en/documentation/installation/)
 
# Quickstart
 ```
bundle install
shotgun --port=1234 server.rb
 ```

Then visit  
```
http://localhost:1234/
```  
and you're up and running!

Please note that `shotgun` helps with application-wide reloading of all source files and templates on each request. You can read more about shotgun [here](https://github.com/rtomayko/shotgun). Shotgun may not work on Windows machines because *[there be POSIX-eating dragons over there](https://en.wikipedia.org/wiki/Here_be_dragons)*. As an alternative, consider using [rerun](https://github.com/alexch/rerun).

# Dependencies

 * [Web-Audio-Recorder-JS](https://github.com/higuma/web-audio-recorder-js)
