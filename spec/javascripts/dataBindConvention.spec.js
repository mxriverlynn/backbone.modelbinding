describe("data-bind conventions", function(){
  beforeEach(function(){
    this.model = new AModel({
      villain: "mrMonster",
      doctor: "Seuss",
      pet: "cat",
      isValid: false
    });
    this.view = new AView({model: this.model});
  });

  describe("when data-bind is configured for an event and the event is triggered", function(){
    beforeEach(function(){
      this.view.render();
      this.el = $(this.view.el).find("#eventDiv");
      this.model.trigger("foo", "bar");
    });

    it("should update the element with the event's value", function(){
      expect(this.el.text()).toBe("bar");
    });
  });

  describe("when a data-bind is configured with no html element attribute specified", function(){
    beforeEach(function(){
      this.view.render();
      this.el = $(this.view.el).find("#doctor_no_elem");
    });

    it("should set the element's text to the model's property value immediately", function(){
      expect(this.el.text()).toBe("Seuss");
    });

    it("should set the text of the element when the model's property changes", function(){
      this.model.set({doctor: "Who"});
      expect(this.el.text()).toBe("Who");
    });
  });

  describe("when a data-bind is configured to set text", function(){
    beforeEach(function(){
      this.view.render();
      this.el = $(this.view.el).find("#doctor");
    });

    it("should set the element's text to the model's property value immediately", function(){
      expect(this.el.text()).toBe("Seuss");
    });

    it("should set the text of the element when the model's property changes", function(){
      this.model.set({doctor: "Who"});
      expect(this.el.text()).toBe("Who");
    });
  });

  describe("when a data-bind is configured to set html", function(){
    beforeEach(function(){
      this.view.render();
      this.el = $(this.view.el).find("#villain");
    });

    it("should set the element's contents to the model's property value immediately", function(){
      expect(this.el.html()).toBe("mrMonster");
    });

    it("should replace the contents of the element when the model's property changes", function(){
      this.model.set({villain: "boogerFace"});
      expect(this.el.html()).toBe("boogerFace");
    });
  });

  describe("when a data-bind is configured to set enabled", function(){
    beforeEach(function(){
      this.view.render();
      this.el = $(this.view.el).find("#clicker");
    });

    it("should set the element's disabled value to the model's value, immediately", function(){
      var disabled = this.el.attr("disabled");
      expect(disabled == true || disabled == 'true').toBeTruthy();
    });

    it("should set the element's disabled value when the model's value is changed", function(){
      this.model.set({isValid: true});
      var disabled = this.el.attr("disabled");
      expect( disabled == false || disabled == 'false').toBeTruthy();
    });
  });

  describe("when a data-bind is configured to set disabled", function(){
    beforeEach(function(){
      this.view.render();
      this.el = $(this.view.el).find("#unclicker");
    });

    it("should set the element's disabled value to the model's value, immediately", function(){
      var disabled = this.el.attr("disabled");
      expect( disabled == false || disabled == 'false').toBeTruthy();
    });

    it("should set the element's disabled value when the model's value is changed", function(){
      this.model.set({isValid: true});
      var disabled = this.el.attr("disabled");
      expect(disabled == true || disabled == 'true').toBeTruthy();
    });
  });

  describe("when a data-bind is configured to set an arbitrary attribute", function(){
    beforeEach(function(){
      this.view.render();
      this.el = $(this.view.el).find("#pet");
    });

    it("should set the element's attribute to the model's property value immediately", function(){
      expect(this.el.attr("someAttr")).toBe("cat");
    });

    it("should set the value of the attribute", function(){
      this.model.set({pet: "bunnies"});
      expect(this.el.attr("someAttr")).toBe("bunnies");
    });
  });

  describe("when a data-bind is configured to set displayed", function(){
    beforeEach(function(){
      this.view.render();
      this.el = $(this.view.el).find("#showHideThing");
    });

    it("should set the element's disabled value to the model's value, immediately", function(){
      expect(this.el.css("display")).toBe("none");
    });

    it("should set the element's disabled value when the model's value is changed", function(){
      this.model.set({isValid: true});
      expect(this.el.css('display')).toBe('node');
    });
  });
  
  describe("when a data-bind is configured to set visible", function(){
    beforeEach(function(){
      this.view.render();
      this.el = $(this.view.el).find("#showHideAnotherThing");
    });

    it("should set the element's disabled value to the model's value, immediately", function(){
      expect(this.el.css("display")).not.toBe("none");
    });

    it("should set the element's disabled value when the model's value is changed", function(){
      this.model.set({isValid: true});
      expect(this.el.css('display').toBe('none');
    });
  });
});
