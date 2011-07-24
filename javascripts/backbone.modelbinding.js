(function(Backbone){
  Backbone.Modelbinding = {
    render: function(){
      if (!this.model)
        return this;

      if (!this.modelBindings)
        return this;

      var self = this;
      var model = this.model;

      _.each(this.modelBindings, function(field, selector_event){
        var selector_parts = selector_event.split(" ");
        var e = selector_parts[0];
        var selector = selector_parts[1];

        // bind the model changes to the form elements
        model.bind("change:" + field, function(changed_model, val){
          self.$(selector).val(val);
        });

        // bind the form changes to the model
        $(selector).bind(e, function(ev){
          data = {};
          data[field] = $(ev.target).val();
          model.set(data, {silent: true});
        });

        // set the default value on the form, from the model
        this.$(selector).val(model.get(field));
      }, this);

      Backbone.View.prototype.render();
    }
  };

}).call(Backbone);

