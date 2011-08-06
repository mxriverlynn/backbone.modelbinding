describe("data-bind conventions", function(){
  beforeEach(function(){
    this.model = new AModel();
    this.view = new AView({model: this.model});
  });

  describe("when a data-bind is configured to set html", function(){
    beforeEach(function(){
      this.view.render();
      this.model.set({villain: "boogerFace"});
    });

    it("should replace the entire contents of the element", function(){
      var el = this.view.$("#villain");
      expect(el.html()).toBe("boogerFace");
    });
  });

  describe("when a data-bind is configured to set text", function(){
    beforeEach(function(){
      this.view.render();
      this.model.set({doctor: "Who"});
    });

    it("should set the text of the element", function(){
      var el = this.view.$("#doctor");
      expect(el.text()).toBe("Who");
    });
  });

  describe("when a data-bind is configured to set an arbitrary attribute", function(){
    beforeEach(function(){
      this.view.render();
      this.model.set({pet: "bunnies"});
    });

    it("should set the value of the attribute", function(){
      var el = this.view.$("#pet");
      expect(el.attr("someAttr")).toBe("bunnies");
    });
  });
});
