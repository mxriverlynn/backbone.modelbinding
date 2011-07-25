# Backbone.ModelBinding

Awesome model binding for [Backbone.js](http://documentcloud.github.com/backbone)

Inspired by [Brad Phelan](http://xtargets.com/2011/06/11/binding-model-attributes-to-form-elements-with-backbone-js/),
Knockout.js' data-binding capabilities, and [Brandon Satrom](http://userinexperience.com/?p=633)'s
desire to keep UJS alive. 

## Getting Started

It's easy to get up and running. You only need to have Backbone (including underscore.js - 
a requirement for Backbone) and jQuery in your page before including the backbone.modelbining
plugin.

### Prerequisites

* Backbone.js v0.5.1 or higher
* jQuery v1.6.2 or higher

This is a plugin for Backbone.js and is built and tested against Backbone v0.5.1. It also uses jQuery
to perform most of the bindng and manipulations, and is built and tested against v1.6.1. However, I am
currently using this plugin in a production application with Backbone v0.3.3 and jQuery v1.5.1. 

At this point, I make no guarantees of it working with any version of Backbone or jQuery, 
other than what it has been built and tested against. It works for me, so it may work for you
with versions other than what is stated

### Get The ModelBinding Plugin

Download the `backbone.modelbinding.js` file from this github repository and copy it into 
your javascripts folder. Add the needed `<script>` tag to bring the plugin into any page
that wishes to use it. Be sure to include the modelbinding file _after_ the backbone.js file.

### Render The ModelBindings

Your Backbone view must have an `el` defined and the `render` method of your view needs to 
execute the bindings that you define

````
SomeView = Backbone.View.extend({
  el: "#someElement",

  render: function(){
    // ... render your form here

    // execute the defined bindings
    Backbone.ModelBindings.call(this);
  }
});
````

### Convention Bindings

Automatic bi-directional binding between your form input and your model. 

The convention based binding requires no additional configuration or code in your
view, other than calling the `Backbone.Modelbindings.call(this);` as noted above.
With the conventions binding, your `<input>` fields will be bound to the views model
by the id of the input. 

For example:

````
// something.html

<input id='name'>

// something.js

SomeModel = Backbone.Model.extend();

SomeView = Backbone.View.extend({
  render: function(){
    // ... render your form here

    // execute the defined bindings
    Backbone.ModelBindings.call(this);
  }
});

model = new SomeModel();
view = new SomeView({model: model});

model.set({name: "some name"});

````

In this example, when `model.set` is called to set the name, "some name" will appear
in the `#name` input field. Similarly, when the `#name` input field is changed, the
value entered into that field will be sent to the model's `name` attribute.

At this point, only `<input>` and `<select>` fields are handled. Other form field types should come
soon, though.

### Form Bindings

Non-conventional, bi-directional binding between your form input and your model.

Add `formBindings` document to you view, to specify the bindings you want to use. The format is
the same as the [Backbone view events](http://documentcloud.github.com/backbone/#View)

````
SomeView = Backbone.View.extend({
  formBindings: {
    "change #someInput": "a_field"
  }
});
````

The input element must be settable via the jQuery `val` method. You can specify any valid jQuery
event to monitor for a change, though. 

Now when you type into the form input, your model's fields will be updated automatically. When your
model's fields are changed, the form input will update automatically. And, when you render the
view, the field will be populated with the value that exists in the model at rendering time.

### HTML Bindings

Model -> HTML element binding for your model's field value changes.

Add an 'htmlBindings' document to your view, to specify the bindings you want to use. The format is
to list the html element selector on the left, and the model's field on the right.

````
SomeView = Backbone.View.extend({
  htmlBindings: {
    "#someElement": "a_field"
  }
});
````

Now when the model's `a_field` is changed, the html element `#someElement` will have it's contents
replaced by the value that is entered into the model's `a_field` field.

*Note:* htmlBindings is experimental as I don't have an actual use for it right now. I put it in
because it was easy and it might inspire some other ideas at some point.

## Use At Your Own Risk

backbone.modelbinding is still in the early stages and has limited functionality. Although 
functionality is being built with unit tests, in a test-first manner, there is no
guarantee that it will work the way you want it to or expect it to. Use at your own risk.

# Legal Mumbo Jumbo (MIT License)

Copyright (c) 2011 Derick Bailey, Muted Solutions, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
