AModel = Backbone.Model.extend({});

AView = Backbone.View.extend({
  render: function(){
    var html = $("\
      <div id='villain' data-bind='html villain'><p>test</p></div>\
      <div id='doctor' data-bind='text doctor'>Seuss</div>\
      <div id='pet' data-bind='someAttr pet' someAttr='Cat'></div>\
      <input type='text' id='super_hero_weakness' modelAttr='weakness'>\
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
      <select id='age_level'> \
        <option value=''>-- select --</option> \
        <option value='0'>under 20</option> \
        <option value='21'>21 - 40</option> \
        <option value='41'>over 41</option> \
      </select> \
      <input type='radio' id='graduated_yes' name='graduated' value='yes'>\
      <input type='radio' id='graduated_no' name='graduated' value='no'>\
      <input type='radio' id='graduated_maybe' name='graduated' value='maybe'>\
      <input type='radio' id='us_citizen_true' name='us_citizen' value='true'>\
      <input type='radio' id='us_citizen_false' name='us_citizen' value='false'>\
      <input type='checkbox' id='drivers_license' value='yes'>\
      <textarea id='bio'></textarea>\
      <p id='aParagraph'></p>\
    ");
    this.$(this.el).append(html);
    Backbone.ModelBinding.call(this);
  },
});

AllBindingAttributesView = Backbone.View.extend({
  render: function(){
    var html = $("\
      <input type='text' id='v_name' class='name'> \
      <select id='v_education' class='education'> \
        <option value='none'>none</option> \
        <option value='grade_school'>i dun learned at grade skool</option> \
        <option value='high school'>high school</option> \
        <option value='college'>college</option> \
        <option value='graduate'>graduate</option> \
      </select> \
      <input type='radio' id='graduated_yes' name='graduated' class='graduated' value='yes'>\
      <input type='radio' id='graduated_no' name='graduated' class='graduated' value='no'>\
      <input type='radio' id='graduated_maybe' name='graduated' class='graduated' value='maybe'>\
      <input type='checkbox' id='v_drivers_license' class='drivers_license' value='yes'>\
      <textarea id='v_bio' class='bio'></textarea>\
    ");
    this.$(this.el).append(html);

    Backbone.ModelBinding.call(this, {all: "class"});
  },
});

GlobalAllBindingAttributesView = Backbone.View.extend({
  render: function(){
    var html = $("\
      <input type='text' id='v_name' class='name'> \
      <select id='v_education' class='education'> \
        <option value='none'>none</option> \
        <option value='grade_school'>i dun learned at grade skool</option> \
        <option value='high school'>high school</option> \
        <option value='college'>college</option> \
        <option value='graduate'>graduate</option> \
      </select> \
      <input type='radio' id='graduated_yes' name='graduated' class='graduated' value='yes'>\
      <input type='radio' id='graduated_no' name='graduated' class='graduated' value='no'>\
      <input type='radio' id='graduated_maybe' name='graduated' class='graduated' value='maybe'>\
      <input type='checkbox' id='v_drivers_license' class='drivers_license' value='yes'>\
      <textarea id='v_bio' class='bio'></textarea>\
    ");
    this.$(this.el).append(html);

    Backbone.ModelBinding.call(this);
  },
});

AnotherView = Backbone.View.extend({
  render: function(){
    var html = $("\
      <input type='text' class='super_power' modelAttr='weakness'>\
      <select class='education'> \
        <option value='none'>none</option> \
        <option value='grade_school'>i dun learned at grade skool</option> \
        <option value='high school'>high school</option> \
        <option value='college'>college</option> \
        <option value='graduate'>graduate</option> \
      </select> \
      <input type='radio' id='graduated_yes' class='graduated' value='yes'>\
      <input type='radio' id='graduated_no' class='graduated' value='no'>\
      <input type='radio' id='graduated_maybe' class='graduated' value='maybe'>\
      <input type='checkbox' class='drivers_license' value='yes'>\
    ");

    this.$(this.el).append(html);

    Backbone.ModelBinding.call(this, {
      text: 'class',
      textarea: 'class',
      password: 'class',
      radio: 'class',
      select: 'class',
      checkbox: 'class',
    });

  },
});
