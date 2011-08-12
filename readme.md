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

### Call The Model Bindings

The model binding code is executed with a call to `Backbone.ModelBinding.call(view)`. There are
several places that it can be called from, depending on your circumstances.

All of the element binding happens within the context of the view's `el`, therefore you must
call the model binding code after your view's `el` has been populated with the elements that
will be bound to.

#### Binding After Rendering

If your view modifies the html contents of the view's `el` in the `render` method, you should 
call the model binding after the modifications are made:

````
SomeView = Backbone.View.extend({
  render: function(){
    // ... render your form here
    $(this.el).html("... some html and content goes here ... ");

    // execute the model bindings
    Backbone.ModelBinding.call(this);
  }
});
````

#### Binding A View That Does Not Render

If, however, your view has an `el` that represents an existing element in your html, and the
contents of the `el` are not modified during a call to `render`, then you can make the call to
the model binding code in the initializer or anywhere else.

````
<form id="some-form">
  Name: <input id="name">
</form>
````

````
FormView = Backbone.View.extend({
  el: "#some-form",

  initialize: function(){
    Backbone.ModelBinding.call(this);
  }
});
````

#### Binding From Outside A View

There is no requirement for the model binding code to be called from within a view directly.
You can bind the view from external code, like this:

````
FormView = Backbone.View.extend({
  el: "#some-form",
});

formView = new FormView();
Backbone.ModelBinding.call(formView);
````

## Convention Bindings

Automatic bi-directional binding between your form input and your model. 

The convention based binding requires no additional configuration or code in your
view, other than calling the `Backbone.ModelBinding.call(this);` as noted above.
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
    Backbone.ModelBinding.call(this);
  }
});

model = new SomeModel();
view = new SomeView({model: model});

model.set({name: "some name"});

````

In this example, when `model.set` is called to set the name, "some name" will appear
in the `#name` input field. Similarly, when the `#name` input field is changed, the
value entered into that field will be sent to the model's `name` attribute.

## Data-Bind Attributes

Backbone.ModelBinding supports Knockout-style data-bind attributes on any arbitrary
HTML element. These bindings will populate any attribute, the text, or HTML contents
of an HTML element based on your configurations. This is particularly useful when a
model that is being edited is also being displayed elsewhere on the screen.

To bind an element to a model's attributes, add a `data-bind` attribute to the element
and specify what should be updated with which model attribute using a `elementAttr modelAttr`
format. For example `<span data-bind="text name">` will update the span's text with
the model's name attribute, when the model's name changes.

````
<form>
  <input type="text" id="name">
</form>
Name: <span data-bind="text name">

SomeView = Backbone.View.extend({
  // ... 

  render: function(){
    // ... 
    Backbone.ModelBinding.call(this);
  }
});

someModel = new SomeModel();
someView = new SomeView({model: someModel});
````

In this example, the model's `name` will be updated when you type into the text box
and then tab or click away from it (to fire the change event). When the model's `name`
attribute is updated, the `data-bind` convention will pick up the change and set
the text of the `span` to the model's name.

## Form Binding Conventions

The following form input types are supported by the form convention binder:

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
do not match directly to the model attributes. 

#### Override All Element Binding Attributes

The following will use use the `class` attribute's value as the binding for all input field:

````
SomeView = Backbone.View.extend({
  render: function(){
    // ... some rendering here
    Backbone.ModelBinding.call(this, { all: "class" });
  }
});

<input type="text" id="the_model_name" class="name">
````

If the same convention needs to be used throughout an application, and not just withing a single
view, the configuration can be set at a global level:

````
Backbone.ModelBinding.Configuration.configureAllBindingAttributes({all: "class"});
````

#### Override Individual Element Binding Attributes

The following will use a `modelAttr` attribute value as the convention for text boxes, only.

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

If the same convention needs to be used throughout an application, and not just withing a single
view, the configuration can be set at a global level:

````
Backbone.ModelBinding.Configuration.configureBindingAttributes({text: "modelAttr"});
````

Now all text boxes will update the model attribute specified in the text box's `modelAttr`.

## Pluggable Conventions

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
* formbinding
* databind

For fully functional, bi-directional binding convention examples, check out the source code
to Backbone.ModelBinding in the `backbone.modelbinding.js` file.
 
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
