(function(){

  function handleInputBindings(view, model){
    _.each(view.inputBindings, function(field, selector_event){
      var selector_parts = selector_event.split(" ");
      var e = selector_parts[0];
      var selector = selector_parts[1];

      // bind the model changes to the form elements
      model.bind("change:" + field, function(changed_model, val){
        $(selector).val(val);
      });

      // bind the form changes to the model
      $(selector).bind(e, function(ev){
        data = {};
        data[field] = $(ev.target).val();
        model.set(data);
      });

      // set the default value on the form, from the model
      $(selector).val(model.get(field));
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

  function handleConventionBindings(view, model){
    var attrs = model.toJSON();
    _.each(attrs, function(value, field){

      var element = $("#" + field);
      if (element.length == 0)
        return null;

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
      element.val(model.get(field));
    }, view);
  }

  this.ModelBinding = function(){
    handleInputBindings(this, this.model);
    handleHtmlBindings(this, this.model);
    handleConventionBindings(this, this.model);
  };

}).call(Backbone);

