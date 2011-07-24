(function(){
  this.ModelBinding = function(){
    if (!this.model)
      return this;

    var self = this;
    var model = this.model;

    _.each(this.inputBindings, function(field, selector_event){
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
    }, this);

    _.each(this.htmlBindings, function(field, htmlElement){
      // bind the model changes to the form elements
      model.bind("change:" + field, function(changed_model, val){
        $(htmlElement).html(val);
      });
    }, this);
  };

}).call(Backbone);

