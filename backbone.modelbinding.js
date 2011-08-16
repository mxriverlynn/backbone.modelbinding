// Backbone.ModelBinding v0.3.0
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

  function handleUnbinding(view, model){
    var conventions = Backbone.ModelBinding.Conventions;
    for (var conventionName in conventions){
      if (conventions.hasOwnProperty(conventionName)){
        var conventionElement = conventions[conventionName];
        var handler = conventionElement.handler;
        var conventionSelector = conventionElement.selector;
        if (handler.unbind){
          handler.unbind(conventionSelector, view, model);
        }
      }
    }
  }

  return {
    version: "0.3.0",

    bind: function(view, options){
      Backbone.ModelBinding.Configuration.configureBindingAttributes(options);
      handleConventionBindings(view, view.model);
      Backbone.ModelBinding.Configuration.restoreConfiguration();
    },

    unbind: function(view){
      handleUnbinding(view, view.model);
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
        this.storeConfiguration();
        if (options.all){
          this.configureAllBindingAttributes(options.all);
          delete options.all;
        }
        _.extend(config, options);
      }
    },

    configureAllBindingAttributes: function(attribute){
      this.storeConfiguration();
      config.text = attribute;
      config.texarea = attribute;
      config.password = attribute;
      config.radio = attribute;
      config.checkbox = attribute;
      config.select = attribute;
    },

    storeConfiguration: function(){
      Backbone.ModelBinding._config = _.clone(config);
    },

    restoreConfiguration: function(){
      if (Backbone.ModelBinding._config) {
        config = Backbone.ModelBinding._config;
        delete Backbone.ModelBinding._config;
      }
    },
    
    getBindingAttr: function(type){ return config[type]; },

    getBindingValue: function(element, type){
      var bindingAttr = this.getBindingAttr(type);
      return element.attr(bindingAttr);
    }
  }
})();

// ----------------------------
// Binding Conventions
// ----------------------------
Backbone.ModelBinding.Conventions = (function(){
  function _getElementType(element) {
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
        var field = Backbone.ModelBinding.Configuration.getBindingValue(element, _getElementType(element));
        Backbone.ModelBinding.StandardBinding.bind.call(view, field, element, model);
      });
    },

    unbind: function(selector, view, model){
      view.$(selector).each(function(index){
        var element = view.$(this);
        var field = Backbone.ModelBinding.Configuration.getBindingValue(element, _getElementType(element));
        Backbone.ModelBinding.StandardBinding.unbind.call(view, field, element, model);
      });
    }
  };

  var SelectBox = {
    bind: function(selector, view, model){
      view.$(selector).each(function(index){
        var element = view.$(this);
        var field = Backbone.ModelBinding.Configuration.getBindingValue(element, 'select');
        Backbone.ModelBinding.SelectBoxBinding.bind.call(view, field, element, model);
      });
    },

    unbind: function(selector, view, model){
      view.$(selector).each(function(index){
        var element = view.$(this);
        var field = Backbone.ModelBinding.Configuration.getBindingValue(element, 'select');
        Backbone.ModelBinding.SelectBoxBinding.unbind.call(view, field, element, model);
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
          Backbone.ModelBinding.RadioGroupBinding.bind.call(view, group_name, model, bindingAttr);
        }
      });
    },

    unbind: function(selector, view, model){
      var self = this;
      var foundElements = [];
      view.$(selector).each(function(index){
        var element = view.$(this);
        var group_name = Backbone.ModelBinding.Configuration.getBindingValue(element, 'radio');
        if (!foundElements[group_name]) {
          foundElements[group_name] = true;
          var bindingAttr = Backbone.ModelBinding.Configuration.getBindingAttr('radio');
          Backbone.ModelBinding.RadioGroupBinding.unbind.call(view, group_name, model, bindingAttr);
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
    },

    unbind: function(selector, view, model){
    }
  };

  var DataBind = {
    bind: function(selector, view, model){
      var setOnElement = function(element, attr, val){
        switch(attr){
          case "html":
            element.html(val);
            break;
          case "text":
            element.text(val);
            break;
          case "enabled":
            element.attr("disabled", !val);
            break;
          default:
            element.attr(attr, val);
        }
      };

      view.$(selector).each(function(index){
        var element = view.$(this);
        var databind = element.attr("data-bind").split(" ");
        var elementAttr = databind[0];
        var modelAttr = databind[1];

        model.bind("change:" + modelAttr, function(changedModel, val){
          setOnElement(element,elementAttr,val);
        });

        // set default on data-bind element
        setOnElement(element,elementAttr,model.get(modelAttr));
      });
    },

    unbind: function(selector, view, model){
    }
  };

  return {
    text: {selector: "input[type=text]", handler: StandardInput}, 
    textarea: {selector: "textarea", handler: StandardInput},
    password: {selector: "input[type=password]", handler: StandardInput},
    radio: {selector: "input[type=radio]", handler: RadioGroup},
    checkbox: {selector: "input[type=checkbox]", handler: Checkbox},
    select: {selector: "select", handler: SelectBox},
    databind: { selector: "*[data-bind]", handler: DataBind}
  }
})();

// ----------------------------
// Standard Bi-Directional Binding Methods
// For: text, textarea, password
// ----------------------------
Backbone.ModelBinding.StandardBinding = (function(){
  var methods = {};

  methods._modelChange = function(changed_model, val){
    this.element.val(val);
  };

  methods.unbind = function(attribute_name, element, model){
    // unbind the model changes to the form elements
    model.unbind("change:" + attribute_name, methods._modelChange);
  };

  methods.bind = function(attribute_name, element, model){
    // bind the model changes to the form elements
    // force "this" to be our config object, so i can
    // get the data that i need, during the callback.
    // i have to do it this way because the unbinding
    // that occurs a few lines above, in the "unbind" method
    // requires the same instance of the callback method as
    // was passed into the bind method here. however, i need
    // more data in the callback than i'm able to get because
    // it's a callback, limited to the model's "change" event.
    // by passing in "config" as "this" for the callback, i
    // can get all the data i need. you'll see this pattern
    // repeated through the rest of the binding objects.
    var config = {element: element};
    model.bind("change:" + attribute_name, methods._modelChange, config);
    
    // bind the form changes to the model
    var self = this;
    element.bind("change", function(ev){
      var data = {};
      data[attribute_name] = self.$(ev.target).val();
      model.set(data);
    });

    // set the default value on the form, from the model
    var attr_value = model.get(attribute_name);
    if (typeof attr_value !== "undefined" && attr_value !== null) {
      element.val(attr_value);
    }
  };

  return methods;
})();

Backbone.ModelBinding.SelectBoxBinding = (function(){
  var methods = {};

  methods._modelChange = function(changed_model, val){
    this.element.val(val);
  }

  methods.unbind = function(attribute_name, element, model){
    model.unbind("change:" + attribute_name, methods._modelChange);
  }

  methods.bind = function(attribute_name, element, model){
    var self = this;

    // bind the model changes to the form elements
    var config = {element: element};
    model.bind("change:" + attribute_name, methods._modelChange, config);

    // bind the form changes to the model
    element.bind("change", function(ev){
      var data = {};
      var targetEl = self.$(ev.target);
      data[attribute_name] = targetEl.val();
      data[attribute_name + "_text"] = targetEl.find(":selected").text();
      model.set(data);
    });

    // set the default value on the form, from the model
    var attr_value = model.get(attribute_name);
    if (typeof attr_value !== "undefined" && attr_value !== null) {
      element.val(attr_value);
    }
  };

  return methods;
})();

Backbone.ModelBinding.RadioGroupBinding = (function(){
  var methods = {};

  methods._modelChange = function(model, val){
    var value_selector = "input[type=radio][" + this.bindingAttr + "=" + this.group_name + "][value=" + val + "]";
    this.view.$(value_selector).attr("checked", "checked");
  }

  methods.unbind = function(group_name, model, bindingAttr){
    model.unbind("change:" + group_name, methods._modelChange);
  }

  methods.bind = function(group_name, model, bindingAttr){
    var self = this;

    // bind the model changes to the form elements
    var config = {
      bindingAttr: bindingAttr,
      group_name: group_name,
      view: this
    };
    model.bind("change:" + group_name, methods._modelChange, config);

    // bind the form changes to the model
    var group_selector = "input[type=radio][" + bindingAttr + "=" + group_name + "]";
    self.$(group_selector).bind("change", function(ev){
      var element = self.$(ev.currentTarget);
      if (element.attr("checked")){
        var data = {};
        data[group_name] = element.val();
        model.set(data);
      }
    });

    // set the default value on the form, from the model
    var attr_value = model.get(group_name);
    if (typeof attr_value !== "undefined" && attr_value !== null) {
      var value_selector = "input[type=radio][" + bindingAttr + "=" + group_name + "][value=" + attr_value + "]";
      self.$(value_selector).attr("checked", "checked");
    }
  };

  return methods;
})();

Backbone.ModelBinding.Binders = (function(){
  var methods = {};

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
      var data = {};
      var changedElement = self.$(ev.target);
      var checked = changedElement.attr("checked")? true : false;
      data[attribute_name] = checked;
      model.set(data);
    });

    // set the default value on the form, from the model
    var attr_exists = model.attributes.hasOwnProperty(attribute_name);
    if (attr_exists) {
      var attr_value = model.get(attribute_name);
      if (typeof attr_value !== "undefined" && attr_value !== null) {
        element.attr("checked", "checked");
      }
      else{
        element.removeAttr("checked");
      }
    }
  }

  return methods;
})();
