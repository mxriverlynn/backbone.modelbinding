// Backbone.ModelBinding v0.1.0
//
// Copyright (C)2011 Derick Bailey, Muted Solutions, LLC
// Distributed Under MIT Liscene
//
// Documentation and Full Licence Availabe at:
// http://github.com/derickbailey/backbone.modelbinding

(function(){

  function bidirectionalBinding(field, element, model){
    var self = this;

    // bind the model changes to the form elements
    model.bind("change:" + field, function(changed_model, val){
      element.val(val);
    });

    // bind the form changes to the model
    element.bind("change", function(ev){
      data = {};
      data[field] = self.$(ev.target).val();
      model.set(data);
    });

    // set the default value on the form, from the model
    var attr_value = model.get(field);
    if (attr_value) {
      element.val(attr_value);
    }
  }

  function handleConventionBindings(view, model){
    view.$("input, select").each(function(index){
      var element = view.$(this);
      var field = element.attr('id');

      bidirectionalBinding.call(view, field, element, model);
    });
  }

  function handleFormBindings(view, model){
    _.each(view.formBindings, function(field, selector_event){
      var selector_parts = selector_event.split(" ");
      var e = selector_parts[0];
      var selector = selector_parts[1];
      var element = view.$(selector);

      bidirectionalBinding.call(view, field, element, model);
    });
  }

  function handleHtmlBindings(view, model){
    _.each(view.htmlBindings, function(field, htmlElement){
      model.bind("change:" + field, function(changed_model, val){
        view.$(htmlElement).html(val);
      });
    });
  }

  this.ModelBinding = {
    version: "0.1.0",

    call: function(view){
      handleFormBindings(view, view.model);
      handleHtmlBindings(view, view.model);
      handleConventionBindings(view, view.model);
    }
  }

}).call(Backbone);
