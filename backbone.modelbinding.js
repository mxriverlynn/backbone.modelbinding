// Backbone.ModelBinding v0.1.1
//
// Copyright (C)2011 Derick Bailey, Muted Solutions, LLC
// Distributed Under MIT Liscene
//
// Documentation and Full Licence Availabe at:
// http://github.com/derickbailey/backbone.modelbinding

// ----------------------------
// Backbone.ModelBinding
// ----------------------------
Backbone.ModelBinding = (function(){
  function handleConventionBindings(view, model){
    var conventions = Backbone.ModelBinding.FormFieldConventions;
    for (var conventionSelector in conventions){
      if (conventions.hasOwnProperty(conventionSelector)){
        convention = conventions[conventionSelector];
        convention.bind(conventionSelector, view, model);
      }
    }
  }

  function handleFormBindings(view, model){
    _.each(view.formBindings, function(field, selector_event){
      var selector_parts = selector_event.split(" ");
      var e = selector_parts[0];
      var selector = selector_parts[1];
      var element = view.$(selector);

      Backbone.ModelBinding.HelperMethods.bidirectionalBinding.call(view, field, element, model);
    });
  }

  function handleHtmlBindings(view, model){
    _.each(view.htmlBindings, function(field, htmlElement){
      model.bind("change:" + field, function(changed_model, val){
        view.$(htmlElement).html(val);
      });
    });
  }

  return {
    version: "0.1.1",

    call: function(view){
      handleFormBindings(view, view.model);
      handleHtmlBindings(view, view.model);
      handleConventionBindings(view, view.model);
    }
  }
})();

// ----------------------------
// Form Field Conventions
// ----------------------------
Backbone.ModelBinding.FormFieldConventions = (function(){
  var StandardInput = {
    bind: function(selector, view, model){
      view.$(selector).each(function(index){
        var element = view.$(this);
        var field = element.attr('id');
        Backbone.ModelBinding.HelperMethods.bidirectionalBinding.call(view, field, element, model);
      });
    }
  };

  var RadioButtons = {
    bind: function(selector, view, model){
      view.$(selector).each(function(index){
        var element = view.$(this);
        var field = element.attr('name');
        Backbone.ModelBinding.HelperMethods.bidirectionalBinding.call(view, field, element, model);
      });
    }
  };

  return {
    "input[type=text]": StandardInput, 
    "input[type=password]": StandardInput,
    "input[type=radio]": RadioButtons,
    "select": StandardInput,
  }
})();

// ----------------------------
// Helper Methods:
// common methods used in conventions
// and non-conventional bindings
// ----------------------------
Backbone.ModelBinding.HelperMethods = (function(){

  function bidirectionalBinding(attribute_name, element, model){
    var self = this;

    // bind the model changes to the form elements
    model.bind("change:" + attribute_name, function(changed_model, val){
      element.val(val);
    });

    // bind the form changes to the model
    element.bind("change", function(ev){
      data = {};
      data[attribute_name] = self.$(ev.target).val();
      model.set(data);
    });

    // set the default value on the form, from the model
    var attr_value = model.get(attribute_name);
    if (attr_value) {
      element.val(attr_value);
    }
  }

  return {
    bidirectionalBinding: bidirectionalBinding
  }
})();
