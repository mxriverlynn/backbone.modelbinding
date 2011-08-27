describe("textbox convention bindings", function(){
  beforeEach(function(){
    this.model = new AModel({
      name: "Ashelia Bailey", 
      noType: 'there is no type'
    });
    this.view = new AView({model: this.model});
    this.view.render();
  });

  describe("text element binding", function(){
    it("bind view changes to the model's field, by convention of id", function(){
      var el = this.view.$("#name");
      el.val("Derick Bailey");
      el.trigger('change');

      expect(this.model.get('name')).toEqual("Derick Bailey");
    });

    it("bind model field changes to the form input, by convention of id", function(){
      this.model.set({name: "Ian Bailey"});
      var el = this.view.$("#name");
      expect(el.val()).toEqual("Ian Bailey");
    });

    it("binds the model's value to the form field on render", function(){
      var el = this.view.$("#name");
      expect(el.val()).toEqual("Ashelia Bailey");
    });
  });

  describe("input with no type specified, binding", function(){
    beforeEach(function(){
      this.el = this.view.$("#noType");
    });

    it("bind view changes to the model's field, by convention of id", function(){
      this.el.val("something changed");
      this.el.trigger('change');

      expect(this.model.get('noType')).toEqual("something changed");
    });

    it("bind model field changes to the form input, by convention of id", function(){
      this.model.set({noType: "Ian Bailey"});
      expect(this.el.val()).toEqual("Ian Bailey");
    });

    it("binds the model's value to the form field on render", function(){
      expect(this.el.val()).toEqual("there is no type");
    });
  });
});
