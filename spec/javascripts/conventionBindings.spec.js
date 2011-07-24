describe("conventionBindings", function(){
  beforeEach(function(){
    this.model = new AModel({name: "Ashelia Bailey"});
    this.view = new AView({model: this.model});
    this.view.render();
  });

  afterEach(function(){
    this.view.close();
  });
  
  it("bind view changes to the model's field, by convention of id", function(){
    var something = $("#name");
    something.val("Derick Bailey");
    something.trigger('change');

    expect(this.model.get('name')).toEqual("Derick Bailey");
  });

  it("bind model field changes to the form input, by convention of id", function(){
    this.model.set({name: "Ian Bailey"});
    var something = $("#name");
    expect(something.val()).toEqual("Ian Bailey");
  });

  it("binds the model's value to the form field on render", function(){
    var something = $("#name");
    expect(something.val()).toEqual("Ashelia Bailey");
  });
});
