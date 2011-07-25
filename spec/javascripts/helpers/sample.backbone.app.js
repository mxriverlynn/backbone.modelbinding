AModel = Backbone.Model.extend({});

AView = Backbone.View.extend({
  formBindings: {
    "change #something": "a_field"
  },

  htmlBindings: {
    "#showIt": "a_field"
  },

  render: function(){
    var html = $("\
      <input type='text' id='something'> \
      <div id='showIt'></div>\
      <input type='text' id='name'>\
      <select id='education'> \
        <option value='high school'>high school</option> \
        <option value='college'>college</option> \
        <option value='graduate'>graduate</option> \
      </select> \
    ");
    this.$(this.el).append(html);
    Backbone.ModelBinding.call(this);
  },
});
