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
    for (var conventionName in conventions){
      if (conventions.hasOwnProperty(conventionName)){
        var conventionElement = conventions[conventionName];
        var conventionClass = conventionElement.convention;
        var conventionSelector = conventionElement.selector;
        conventionClass.bind(conventionSelector, view, model);
      }
    }
  }

  function handleFormBindings(view, model){
    _.each(view.formBindings, function(field, selector){
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
      var foundElements = [];
      view.$(selector).each(function(index){
        var element = view.$(this);
        var group_name = element.attr('name');
        if (!foundElements[group_name]) {
          foundElements[group_name] = true;
          Backbone.ModelBinding.HelperMethods.bidirectionalRadioGroupBinding.call(view, group_name, model);
        }
      });
    }
  };

  return {
    text: {selector: "input[type=text]", convention: StandardInput}, 
    password: {selector: "input[type=password]", convention: StandardInput},
    radioGroup: {selector: "input[type=radio]", convention: RadioButtons},
    select: {selector: "select", convention: StandardInput},
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

  function bidirectionalRadioGroupBinding(group_name, model){
    var self = this;

    // bind the model changes to the form elements
    model.bind("change:" + group_name, function(changed_model, val){
      var value_selector = "input[type=radio][name=" + group_name + "][value=" + val + "]";
      self.$(value_selector).attr("checked", "checked");
    });

    // bind the form changes to the model
    var group_selector = "input[type=radio][name=" + group_name + "]";
    self.$(group_selector).bind("change", function(ev){
      var element = self.$(ev.currentTarget);
      if (element.attr("checked")){
        data = {};
        data[group_name] = element.val();
        model.set(data);
      }
    });

    // set the default value on the form, from the model
    var attr_value = model.get(group_name);
    if (attr_value) {
      var value_selector = "input[type=radio][name=" + group_name + "][value=" + attr_value + "]";
      self.$(value_selector).attr("checked", "checked");
    }
  }

  return {
    bidirectionalBinding: bidirectionalBinding,
    bidirectionalRadioGroupBinding: bidirectionalRadioGroupBinding
  }
})();
