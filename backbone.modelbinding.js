// Backbone.ModelBinding v0.1.2
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
  var standardAttr = "id";
  var radioAttr = "name";
  var checkboxAttr = "id";
  
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
    version: "0.1.2",

	standardAttr: function(){return standardAttr;},
	radioAttr: function(){return radioAttr;},
	checkboxAttr: function(){return checkboxAttr;},
	
	configureCall: function(options){
	  if (options != null) {
	    options.standardAttribute = options.standardAttribute ? options.standardAttribute : standardAttr;
	    options.radioAttribute = options.radioAttribute ? options.radioAttribute : radioAttr;
	    options.checkboxAttribute = options.checkboxAttribute ? options.checkboxAttribute : checkboxAttr;
		this.options = options;
		this.is_configured = true;
	  }
	},
	
	configure: function(options){
	  if (options != null) {
		standardAttr = options.standardAttribute ? options.standardAttribute : standardAttr;
		radioAttr = options.radioAttribute ? options.radioAttribute : radioAttr;
		checkboxAttr = options.checkboxAttribute ? options.checkboxAttribute : checkboxAttr;
	  }
	},
	
	resetCallConfiguration: function(){
	  this.options = null;
	  this.is_configured = false;
	},
	
    call: function(view, options){
	  this.configureCall(options);
	  handleFormBindings(view, view.model);
      handleHtmlBindings(view, view.model);
      handleConventionBindings(view, view.model);
	  this.resetCallConfiguration();
    }
  }
})();

// ----------------------------
// Form Field Conventions
// ----------------------------
Backbone.ModelBinding.Conventions = (function(){
  var StandardInput = {
    bind: function(selector, view, model){
      view.$(selector).each(function(index){
        var element = view.$(this);
		var field = getBindingAttribute(element, 'standard');
        Backbone.ModelBinding.HelperMethods.bidirectionalBinding.call(view, field, element, model);
      });
    }
  };

  var SelectBox = {
    bind: function(selector, view, model){
      view.$(selector).each(function(index){
        var element = view.$(this);
        var field = element.attr('id');
        Backbone.ModelBinding.HelperMethods.bidirectionalSelectBinding.call(view, field, element, model);
      });
    }
  };

  var RadioGroup = {
    bind: function(selector, view, model){
      var self = this;
      var foundElements = [];
      view.$(selector).each(function(index){
        var element = view.$(this);
		var group_name = getBindingAttribute(element, 'radio');
        if (!foundElements[group_name]) {
          foundElements[group_name] = true;
          Backbone.ModelBinding.HelperMethods.bidirectionalRadioGroupBinding.call(view, group_name, model);
        }
      });
    }
  };

  var Checkbox = {
    bind: function(selector, view, model){
      var self = this;
      view.$(selector).each(function(index){
        var element = view.$(this);
		var field = getBindingAttribute(element, 'checkbox');
        Backbone.ModelBinding.HelperMethods.bidirectionalCheckboxBinding.call(view, field, element, model);
      });
    }
  };
  
  function getBindingAttribute(element, type){
	var bindingAttr = Backbone.ModelBinding.is_configured ? 
		Backbone.ModelBinding.options[type + 'Attribute'] : Backbone.ModelBinding[type + 'Attr']();
	return element.attr(bindingAttr);
  }

  return {
    text: {selector: "input[type=text]", handler: StandardInput}, 
    password: {selector: "input[type=password]", handler: StandardInput},
    radio: {selector: "input[type=radio]", handler: RadioGroup},
    checkbox: {selector: "input[type=checkbox]", handler: Checkbox},
    select: {selector: "select", handler: SelectBox},
    textarea: {selector: "textarea", handler: StandardInput},
  }
})();

// ----------------------------
// Helper Methods:
// common methods used in conventions
// and non-conventional bindings
// ----------------------------
Backbone.ModelBinding.HelperMethods = (function(){

  return {
    bidirectionalBinding: function(attribute_name, element, model){
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

    bidirectionalSelectBinding: function(attribute_name, element, model){
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

    bidirectionalRadioGroupBinding: function(group_name, model){
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
    },

    bidirectionalCheckboxBinding: function(attribute_name, element, model){
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
    },

  }

})();
