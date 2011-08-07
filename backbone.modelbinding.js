// Backbone.ModelBinding v0.2.0
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
    var conventions = Backbone.ModelBinding.Conventions;
    for (var conventionName in conventions){
      if (conventions.hasOwnProperty(conventionName)){
        var conventionElement = conventions[conventionName];
        var handler = conventionElement.handler;
        var conventionSelector = conventionElement.selector;
        handler.bind(conventionSelector, view, model);
      }
    }
  }

  return {
    version: "0.2.0",

    call: function(view, options){
      Backbone.ModelBinding.Configuration.configureBindingAttributes(options);
      handleConventionBindings(view, view.model);
      Backbone.ModelBinding.Configuration.resetConfiguration();
    }
  }
})();

// ----------------------------
// Model Binding Configuration
// ----------------------------
Backbone.ModelBinding.Configuration = (function(){
  var config = {
	  text: "id",
	  textarea: "id",
	  password: "id",
	  radio: "name",
	  checkbox: "id",
	  select: "id"
  };
  
  return {
    configureBindingAttributes: function(options){
      if (options) {
        Backbone.ModelBinding._config = _.clone(config);
        _.extend(config, options);
      }
    },

    resetConfiguration: function(){
      if (Backbone.ModelBinding._config) {
        config = Backbone.ModelBinding._config;
        delete Backbone.ModelBinding._config;
      }
    },
    
    getBindingAttr: function(type){ return config[type]; },

    getBindingValue: function(element, type){
      var bindingAttr = Backbone.ModelBinding.Configuration.getBindingAttr(type);
      return element.attr(bindingAttr);
    }
  }
})();

// ----------------------------
// Binding Conventions
// ----------------------------
Backbone.ModelBinding.Conventions = (function(){
  function getElementType(element) {
    var type = element[0].tagName.toLowerCase();
    if (type == "input"){
      type = element.attr("type");
    }
    return type;
  }

  var StandardInput = {
    bind: function(selector, view, model){
      view.$(selector).each(function(index){
        var element = view.$(this);
        var field = Backbone.ModelBinding.Configuration.getBindingValue(element, getElementType(element));
        Backbone.ModelBinding.Binders.bidirectionalBinding.call(view, field, element, model);
      });
    }
  };

  var SelectBox = {
    bind: function(selector, view, model){
      view.$(selector).each(function(index){
        var element = view.$(this);
        var field = Backbone.ModelBinding.Configuration.getBindingValue(element, 'select');
        Backbone.ModelBinding.Binders.bidirectionalSelectBinding.call(view, field, element, model);
      });
    }
  };

  var RadioGroup = {
    bind: function(selector, view, model){
      var self = this;
      var foundElements = [];
      view.$(selector).each(function(index){
        var element = view.$(this);
        var group_name = Backbone.ModelBinding.Configuration.getBindingValue(element, 'radio');
        if (!foundElements[group_name]) {
          foundElements[group_name] = true;
          var bindingAttr = Backbone.ModelBinding.Configuration.getBindingAttr('radio');
          Backbone.ModelBinding.Binders.bidirectionalRadioGroupBinding.call(view, group_name, model, bindingAttr);
        }
      });
    }
  };

  var Checkbox = {
    bind: function(selector, view, model){
      var self = this;
      view.$(selector).each(function(index){
        var element = view.$(this);
        var field = Backbone.ModelBinding.Configuration.getBindingValue(element, 'checkbox');
        Backbone.ModelBinding.Binders.bidirectionalCheckboxBinding.call(view, field, element, model);
      });
    }
  };

  var DataBind = {
    bind: function(selector, view, model){
      view.$(selector).each(function(index){
        var element = view.$(this);
        var databind = element.attr("data-bind").split(" ");
        var elementAttr = databind[0];
        var modelAttr = databind[1];

        model.bind("change:" + modelAttr, function(changedModel, val){
          switch(elementAttr){
            case "html":
              element.html(val);
              break;
            case "text":
              element.text(val);
              break;
            default:
              element.attr(elementAttr, val);
          }
        });

      });
    }
  };

  return {
    text: {selector: "input[type=text]", handler: StandardInput}, 
    textarea: {selector: "textarea", handler: StandardInput},
    password: {selector: "input[type=password]", handler: StandardInput},
    radio: {selector: "input[type=radio]", handler: RadioGroup},
    checkbox: {selector: "input[type=checkbox]", handler: Checkbox},
    select: {selector: "select", handler: SelectBox},
    databind: { selector: "*[data-bind]", handler: DataBind},
  }
})();

// ----------------------------
// Bi-Directional Binding Methods
// ----------------------------
Backbone.ModelBinding.Binders = (function(){
  methods = {};

  methods.bidirectionalBinding = function(attribute_name, element, model){
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
  },

  methods.bidirectionalSelectBinding = function(attribute_name, element, model){
    var self = this;

    // bind the model changes to the form elements
    model.bind("change:" + attribute_name, function(changed_model, val){
      element.val(val);
    });

    // bind the form changes to the model
    element.bind("change", function(ev){
      data = {};
      data[attribute_name] = self.$(ev.target).val();
      data[attribute_name + "_text"] = self.$(":selected", ev.target).text();
      model.set(data);
    });

    // set the default value on the form, from the model
    var attr_value = model.get(attribute_name);
    if (attr_value) {
      element.val(attr_value);
    }
  },

  methods.bidirectionalRadioGroupBinding = function(group_name, model, bindingAttr){
    var self = this;

    // bind the model changes to the form elements
    model.bind("change:" + group_name, function(changed_model, val){
      var value_selector = "input[type=radio][" + bindingAttr + "=" + group_name + "][value=" + val + "]";
      self.$(value_selector).attr("checked", "checked");
    });

    // bind the form changes to the model
    var group_selector = "input[type=radio][" + bindingAttr + "=" + group_name + "]";
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
      var value_selector = "input[type=radio][" + bindingAttr + "=" + group_name + "][value=" + attr_value + "]";
      self.$(value_selector).attr("checked", "checked");
    }
  },

  methods.bidirectionalCheckboxBinding = function(attribute_name, element, model){
    var self = this;

    // bind the model changes to the form elements
    model.bind("change:" + attribute_name, function(changed_model, val){
      if (val){
        element.attr("checked", "checked");
      }
      else{
        element.removeAttr("checked");
      }
    });

    // bind the form changes to the model
    element.bind("change", function(ev){
      data = {};
      var changedElement = self.$(ev.target);
      var checked = changedElement.attr("checked")? true : false;
      data[attribute_name] = checked;
      model.set(data);
    });

    // set the default value on the form, from the model
    var attr_exists = model.attributes.hasOwnProperty(attribute_name);
    if (attr_exists) {
      var attr_value = model.get(attribute_name);
      if (attr_value){
        element.attr("checked", "checked");
      }
      else{
        element.removeAttr("checked");
      }
    }
  }

  return methods;
})();
