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

## Convention Bindings

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

### Supported Form Inputs

The following form input types are supported:

* text
* textarea
* password
* checkbox
* select 
* radio button groups

Radio buttons are group are assumed to be grouped by the `name` attribute of the 
radio button items. 

Select boxes will populate 2 separate fields into the model that they are bound to.
The standard `#fieldid` will be populated with the selected value. An additional
`{#fieldid}_text` will be populated with the text from the selected item. For example,
a selected option of 

````
<select id='company'>
  <option value="foo_bar">Foo Bar Widgets, Inc.</option>
  ...
</select>
```` 

will populate the `company` attribute of the model with "foo_bar", and will populate
the `company_text` attribute of the model with "Foo Bar Widgets, Inc."

There is no support for hidden fields at the moment, because there is no 'change' event
that jQuery can listen to on a hidden field.

### Configuring The Bound Attributes

The convention binding system allows you to specify the attribute to use for the convention, by
the input type. The default configuration is:

```
{
  text: "id",
  textarea: "id",
  password: "id",
  radio: "name",
  checkbox: "id",
  select: "id"
}
````

You can override this configuration and use any attribute you wish, by specifying any or all of
these input types when you call the model binding. This is useful when you have field ids that
do not match directly to the model attributes. For example, the following will use a `modelAttr`
attribute value as the convention for text boxes.

````
SomeView = Backbone.View.extend({
  render: function(){
    // ... some rendering here
    Backbone.ModelBinding.call(this, { text: "modelAttr" });
  }
});


<input type="text" id="the_model_name" modelAttr="name">
````

When this text box has it's value changed, the model's `name` attribute will be populated with
the value instead of `the_model_name`.

### Pluggable Conventions

The convention based bindings are pluggable. Each of the existing form input types can have it's
convention replaced and you can add your own conventions for input types not currently handled,
etc. 

To replace a convention entirely, you need to supply a json document that has two pieces of
information: a jQuery selector string and an object with a `bind` method. Place the convention
in the `Backbone.ModelBinding.Conventions` and it will be picked up and executed. The `bind`
method receives three parameters: the jQuery selector you specified, the Backbone view, and
the model being bound.

You can replace the handler of an existing convention. For example, this will set the
value of a textbox called `#name` to some text, instead of doing any real binding.

````
var nameSettingsHandler = {
  bind: function(selector, view, model){
    view.$("#name").val("a custom convention supplied this name");
  }
};

Backbone.ModelBinding.Conventions.text.handler = nameSettingsHandler;
````

You can also create your own conventions that do just about anything you want. Here's an example
that modifies the contents of `<p>` tags:

````
var PConvention = {
  selector: "p",
  handler: {
    bind: function(selector, view, model){
      view.$(selector).each(function(index){
        var name = model.get("name");
        $(this).html(name);
      });
    }
  }
};

Backbone.ModelBinding.Conventions.paragraphs = PConvention;
````

This example will find all `<p>` tags in the view and render the `name` attribute from the model
into that paragraph, replacing all other text. Note that the name of the convention is set to
`paragraphs` when added to the conventions. This name did not exist prior to this assignment, so
the convention was added. If you assign a convention to an existing name, you will replace that
convention.

The list of existing conventions includes:
* text
* password
* radio
* checkbox
* select
* textarea

For fully functional, bi-directional binding convention examples, check out the source code
to Backbone.ModelBinding in the `backbone.modelbinding.js` file.
 
## Form Bindings

Non-conventional, bi-directional binding between your form input and your model.

Add `formBindings` document to you view, to specify the bindings you want to use. The format is
the same as the [Backbone view events](http://documentcloud.github.com/backbone/#View)

````
SomeView = Backbone.View.extend({
  formBindings: {
    "#someInput": "a_field"
  }
});
````

The input element must be settable via the jQuery `val` method. You can specify any valid jQuery
event to monitor for a change, though. 

Now when you type into the form input, your model's fields will be updated automatically. When your
model's fields are changed, the form input will update automatically. And, when you render the
view, the field will be populated with the value that exists in the model at rendering time.

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
