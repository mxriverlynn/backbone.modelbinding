AModel = Backbone.Model.extend({});

AView = Backbone.View.extend({
  render: function(callback){
    var html = $("\
      <img id='avatar' data-bind='src url; class name'>\
      <input id='noType' name='noType'>\
      <div id='showHideThing' data-bind='displayed isValid' />\
      <div id='showHideAnotherThing' data-bind='hidden isValid' />\
      <button id='unclicker' data-bind='disabled isValid'>Click Me!</button>\
      <button id='clicker' data-bind='enabled isValid'>Click Me!</button>\
      <div id='villain' data-bind='html villain'><p>test</p></div>\
      <div id='doctor_no_elem' data-bind='doctor'>Seuss</div>\
      <div id='doctor_data_bind_bb' data-bind-bb='doctor'>Seuss</div>\
      <div id='doctor' data-bind='text doctor'>Seuss</div>\
      <div id='pet' data-bind='someAttr pet' someAttr='Cat'></div>\
      <input type='text' id='super_hero_weakness' name='super_heroko_weakness' modelAttr='weakness'>\
      <input type='text' id='something' name='something'> \
      <div id='showIt'></div>\
      <input type='text' id='prefilled_name' value='a name' name='prefilled_name'>\
      <input type='text' id='name' name='name'>\
      <select id='operating_system' name='operating_system'> \
        <option value='osx'>osx</option> \
        <option value='windows'>windows</option> \
        <option value='linux'>linux</option> \
      </select> \
      <select id='education' name='education'> \
        <option value='none'>none</option> \
        <option value='grade_school'>i dun learned at grade skool</option> \
        <option value='high school'>high school</option> \
        <option value='college'>college</option> \
        <option value='graduate'>graduate</option> \
      </select> \
      <select id='age_level' name='age_level'> \
        <option value=''>-- select --</option> \
        <option value='0'>under 20</option> \
        <option value='21'>21 - 40</option> \
        <option value='41'>over 41</option> \
      </select> \
      <select id='another_select' name='another_select'> \
        <option value='pre_selected' selected='selected'>pre selected</option> \
        <option value='not_selected'>not selected</option> \
      </select> \
      <input type='radio' id='graduated_yes' name='graduated' value='yes'>\
      <input type='radio' id='graduated_no' name='graduated' value='no'>\
      <input type='radio' id='graduated_maybe' name='graduated' value='maybe'>\
      <input type='radio' id='us_citizen_true' name='us_citizen' value='true'>\
      <input type='radio' id='us_citizen_false' name='us_citizen' value='false'>\
      <input type='radio' id='another_radio_true' name='another_radio' value='true' checked='checked'>\
      <input type='radio' id='another_radio_false' name='another_radio' value='false'>\
      <input type='checkbox' id='drivers_license' value='yes' name='drivers_license'>\
      <input type='checkbox' id='motorcycle_license' value='yes' checked='checked' name='motorcycle_license'>\
      <input type='checkbox' id='binary_checkbox' value='yes' name='binary_checkbox'>\
      <textarea id='bio' name='bio'></textarea>\
      <p id='aParagraph'></p>\
      <input type='password' id='password' name='password'>\
      <input type='number' id='number' name='number'>\
      <input type='range' id='range' min='0' max='98765' name='range'>\
      <input type='email' id='email' name='email'>\
      <input type='url' id='url' name='url'>\
      <input type='tel' id='tel' name='tel'>\
      <input type='search' id='search' name='search'>\
      ");
    this.$(this.el).append(html);

		if (typeof(callback) !== 'undefined') {
			callback.call(this);
		}

    Backbone.ModelBinding.bind(this);
  }
});

AllBindingAttributesView = Backbone.View.extend({
  render: function(){
    var html = $("\
      <input type='text' id='v_name' class='name'> \
      <select id='v_education' class='education' name='education'> \
        <option value='none'>none</option> \
        <option value='grade_school'>i dun learned at grade skool</option> \
        <option value='high school'>high school</option> \
        <option value='college'>college</option> \
        <option value='graduate'>graduate</option> \
      </select> \
      <input type='radio' id='graduated_yes' name='graduated' class='graduated' value='yes'>\
      <input type='radio' id='graduated_no' name='graduated' class='graduated' value='no'>\
      <input type='radio' id='graduated_maybe' name='graduated' class='graduated' value='maybe'>\
      <input type='checkbox' id='v_drivers_license' name='v_drivers_license' class='drivers_license' value='yes'>\
      <textarea id='v_bio' class='bio' name='bio'></textarea>\
    ");
    this.$(this.el).append(html);

    Backbone.ModelBinding.bind(this, {all: "class"});
  }
});

GlobalAllBindingAttributesView = Backbone.View.extend({
  render: function(){
    var html = $("\
      <input type='text' id='v_name' name='v_name' class='name'> \
      <select id='v_education' name='v_education' class='education'> \
        <option value='none'>none</option> \
        <option value='grade_school'>i dun learned at grade skool</option> \
        <option value='high school'>high school</option> \
        <option value='college'>college</option> \
        <option value='graduate'>graduate</option> \
      </select> \
      <input type='radio' id='graduated_yes' name='graduated' class='graduated' value='yes'>\
      <input type='radio' id='graduated_no' name='graduated' class='graduated' value='no'>\
      <input type='radio' id='graduated_maybe' name='graduated' class='graduated' value='maybe'>\
      <input type='checkbox' id='v_drivers_license' name='v_drivers_license' class='drivers_license' value='yes'>\
      <textarea id='v_bio' name='v_bio' class='bio'></textarea>\
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
      <input type='radio' id='graduated_yes' name='graduated' class='graduated' value='yes'>\
      <input type='radio' id='graduated_no' name='graduated' class='graduated' value='no'>\
      <input type='radio' id='graduated_maybe' name='graduated' class='graduated' value='maybe'>\
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

NestedView = Backbone.View.extend({
  render: function() {
    var html = "\
      <input type='text' id='nested_title' name='nested[title]' value='view nested title' />\
      <input type='text' id='another_nested_title' name='another_nested[title]' value='view another nested title' />\
      <input type='text' id='title' name='title' value='view title' />\
      <input type='text' id='nested_nested_attributes_title' name='nested[nested_attributes][title]' value='view nested nested_attributes title' />\
      <select id='nested_graduate' name='nested[graduate]'> \
        <option value='none'>none</option> \
        <option value='grade_school'>i dun learned at grade skool</option> \
        <option value='high school'>high school</option> \
        <option value='college'>college</option> \
        <option value='graduate'>graduate</option> \
      </select> \
      <input type='radio' id='nested_sex_male' name='nested[sex]' value='male'>\
      <input type='radio' id='nested_sex_female' name='nested[sex]' value='female'>\
      <input type='radio' id='nested_sex_not_sure_now' name='nested[sex]' value='not sure now'>\
      <input type='checkbox' id='nested_sex_not_sure_now' name='nested[drunk]' value='yes'>\
    ";

    this.$(this.el).append($(html));

    Backbone.ModelBinding.bind(this);
  }
});
