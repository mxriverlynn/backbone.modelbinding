# Backbone.ModelBinding

Awesome model binding for [Backbone.js](http://documentcloud.github.com/backbone)

Inspired by [Brad Gone](http://xtargets.com/2011/06/11/binding-model-attributes-to-form-elements-with-backbone-js/)

## Getting Started

Copy the `backbone.modelbinding.js` file into your javascripts folder and include it in your page.

Add a `modelBindings` document to you view, to specify the bindings you want to use. The format is
the same as the [Backbone view events](http://documentcloud.github.com/backbone/#View)

````
SomeView = Backbone.View.extend({
  inputBindings: {
    "change #someInput": "a_field"
  }
});
````

Then after you have rendered, call `Backbone.ModelBinding.call(this);`

````
  render: function(){
    // ... render your form here
    Backbone.ModelBindings.call(this);
  }
````

Now when you type into the form input, your model's fields will be updated automatically. When your
model's fields are changed, the form input will update automatically. And, when you render the
view, the field will be populated with the value that exists in the model at rendering time.

## Limited Use

Note that this only works for form input fields right now. I want to make this work for any type
of view, eventually. Perhaps it will re-render a view, or update the html of a portion of the view.
I'm not entirely sure, yet. We'll see where this leads

## Use At Your Own Risk

Note that I'm still in the early stages and has limited functionality. Although 
functionality is being built with unit tests, in a test-first manner, there is no
guarantee that it will work the way you want it to or expect it to. Use at your own risk.

# Legal Mumbo Jumbo (MIT License)

Copyright (c) 2011 Derick Bailey

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
