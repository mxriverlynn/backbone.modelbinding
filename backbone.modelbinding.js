// Backbone.ModelBinding v0.4.2
//
// Copyright (C)2011 Derick Bailey, Muted Solutions, LLC
// Distributed Under MIT Liscene
//
// Documentation and Full Licence Availabe at:
// http://github.com/derickbailey/backbone.modelbinding

// ----------------------------
// Backbone.ModelBinding
// ----------------------------

;(function(root){

var modelbinding = (function(Backbone, _, $) {
  var modelBinding = {
    version: "0.4.2",

    bind: function(view, options){
      view.modelBinder = new ModelBinder(view, options);
      view.modelBinder.bind();
    },

    unbind: function(view){
      if (view.modelBinder){
        view.modelBinder.unbind()
      }
    }
  };

  var ModelBinder = function(view, options){
    this.config = new modelBinding.Configuration(options);
    this.modelBindings = [];
    this.elementBindings = [];

    this.bind = function(){
      var conventions = modelBinding.Conventions;
      for (var conventionName in conventions){
        if (conventions.hasOwnProperty(conventionName)){
          var conventionElement = conventions[conventionName];
          var handler = conventionElement.handler;
          var conventionSelector = conventionElement.selector;
          handler.bind.call(this, conventionSelector, view, view.model, this.config);
        }
      }
    };

    this.unbind = function(){
      // unbind the html element bindings
      _.each(this.elementBindings, function(binding){
        binding.element.unbind(binding.eventName, binding.callback);
      });

      // unbind the model bindings
      _.each(this.modelBindings, function(binding){
        binding.model.unbind(binding.eventName, binding.callback);
      });
    };

    this.registerModelBinding = function(model, attribute_name, callback){
      // bind the model changes to the form elements
      var eventName = "change:" + attribute_name;
      model.bind(eventName, callback);
      this.modelBindings.push({model: model, eventName: eventName, callback: callback});
    };

    this.registerElementBinding = function(element, callback){
      // bind the form changes to the model
      element.bind("change", callback);
      this.elementBindings.push({element: element, eventName: "change", callback: callback});
    };

    this.getAttributes = function(attributes, attr_name, value) {
      var tree = attributes;
      var matches = attr_name.match(/[^\[\]]+/g);

      (function(t) {
        for (var i = 0, length = matches.length - 1; i < length; i++) {
          t = t[matches[i]] = t[matches[i]] || {};
        }
        t[matches[matches.length - 1]] = value;
      })(tree);

      return tree;
    };

    this.getModelValue = function(attributes, attr_name) {
      var matches = attr_name.match(/[^\[\]]+/g);
      var tree = attributes;

      for(var i = 0, length = matches.length; i < length; i++) {
        tree = tree[matches[i]];
        if (typeof(tree) === 'undefined') {
          break;
        }
      }

      return tree;
    };

  };

  // ----------------------------
  // Model Binding Configuration
  // ----------------------------
  modelBinding.Configuration = function(options){
    this.bindingAttrConfig = {};

    _.extend(this.bindingAttrConfig,
      modelBinding.Configuration.bindindAttrConfig,
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
      var attr_name = element.attr(bindingAttr);
      if (typeof(attr_name) === 'undefined') {
        attr_name = element.attr(modelBinding.Configuration.originalConfig[type]);
      }
      return attr_name;
    };
  };

  modelBinding.Configuration.bindindAttrConfig = {
    text: "name",
    textarea: "name",
    password: "name",
    radio: "name",
    checkbox: "name",
    select: "name",
    number: "name",
    range: "name",
    tel: "name",
    search: "name",
    url: "name",
    email: "name"
  };

  modelBinding.Configuration.store = function(){
    modelBinding.Configuration.originalConfig = _.clone(modelBinding.Configuration.bindindAttrConfig);
  };

  modelBinding.Configuration.restore = function(){
    modelBinding.Configuration.bindindAttrConfig = modelBinding.Configuration.originalConfig;
  };

  modelBinding.Configuration.configureBindingAttributes = function(options){
    if (options.all){
      this.configureAllBindingAttributes(options.all);
      delete options.all;
    }
    _.extend(modelBinding.Configuration.bindindAttrConfig, options);
  };

  modelBinding.Configuration.configureAllBindingAttributes = function(attribute){
    var config = modelBinding.Configuration.bindindAttrConfig;
    config.text = attribute;
    config.textarea = attribute;
    config.password = attribute;
    config.radio = attribute;
    config.checkbox = attribute;
    config.select = attribute;
    config.number = attribute;
    config.range = attribute;
    config.tel = attribute;
    config.search = attribute;
    config.url = attribute;
    config.email = attribute;
  };

  // ----------------------------
  // Text, Textarea, and Password Bi-Directional Binding Methods
  // ----------------------------
  var StandardBinding = (function(Backbone){
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

    methods.bind = function(selector, view, model, config){
      var modelBinder = this;

      view.$(selector).each(function(index){
        var element = view.$(this);
        var elementType = _getElementType(element);
        var attribute_name = config.getBindingValue(element, elementType);

        var modelChange = function(changed_model, val){ element.val(val); };

        var setModelValue = function(attr_name, value){
          var tree = modelBinder.getAttributes(model.attributes, attr_name, value);
          model.set(tree);
        };

        var elementChange = function(ev){
          var attribute_name = config.getBindingValue(element, elementType);
          setModelValue(attribute_name, view.$(ev.target).val());
        };

        modelBinder.registerModelBinding(model, attribute_name, modelChange);

        var attr_value = modelBinder.getModelValue(model.attributes, attribute_name);
        if (typeof attr_value !== "undefined" && attr_value !== null) {
          element.val(attr_value);
          element.trigger('change');
        } else {
          var elVal = element.val();
          if (elVal){
            setModelValue(attribute_name, elVal);
          }
        }

        modelBinder.registerElementBinding(element, elementChange);
      });

    };

    return methods;
  })(Backbone);

  // ----------------------------
  // Select Box Bi-Directional Binding Methods
  // ----------------------------
  var SelectBoxBinding = (function(Backbone){
    var methods = {};

    methods.bind = function(selector, view, model, config){
      var modelBinder = this;

      view.$(selector).each(function(index){
        var element = view.$(this);
        var attribute_name = config.getBindingValue(element, 'select');

        var modelChange = function(changed_model, val){ element.val(val); };

        var setModelValue = function(attr, val){
          var data = modelBinder.getAttributes(model.attributes, attr, val);
          model.set(data);
        };

        var elementChange = function(ev){
          var element = view.$(ev.target);
          var attribute_name = config.getBindingValue(element, 'select');
          var value = element.val();
          setModelValue(attribute_name, value);
        };

        modelBinder.registerModelBinding(model, attribute_name, modelChange);

        // set the default value on the form, from the model
        var attr_value = modelBinder.getModelValue(model.attributes, attribute_name);
        if (typeof attr_value !== "undefined" && attr_value !== null) {
          element.val(attr_value);
          element.trigger('change');
        }

        // set the model to the form's value if there is no model value
        if (element.val() != attr_value) {
          var value = element.val();
          setModelValue(attribute_name, value);
        }

        modelBinder.registerElementBinding(element, elementChange);
      });
    };

    return methods;
  })(Backbone);

  // ----------------------------
  // Radio Button Group Bi-Directional Binding Methods
  // ----------------------------
  var RadioGroupBinding = (function(Backbone){
    var methods = {};

    methods.bind = function(selector, view, model, config){
      var modelBinder = this;

      var foundElements = [];
      view.$(selector).each(function(index){
        var element = view.$(this);

        var group_name = config.getBindingValue(element, 'radio');
        if (!foundElements[group_name]) {
          foundElements[group_name] = true;
          var bindingAttr = config.getBindingAttr('radio');

          var modelChange = function(model, val){
            var value_selector = "input[type=radio][" + bindingAttr + "=" + group_name + "][value='" + val + "']";
            view.$(value_selector).attr("checked", "checked");
          };
          modelBinder.registerModelBinding(model, group_name, modelChange);

          var setModelValue = function(attr, val){
            var data = modelBinder.getAttributes(model.attributes, attr, val);
            model.set(data);
          };

          // bind the form changes to the model
          var elementChange = function(ev){
            var element = view.$(ev.currentTarget);
            var attribute_name = config.getBindingValue(element, 'radio');
            if (element.is(":checked")){
              setModelValue(attribute_name, element.val());
            }
          };
 
          var attr_value = modelBinder.getModelValue(model.attributes, group_name);
          if (typeof attr_value !== "undefined" && attr_value !== null) {
            // set the default value on the form, from the model
            var value_selector = "input[type=radio][" + bindingAttr + "=" + group_name + "][value='" + attr_value + "']";
            var element = view.$(value_selector);
            element.attr("checked", "checked");
            element.trigger('change');
          } else {
            // set the model to the currently selected radio button
            var value_selector = "input[type=radio][" + bindingAttr + "=" + group_name + "]:checked";
            var value = view.$(value_selector).val();
            setModelValue(group_name, value);
          }

          var group_selector = "input[type=radio][" + bindingAttr + "=" + group_name + "]";
          view.$(group_selector).each(function(){
            var groupEl = $(this);
            modelBinder.registerElementBinding(groupEl, elementChange);
          });
        }
      });
    };

    return methods;
  })(Backbone);

  // ----------------------------
  // Checkbox Bi-Directional Binding Methods
  // ----------------------------
  var CheckboxBinding = (function(Backbone){
    var methods = {};

    methods.bind = function(selector, view, model, config){
      var modelBinder = this;

      view.$(selector).each(function(index){
        var element = view.$(this);
        var bindingAttr = config.getBindingAttr('checkbox');
        var attribute_name = config.getBindingValue(element, 'checkbox');

        var modelChange = function(model, val){
          if (val){
            element.attr("checked", "checked");
          }
          else{
            element.removeAttr("checked");
          }
        };

        var setModelValue = function(attr_name, value){
          var data = modelBinder.getAttributes(model.attributes, attr_name, value);
          model.set(data);
        };

        var elementChange = function(ev){
          var element = view.$(ev.target);
          var attribute_name = config.getBindingValue(element, 'checkbox');
          var checked = element.is(":checked")? true : false;
          setModelValue(attribute_name, checked);
        };

        modelBinder.registerModelBinding(model, attribute_name, modelChange);

        var attr_exists = model.attributes.hasOwnProperty(attribute_name);
        if (attr_exists) {
          // set the default value on the form, from the model
          var attr_value = modelBinder.getModelValue(model.attributes, attribute_name);
          if (typeof attr_value !== "undefined" && attr_value !== null && attr_value != false) {
            element.attr("checked", "checked");
          }
          else{
            element.removeAttr("checked");
          }
          element.trigger('change');
        } else {
          // bind the form's value to the model
          var checked = element.is(":checked")? true : false;
          setModelValue(attribute_name, checked);
        }
        
        modelBinder.registerElementBinding(element, elementChange);
      });
    };

    return methods;
  })(Backbone);

  // ----------------------------
  // Data-Bind Binding Methods
  // ----------------------------
  var DataBindBinding = (function(Backbone, _, $){
    var dataBindSubstConfig = {
      "default": ""
    };

    modelBinding.Configuration.dataBindSubst = function(config){
      this.storeDataBindSubstConfig();
      _.extend(dataBindSubstConfig, config);
    };

    modelBinding.Configuration.storeDataBindSubstConfig = function(){
      modelBinding.Configuration._dataBindSubstConfig = _.clone(dataBindSubstConfig);
    };

    modelBinding.Configuration.restoreDataBindSubstConfig = function(){
      if (modelBinding.Configuration._dataBindSubstConfig){
        dataBindSubstConfig = modelBinding.Configuration._dataBindSubstConfig;
        delete modelBinding.Configuration._dataBindSubstConfig;
      }
    };

    modelBinding.Configuration.getDataBindSubst = function(elementType, value){
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

    setOnElement = function(element, attr, val){
      var valBefore = val;
      val = modelBinding.Configuration.getDataBindSubst(attr, val);
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
          element[val? "show" : "hide"]();
          break;
        case "hidden":
          element[val? "hide" : "show"]();
          break;
        default:
          element.attr(attr, val);
      }
    };

    splitBindingAttr = function(element)
    {
      var dataBindConfigList = [];
      var dataBindAttributeName = modelBinding.Conventions.databind.selector.replace(/^(.*\[)([^\]]*)(].*)/g, '$2');
      var databindList = element.attr(dataBindAttributeName).split(";");
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

    var methods = {};

    methods.bind = function(selector, view, model, config){
      var modelBinder = this;

      view.$(selector).each(function(index){
        var element = view.$(this);
        var databindList = splitBindingAttr(element);

        _.each(databindList, function(databind){
          var modelChange = function(model, val){
            setOnElement(element, databind.elementAttr, val);
          };

          modelBinder.registerModelBinding(model, databind.modelAttr, modelChange);

          // set default on data-bind element
          setOnElement(element, databind.elementAttr, model.get(databind.modelAttr));
        });

      });
    };

    return methods;
  })(Backbone, _, $);


  // ----------------------------
  // Binding Conventions
  // ----------------------------
  modelBinding.Conventions = {
    text: {selector: "input:text", handler: StandardBinding},
    textarea: {selector: "textarea", handler: StandardBinding},
    password: {selector: "input:password", handler: StandardBinding},
    radio: {selector: "input:radio", handler: RadioGroupBinding},
    checkbox: {selector: "input:checkbox", handler: CheckboxBinding},
    select: {selector: "select", handler: SelectBoxBinding},
    databind: { selector: "*[data-bind]", handler: DataBindBinding},
    // HTML5 input
    number: {selector: "input[type=number]", handler: StandardBinding},
    range: {selector: "input[type=range]", handler: StandardBinding},
    tel: {selector: "input[type=tel]", handler: StandardBinding},
    search: {selector: "input[type=search]", handler: StandardBinding},
    url: {selector: "input[type=url]", handler: StandardBinding},
    email: {selector: "input[type=email]", handler: StandardBinding}
  };

  return modelBinding;
});

// Backbone.Modelbinding AMD wrapper with namespace fallback
if (typeof define === 'function' && define.amd) {
    // AMD support
    define([
      'backbone',    // use Backbone 0.5.3-optamd3 branch (https://github.com/jrburke/backbone/tree/optamd3)
      'underscore',  // AMD supported
      'jquery'       // AMD supported
      ], function (Backbone, _, jQuery) {
        return modelbinding(Backbone, _, jQuery);
      });
} else {
    // No AMD, use Backbone namespace
    root.Backbone = Backbone || {};
    root.Backbone.ModelBinding = modelbinding(Backbone, _, jQuery);
}

})(this);
