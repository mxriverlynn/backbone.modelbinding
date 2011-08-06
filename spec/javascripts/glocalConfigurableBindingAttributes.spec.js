describe("globalConfigurableBindingAttributes", function(){
  beforeEach(function(){
    Backbone.ModelBinding.configure({text: "modelAttr"});

    this.model = new AModel({ weakness: "liver & onions" });
    this.view = new AView({model: this.model});
    this.view.render();
  });

  describe("text element binding with global configuration of convention attribute", function(){
    beforeEach(function(){
    });

    it("bind view changes to the model's field, by configurable convention", function(){
      var el = this.view.$("#super_hero_weakness");
      el.val("spinach");
      el.trigger('change');

      expect(this.model.get('weakness')).toEqual("spinach");
    });

    it("bind model field changes to the form input, by convention of id", function(){
	  this.model.set({weakness: "broccoli"});
      var el = this.view.$("#super_hero_weakness");
      expect(el.val()).toEqual("broccoli");
    });

    it("binds the model's value to the form field on render", function(){
      var el = this.view.$("#super_hero_weakness");
      expect(el.val()).toEqual("liver & onions");
    });
  });
  
});
