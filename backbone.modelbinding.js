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

  this.ModelBinding = function(){
    handleFormBindings(this, this.model);
    handleHtmlBindings(this, this.model);
    handleConventionBindings(this, this.model);
  };

}).call(Backbone);

