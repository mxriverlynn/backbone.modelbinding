describe("select element convention binding", function(){
  beforeEach(function(){
    this.model = new AModel({
      name: "Ashelia Bailey", 
      education: "graduate", 
      age_level: 0,
      graduated: "maybe",
      us_citizen: false,
      drivers_license: true,
      motorcycle_license: false,
      bio: "my baby girl",
      operating_system: "non existent value"
    });
    this.view = new AView({model: this.model});
    this.view.render();
  });

  it("bind view changes to the model's field, by convention of id", function(){
    var el = this.view.$("#education");
    el.val("college");
    el.trigger('change');

    expect(this.model.get('education')).toEqual("college");
  });

  it("bind model field changes to the form input, by convention of id", function(){
    this.model.set({education: "high school"});
    var el = this.view.$("#education");
    expect(el.val()).toEqual("high school");
  });

  it("binds the model's value to the form field on render (education)", function(){
    var el = this.view.$("#education");
    expect(el.val()).toEqual("graduate");
  });

  it("binds the model's value to the form field on render (age_level)", function(){
    var el = this.view.$("#age_level");
    expect(el.val()).toEqual("0");
  });

  it("applies the text of the selection to the model", function(){
    var el = this.view.$("#education");
    el.val("grade_school");
    el.trigger('change');

    expect(this.model.get('education_text')).toEqual("i dun learned at grade skool");
  });
  
  it("applies the text of multiple selections to the model", function(){
    var el = this.view.$("#multiple_select");
    el.val(["selection_1", "selection_2"]);
    el.trigger('change');

    expect(this.model.get('multiple_select_text')).toEqual(["Selection 1", "Selection 2"]);
  });

  it("updates the model to the selected value when the model is set to a value that doesn't exist, on render", function(){
    var el = this.view.$("#operating_system");
    var elVal = el.val();

    expect(this.model.get('operating_system')).toEqual(elVal);
  });

  it("binds the select box value to the model, when there is no model value, on render", function(){
    expect(this.model.get("another_select")).toEqual("pre_selected");
  });
});
