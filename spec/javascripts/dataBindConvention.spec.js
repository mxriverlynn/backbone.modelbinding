describe("data-bind conventions", function(){
  beforeEach(function(){
    this.model = new AModel({
      villain: "mrMonster",
      doctor: "Seuss",
      pet: "cat"
    });
    this.view = new AView({model: this.model});
  });

  describe("when a data-bind is configured to set html", function(){
    beforeEach(function(){
      this.view.render();
    });

    it("should set the element's contents to the model's property value immediately", function(){
      var el = this.view.$("#villain");
      expect(el.html()).toBe("mrMonster");
    });

    it("should replace the contents of the element when the model's property changes", function(){
      this.model.set({villain: "boogerFace"});
      var el = this.view.$("#villain");
      expect(el.html()).toBe("boogerFace");
    });
  });

  describe("when a data-bind is configured to set text", function(){
    beforeEach(function(){
      this.view.render();
    });

    it("should set the element's text to the model's property value immediately", function(){
      var el = this.view.$("#doctor");
      expect(el.text()).toBe("Seuss");
    });

    it("should set the text of the element when the model's property changes", function(){
      this.model.set({doctor: "Who"});
      var el = this.view.$("#doctor");
      expect(el.text()).toBe("Who");
    });
  });

  describe("when a data-bind is configured to set an arbitrary attribute", function(){
    beforeEach(function(){
      this.view.render();
    });

    it("should set the element's attribute to the model's property value immediately", function(){
      var el = this.view.$("#pet");
      expect(el.attr("someAttr")).toBe("cat");
    });

    it("should set the value of the attribute", function(){
      this.model.set({pet: "bunnies"});
      var el = this.view.$("#pet");
      expect(el.attr("someAttr")).toBe("bunnies");
    });
  });
});
