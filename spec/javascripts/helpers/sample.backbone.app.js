AModel = Backbone.Model.extend({});

AView = Backbone.View.extend({
  formBindings: {
    "#something": "a_field"
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
        <option value='none'>none</option> \
        <option value='grade_school'>i dun learned at grade skool</option> \
        <option value='high school'>high school</option> \
        <option value='college'>college</option> \
        <option value='graduate'>graduate</option> \
      </select> \
      <input type='radio' id='graduated_yes' name='graduated' value='yes'>\
      <input type='radio' id='graduated_no' name='graduated' value='no'>\
      <input type='radio' id='graduated_maybe' name='graduated' value='maybe'>\
      <input type='checkbox' id='drivers_license' value='yes'>\
      <textarea id='bio'></textarea>\
      <p id='aParagraph'></p>\
    ");
    this.$(this.el).append(html);
    Backbone.ModelBinding.call(this);
  },
});

AnotherView = Backbone.View.extend({
  formBindings: {
    "#something": "a_field"
  },

  htmlBindings: {
    "#showIt": "a_field"
  },

  render: function(){
    var html = $("\
      <input type='text' class='super_power'>\
    ");
    this.$(this.el).append(html);
	Backbone.ModelBinding.call(this, {standardAttribute: 'class'});
  },
});
