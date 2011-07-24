AModel = Backbone.Model.extend({});

AView = Backbone.View.extend({
  el: "body",

  formBindings: {
    "change #something": "a_field"
  },

  htmlBindings: {
    "#showIt": "a_field"
  },

  render: function(){
    this.html = $("<input type='text' id='something'> <div id='showIt'></div> <input type='text' id='name'>");
    $("body").append(this.html);
    Backbone.ModelBinding.call(this);
  },

  close: function(){
    this.html.remove();
  }
});
