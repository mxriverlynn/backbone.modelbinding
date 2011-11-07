AModel = Backbone.Model.extend({});

AView = Backbone.View.extend({
  render: function(){
    var html = $("\
      <img id='avatar' data-bind='src url; class name'>\
      <input id='noType'>\
      <div id='showHideThing' data-bind='displayed isValid' />\
      <div id='showHideAnotherThing' data-bind='hidden isValid' />\
      <button id='unclicker' data-bind='disabled isValid'>Click Me!</button>\
      <button id='clicker' data-bind='enabled isValid'>Click Me!</button>\
      <div id='villain' data-bind='html villain'><p>test</p></div>\
      <div id='doctor_no_elem' data-bind='doctor'>Seuss</div>\
      <div id='doctor' data-bind='text doctor'>Seuss</div>\
      <div id='pet' data-bind='someAttr pet' someAttr='Cat'></div>\
      <input type='text' id='super_hero_weakness' modelAttr='weakness'>\
      <input type='text' id='something'> \
      <div id='showIt'></div>\
      <input type='text' id='name'>\
      <select id='operating_system'> \
        <option value='osx'>osx</option> \
        <option value='windows'>windows</option> \
        <option value='linux'>linux</option> \
      </select> \
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
      <input type='checkbox' id='motorcycle_license' value='yes' checked='checked'>\
      <input type='checkbox' id='binary_checkbox' value='yes'>\
      <textarea id='bio'></textarea>\
      <p id='aParagraph'></p>\
      <input type='password' id='password'>\
      <input type='number' id='number'>\
      <input type='range' id='range' min='0' max='98765'>\
      <input type='email' id='email'>\
      <input type='url' id='url'>\
      <input type='tel' id='tel'>\
      <input type='search' id='search'>\
      ");
    this.$(this.el).append(html);
    Backbone.ModelBinding.bind(this);
  }
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

    Backbone.ModelBinding.bind(this, {all: "class"});
  }
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

    Backbone.ModelBinding.bind(this);
  }
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

    Backbone.ModelBinding.bind(this, {
      text: 'class',
      textarea: 'class',
      password: 'class',
      radio: 'class',
      select: 'class',
      checkbox: 'class',
    });
  }
});
