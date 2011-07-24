AModel = Backbone.Model.extend({});

AView = Backbone.View.extend({
  modelBindings: {
    "change #something": "a_field"
  },

  render: function(){
    this.html = $("<input type='text' id='something'>");
    $("body").append(this.html);
    Backbone.ModelBinding.call(this);
  },

  close: function(){
    this.html.remove();
  }
});
