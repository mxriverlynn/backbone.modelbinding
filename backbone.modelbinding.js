(function(){

  function bidirectionalBinding(field, element, model){
    // bind the model changes to the form elements
    model.bind("change:" + field, function(changed_model, val){
      element.val(val);
    });

    // bind the form changes to the model
    element.bind("change", function(ev){
      data = {};
      data[field] = $(ev.target).val();
      model.set(data);
    });

    // set the default value on the form, from the model
    var attr_value = model.get(field);
    if (attr_value) {
      element.val(attr_value);
    }
  }

  function handleConventionBindings(view, model){
    this.$("input").each(function(index){
      var element = $(this);
      var field = element.attr('id');

      bidirectionalBinding(field, element, model);
    });
  }

  function handleFormBindings(view, model){
    _.each(view.formBindings, function(field, selector_event){
      var selector_parts = selector_event.split(" ");
      var e = selector_parts[0];
      var selector = selector_parts[1];
      var element = $(selector);

      bidirectionalBinding(field, element, model);
    }, view);
  }

  function handleHtmlBindings(view, model){
    _.each(view.htmlBindings, function(field, htmlElement){
      // bind the model changes to the form elements
      model.bind("change:" + field, function(changed_model, val){
        $(htmlElement).html(val);
      });
    }, view);
  }

  this.ModelBinding = function(){
    handleFormBindings(this, this.model);
    handleHtmlBindings(this, this.model);
    handleConventionBindings(this, this.model);
  };

}).call(Backbone);

