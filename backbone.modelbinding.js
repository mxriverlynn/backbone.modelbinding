// Backbone.ModelBinding v0.4.0
//
// Copyright (C)2011 Derick Bailey, Muted Solutions, LLC
// Distributed Under MIT Liscene
//
// Documentation and Full Licence Availabe at:
// http://github.com/derickbailey/backbone.modelbinding

// ----------------------------
// Backbone.ModelBinding
// ----------------------------

Backbone.ModelBinding = (function(_){
  return {
    version: "0.4.0",

    bind: function(view, options){
      var config = new Backbone.ModelBinding.Configuration(options);
      view.modelBinder = new Backbone.ModelBinding.ModelBinder(view, config);
      view.modelBinder.bind();
    },

    unbind: function(view){
      if (view.modelBinder){
        view.modelBinder.unbind()
      }
    }
  };
})(_);

Backbone.ModelBinding.ModelBinder = function(view, config){
  this.bind = function(){
    var conventions = Backbone.ModelBinding.Conventions;
    for (var conventionName in conventions){
      if (conventions.hasOwnProperty(conventionName)){
        var conventionElement = conventions[conventionName];
        var handler = conventionElement.handler;
        var conventionSelector = conventionElement.selector;
        handler.bind.call(this, conventionSelector, view, view.model, config);
      }
    }
  }

  this.unbind = function(){
    var conventions = Backbone.ModelBinding.Conventions;
    for (var conventionName in conventions){
      if (conventions.hasOwnProperty(conventionName)){
        var conventionElement = conventions[conventionName];
        var handler = conventionElement.handler;
        var conventionSelector = conventionElement.selector;
        if (handler.unbind){
          handler.unbind.call(this, conventionSelector, view, view.model, config);
        }
      }
    }
  }
}

// ----------------------------
// Model Binding Configuration
// ----------------------------
Backbone.ModelBinding.Configuration = function(options){
  this.bindingAttrConfig = {};

  _.extend(this.bindingAttrConfig, 
    Backbone.ModelBinding.Configuration.bindindAttrConfig,
    options
  );

  if (this.bindingAttrConfig.all){
    var attr = this.bindingAttrConfig.all;
    delete this.bindingAttrConfig.all;
    for (var inputType in this.bindingAttrConfig){
      if (this.bindingAttrConfig.hasOwnProperty(inputType)){
        this.bindingAttrConfig[inputType] = attr;
      }
    }
  }

  this.getBindingAttr = function(type){ 
    return this.bindingAttrConfig[type]; 
  };

  this.getBindingValue = function(element, type){
    var bindingAttr = this.getBindingAttr(type);
    return element.attr(bindingAttr);
  };
};

Backbone.ModelBinding.Configuration.bindindAttrConfig = {
  text: "id",
  textarea: "id",
  password: "id",
  radio: "name",
  checkbox: "id",
  select: "id"
};

Backbone.ModelBinding.Configuration.configureBindingAttributes = function(options){
  if (options.all){
    this.configureAllBindingAttributes(options.all);
    delete options.all;
  }
  _.extend(Backbone.ModelBinding.Configuration.bindindAttrConfig, options);
};

Backbone.ModelBinding.Configuration.configureAllBindingAttributes = function(attribute){
  var config = Backbone.ModelBinding.Configuration.bindindAttrConfig;
  config.text = attribute;
  config.textarea = attribute;
  config.password = attribute;
  config.radio = attribute;
  config.checkbox = attribute;
  config.select = attribute;
};

// ----------------------------
// Text, Textarea, and Password Bi-Directional Binding Methods
// ----------------------------
Backbone.ModelBinding.StandardBinding = (function(Backbone){
  var methods = {};

  var _getElementType = function(element) {
    var type = element[0].tagName.toLowerCase();
    if (type == "input"){
      type = element.attr("type");
      if (type == undefined || type == ''){
        type = 'text';
      }
    }
    return type;
  };

  methods.unbind = function(selector, view, model, config){
    var modelBinder = this;

    view.$(selector).each(function(index){
      var element = view.$(this);
      var attribute_name = config.getBindingValue(element, _getElementType(element));
      // unbind the model changes to the form elements
      model.unbind("change:" + attribute_name, modelBinder.standardModelChange);
    });
  };

  methods.bind = function(selector, view, model, config){
    var modelBinder = this;

    view.$(selector).each(function(index){
      var element = view.$(this);
      var elementType = _getElementType(element);
      var attribute_name = config.getBindingValue(element, elementType);

      if (!modelBinder.standardModelChange){
        modelBinder.standardModelChange = function(changed_model, val){
          element.val(val);
        };
      }

      model.bind("change:" + attribute_name, modelBinder.standardModelChange);

      // bind the form changes to the model
      element.bind("change", function(ev){
        var data = {};
        data[attribute_name] = view.$(ev.target).val();
        model.set(data);
      });

      // set the default value on the form, from the model
      var attr_value = model.get(attribute_name);
      if (typeof attr_value !== "undefined" && attr_value !== null) {
        element.val(attr_value);
      }
    });
  };

  return methods;
})(Backbone);

// ----------------------------
// Select Box Bi-Directional Binding Methods
// ----------------------------
Backbone.ModelBinding.SelectBoxBinding = (function(Backbone){
  var methods = {};

  methods._modelChange = function(changed_model, val){
    this.element.val(val);
  };

  methods.unbind = function(selector, view, model, config){
    view.$(selector).each(function(index){
      var element = view.$(this);
      var attribute_name = config.getBindingValue(element, 'select');
      model.unbind("change:" + attribute_name, methods._modelChange);
    });
  };

  methods.bind = function(selector, view, model, config){
    view.$(selector).each(function(index){
      var element = view.$(this);
      var attribute_name = config.getBindingValue(element, 'select');

      // bind the model changes to the form elements
      var context = {element: element};
      model.bind("change:" + attribute_name, methods._modelChange, context);

      // bind the form changes to the model
      element.bind("change", function(ev){
        var data = {};
        var targetEl = view.$(ev.target);
        data[attribute_name] = targetEl.val();
        data[attribute_name + "_text"] = targetEl.find(":selected").text();
        model.set(data);
      });

      // set the default value on the form, from the model
      var attr_value = model.get(attribute_name);
      if (typeof attr_value !== "undefined" && attr_value !== null) {
        element.val(attr_value);

        if (element.val() != attr_value) {
          var data = {};
          data[attribute_name] = element.val();
          model.set(data);
        }
      }
    });
  };

  return methods;
})(Backbone);

// ----------------------------
// Radio Button Group Bi-Directional Binding Methods
// ----------------------------
Backbone.ModelBinding.RadioGroupBinding = (function(Backbone){
  var methods = {};

  methods._modelChange = function(model, val){
    var value_selector = "input[type=radio][" + this.bindingAttr + "=" + this.group_name + "][value=" + val + "]";
    this.view.$(value_selector).attr("checked", "checked");
  };

  methods.unbind = function(selector, view, model, config){
    var foundElements = [];
    view.$(selector).each(function(index){
      var element = view.$(this);
      var group_name = config.getBindingValue(element, 'radio');
      if (!foundElements[group_name]) {
        foundElements[group_name] = true;
        var bindingAttr = config.getBindingAttr('radio');
        model.unbind("change:" + group_name, methods._modelChange);
      }
    });
  };

  methods.bind = function(selector, view, model, config){
    var foundElements = [];
    view.$(selector).each(function(index){
      var element = view.$(this);

      var group_name = config.getBindingValue(element, 'radio');
      if (!foundElements[group_name]) {
        foundElements[group_name] = true;
        var bindingAttr = config.getBindingAttr('radio');

        // bind the model changes to the form elements
        var context = {
          bindingAttr: bindingAttr,
          group_name: group_name,
          view: view
        };
        model.bind("change:" + group_name, methods._modelChange, context);

        // bind the form changes to the model
        var group_selector = "input[type=radio][" + bindingAttr + "=" + group_name + "]";
        view.$(group_selector).bind("change", function(ev){
          var element = view.$(ev.currentTarget);
          if (element.is(":checked")){
            var data = {};
            data[group_name] = element.val();
            model.set(data);
          }
        });

        // set the default value on the form, from the model
        var attr_value = model.get(group_name);
        if (typeof attr_value !== "undefined" && attr_value !== null) {
          var value_selector = "input[type=radio][" + bindingAttr + "=" + group_name + "][value=" + attr_value + "]";
          view.$(value_selector).attr("checked", "checked");
        }
      }
    });
  };

  return methods;
})(Backbone);

// ----------------------------
// Checkbox Bi-Directional Binding Methods
// ----------------------------
Backbone.ModelBinding.CheckboxBinding = (function(Backbone){
  var methods = {};

  methods.unbind = function(selector, view, model, config){
    var modelBinder = this;

    view.$(selector).each(function(index){
      var element = view.$(this);
      var attribute_name = config.getBindingValue(element, 'checkbox');
      model.unbind("change:" + attribute_name, modelBinder.checkboxModelChange);
    });
  };

  methods.bind = function(selector, view, model, config){
    var modelBinder = this;

    view.$(selector).each(function(index){
      var element = view.$(this);
      var bindingAttr = config.getBindingAttr('checkbox');
      var attribute_name = config.getBindingValue(element, 'checkbox');

      // bind the model changes to the form elements
      modelBinder.checkboxModelChange = function(model, val){
        if (val){
          element.attr("checked", "checked");
        }
        else{
          element.removeAttr("checked");
        }
      };

      model.bind("change:" + attribute_name, modelBinder.checkboxModelChange);

      // bind the form changes to the model
      element.bind("change", function(ev){
        var data = {};
        var changedElement = view.$(ev.target);
        var checked = changedElement.is(":checked")? true : false;
        data[attribute_name] = checked;
        model.set(data);
      });

      // set the default value on the form, from the model
      var attr_exists = model.attributes.hasOwnProperty(attribute_name);
      if (attr_exists) {
        var attr_value = model.get(attribute_name);
        if (typeof attr_value !== "undefined" && attr_value !== null && attr_value != false) {
          element.attr("checked", "checked");
        }
        else{
          element.removeAttr("checked");
        }
      }
    });
  };

  return methods;
})(Backbone);

// ----------------------------
// Data-Bind Binding Methods
// ----------------------------
Backbone.ModelBinding.DataBindBinding = (function(Backbone, _, $){
  var methods = {};

  var dataBindSubstConfig = {
    "default": ""
  };

  Backbone.ModelBinding.Configuration.dataBindSubst = function(config){
    this.storeDataBindSubstConfig();
    _.extend(dataBindSubstConfig, config);
  };

  Backbone.ModelBinding.Configuration.storeDataBindSubstConfig = function(){
    Backbone.ModelBinding.Configuration._dataBindSubstConfig = _.clone(dataBindSubstConfig);
  };

  Backbone.ModelBinding.Configuration.restoreDataBindSubstConfig = function(){
    if (Backbone.ModelBinding.Configuration._dataBindSubstConfig){
      dataBindSubstConfig = Backbone.ModelBinding.Configuration._dataBindSubstConfig;
      delete Backbone.ModelBinding.Configuration._dataBindSubstConfig;
    }
  };

  Backbone.ModelBinding.Configuration.getDataBindSubst = function(elementType, value){
    var returnValue = value;
    if (value === undefined){
      if (dataBindSubstConfig.hasOwnProperty(elementType)){
        returnValue = dataBindSubstConfig[elementType];
      } else {
        returnValue = dataBindSubstConfig["default"];
      }
    }
    return returnValue;
  };

  methods._modelChange = function(model, val){
    methods._setOnElement(this.element, this.elementAttr, val);
  };

  methods._setOnElement = function(element, attr, val){
    var valBefore = val;
    val = Backbone.ModelBinding.Configuration.getDataBindSubst(attr, val);
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
      case "displayed":
        element.css("display", val ? 'block' : 'none' );
        break;
      case "hidden":
        element.css("display", val ? 'none' : 'block' );
        break;
      default:
        element.attr(attr, val);
    }
  };

  methods._splitBindingAttr = function(element)
  {
    var dataBindConfigList = [];
    var databindList = element.attr("data-bind").split(";");
    _.each(databindList, function(attrbind){
      var databind = $.trim(attrbind).split(" ");

      // make the default special case "text" if none specified
      if( databind.length == 1 ) databind.unshift("text");

      dataBindConfigList.push({
        elementAttr: databind[0],
        modelAttr: databind[1]
      });
    });
    return dataBindConfigList;
  };

  methods.bind = function(selector, view, model){
    view.$(selector).each(function(index){
      var element = view.$(this);
      var databindList = methods._splitBindingAttr(element);

      _.each(databindList, function(databind){
        var context = {
          element: element,
          elementAttr: databind.elementAttr
        };
        model.bind("change:" + databind.modelAttr, methods._modelChange, context);

        // set default on data-bind element
        methods._setOnElement(element, databind.elementAttr, model.get(databind.modelAttr));
      });
    });
  };

  methods.unbind = function(selector, view, model){
    view.$(selector).each(function(index){
      var element = view.$(this);
      var databindList = methods._splitBindingAttr(element);
      _.each(databindList, function(databind){
        model.unbind("change:" + databind.modelAttr, methods._modelChange);
      });
    });
  };

  return methods;
})(Backbone, _, $);


// ----------------------------
// Binding Conventions
// ----------------------------
Backbone.ModelBinding.Conventions = {
  text: {selector: "input:text", handler: Backbone.ModelBinding.StandardBinding},
  textarea: {selector: "textarea", handler: Backbone.ModelBinding.StandardBinding},
  password: {selector: "input:password", handler: Backbone.ModelBinding.StandardBinding},
  radio: {selector: "input:radio", handler: Backbone.ModelBinding.RadioGroupBinding},
  checkbox: {selector: "input:checkbox", handler: Backbone.ModelBinding.CheckboxBinding},
  select: {selector: "select", handler: Backbone.ModelBinding.SelectBoxBinding},
  //databind: { selector: "*[data-bind]", handler: Backbone.ModelBinding.DataBindBinding}
};
