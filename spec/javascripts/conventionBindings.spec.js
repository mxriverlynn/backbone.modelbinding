describe("conventionBindings", function(){
  beforeEach(function(){
    this.model = new AModel({name: "Ashelia Bailey", education: "graduate"});
    this.view = new AView({model: this.model});
    this.view.render();
  });

  describe("input element binding", function(){
    it("bind view changes to the model's field, by convention of id", function(){
      var something = this.view.$("#name");
      something.val("Derick Bailey");
      something.trigger('change');

      expect(this.model.get('name')).toEqual("Derick Bailey");
    });

    it("bind model field changes to the form input, by convention of id", function(){
      this.model.set({name: "Ian Bailey"});
      var something = this.view.$("#name");
      expect(something.val()).toEqual("Ian Bailey");
    });

    it("binds the model's value to the form field on render", function(){
      var something = this.view.$("#name");
      expect(something.val()).toEqual("Ashelia Bailey");
    });
  });

  describe("select element binding", function(){
    it("bind view changes to the model's field, by convention of id", function(){
      var something = this.view.$("#education");
      something.val("college");
      something.trigger('change');

      expect(this.model.get('education')).toEqual("college");
    });

    it("bind model field changes to the form input, by convention of id", function(){
      this.model.set({education: "high school"});
      var something = this.view.$("#education");
      expect(something.val()).toEqual("high school");
    });

    it("binds the model's value to the form field on render", function(){
      var something = this.view.$("#education");
      expect(something.val()).toEqual("graduate");
    });
  });
});
