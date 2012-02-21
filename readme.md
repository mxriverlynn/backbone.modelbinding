# Backbone.Phoenix

Backbone.Phoenix is finding life after the death of Backbone.ModelBinding. The ModelBinding plugin
became a giant mess with far too many concerns and an impossible to maintain codebase. Phoenix aims
to simplify this down to just data-binding. No form binding involved.

## Data-Bind Attributes

Backbone.Phoenix supports Knockout-style data-bind attributes on any arbitrary
HTML element. These bindings will populate any attribute, the text, or HTML contents
of an HTML element based on your configurations. This is particularly useful when a
model that is being edited is also being displayed elsewhere on the screen.

To bind an element to a model's properties, add a `data-bind` attribute to the element
and specify what should be updated with which model property using an `elementAttr modelAttr`
format. For example `<span data-bind="text name">` will update the span's text with
the model's name property, when the model's name changes.

```html
<form>
  <input type="text" id="name">
</form>
Name: <span data-bind="text name">
```

```js
SomeView = Backbone.View.extend({
  // ... 

  render: function(){
    // ... 
    Backbone.Phoenix.bind(this);
  }
});

someModel = new SomeModel();
someView = new SomeView({model: someModel});
```

In this example, the model's `name` will be updated when you type into the text box
and then tab or click away from it (to fire the change event). When the model's `name`
property is updated, the `data-bind` convention will pick up the change and set
the text of the `span` to the model's name.

### Data-Bind Multiple Attributes

Multiple attributes can be specified for a single element's `data-bind` by separating
each with a `;` (semi-colon). For example:

```html
<form>
  <input type="text" id="name">
</form>
Name: <span data-bind="text name; class name">
```

```js
SomeView = Backbone.View.extend({
  // ... 

  render: function(){
    // ... 
    Backbone.Phoenix.bind(this);
  }
});

someModel = new SomeModel();
someView = new SomeView({model: someModel});
```

In this example, both the text and the css class will be updated when you change
the name input. You can data-bind as many attributes as you need, in this manner.

### Configurating the data-bind selector

By default, the data-bind capabilities looks for a `data-bind` attribute on the
HTML elements being bound. This is configurable, though:

```js
Backbone.Phoenix.Configuration.dataBindAttr = "my-binder";
```

This example will look for elements with an attribute of `my-binder` instead of
`data-bind`.

```html
<div my-binder="text someAttr"></div>
```

### Special Cases For data-bind

There are several special cases for the data-bind attribute. These allow a little more
functionality than just setting an attribute on an element. 

* (default) - if you only specify the model property, defaults to the text of the html element
* text - replace the text contents of the element
* html - replace the html contents of the element
* enabled - enable or disable the html element

#### (default)

If you only specify the model's property in the data-bind attribute, then the data-bind
will bind the value of that model property to the `text` of the html element.

```html
<div data-bind="name"/>
```

See the document for data-bind text, below.

#### text

If you set the data-bind attribute to use `text`, it will replace the text contents of the
html element instead of just setting an element attribute.

```html
<div id="someDiv" data-bind="text someProperty"></div>
```

```js
someModel.set({someProperty: "some value"});
```

#### html

If you set the data-bind attribute to use `html`, it will replace the entire
inner html of the html element, instead of just setting an element attribute.

```html
<div id="someDiv" data-bind="html someProperty"></div>
```

```js
someModel.set({someProperty: "some value"});
```

#### enabled

This special case breaks the html element standard of using a `disabled` attribute, specifically
to inverse the logic used for enabling / disabling an element, to keep the data-bind attribute
clean and easy to read.

If you have a model with a property that indicates a negative state, such as `invalid`, then you
can use a data-bind attribute of `disabled`:

```html
<button id="someButton" data-bind="disabled invalid"></div>
```

```js
someModel.set({invalid: true});
```

However, some developers prefer to use positive state, such as `isValid`. In this case, setting
the disabled attribute to the model's isValid property would result in the button being disabled
when the model is valid and enabled when the model is not valid. To correct this, a special case
has been added to enable and disable an element with `enabled`.

```html
<button id="someButton" data-bind="enabled isValid"></div>
```

```js
someModel.set({isValid: false});
```

This will disable the button when the model is invalid and enable the button when the model is
valid.

#### displayed

This allows you to specify that an element should be shown or hidden by setting the css
of the element according to the value of the model properties specified.

```html
<div data-bind="displayed isValid" />
```

```js
someModel.set({isValid: false});
```

When the model's property is set to false, the HTML element's `display` css will be set
to `none`. When the model's property is set to true, the HTML element's `display` css
will be set to `block`.

#### hidden

This is the inverse of `displayed`.

```html
<div data-bind="hidden isValid" />
```html

```js
someModel.set({isValid: true});
```

When the model's property is set to false, the HTML element's `display` css will be set
to `block`. When the model's property is set to true, the HTML element's `display` css
will be set to `none`.

### Data-Bind To Any Model Event

In addition to binding model attributes, you can use the data-bind functionality to
bind to any arbitrary event that the model fires. This is done with the syntax:

```html
<div data-bind="text event:foo"></div>
```

where `foo` is the event that is triggered from the model. The first parameter
of the event will be used as the data for the element.

```js
model.trigger("foo", "bar");
```

This will cause the above data-binding to produce `<div>bar</div>`.

### Data-Bind Substitutions

If a model's property is `unset`, the data-bind may not update correctly when using `text` or `html`
as the bound attribute of the element.

```html
<div data-bind="text something"></div>
```

```js
model.set({something: "whatever"});
model.unset("something");
```

The result will be a div with it's text set to "". this is handled through the data-bind's 
substitutions for undefined values. The default substitution is to replace an undefined
value with an empty string. However, this can be per attribute:

```html
<div data-bind="text something"></div>
<div data-bind="html something"></div>
```

```js
Backbone.Phoenix.Configuration.dataBindSubst({
  text: "undefined. setting text to this",
  html: "&nbsp;"
});
model.set({something: "whatever"});
model.unset("something");
```

The result of this example will be a div that displays "undefined. setting the text to this" and a
div whose contents is a single space, instead of being empty.

## Release Notes

### v0.6.0

* **BREAKING**: Backbone.Phoenix is rising from the ashes of Backbone.ModelBinding

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
