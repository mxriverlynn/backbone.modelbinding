describe("conventionBindings", function(){
  beforeEach(function(){
    this.model = new AModel({
      name: "Ashelia Bailey", 
      education: "graduate", 
      graduated: "maybe",
      drivers_license: "yes"
    });
    this.view = new AView({model: this.model});
    this.view.render();
  });

  describe("input element binding", function(){
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

  describe("radio element binding", function(){
    it("bind view changes to the model's field, by convention of id", function(){
      var el = this.view.$("#graduated_no");
      el.attr("checked", "checked");
      el.trigger('change');
      expect(this.model.get('graduated')).toEqual("no");
    });

    it("bind model field changes to the form input, by convention of id", function(){
      this.model.set({graduated: "yes"});
      var el = this.view.$("#graduated_yes");
      var selected = el.attr("checked");

      expect(selected).toBeTruthy();
    });

    it("binds the model's value to the form field on render", function(){
      var el = this.view.$("input[type=radio][name=graduated]:checked");
      var selected = el.val();

      expect(selected).toBe("maybe");
    });
  });

  describe("select element binding", function(){
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

    it("binds the model's value to the form field on render", function(){
      var el = this.view.$("#education");
      expect(el.val()).toEqual("graduate");
    });
  });

  describe("checkbox element binding", function(){
    it("bind view changes to the model's field, by convention of id", function(){
      var el = this.view.$("#drivers_license");
      el.removeAttr("checked");
      el.trigger('change');
      expect(this.model.get('drivers_license')).toEqual("no");
    });

    it("bind model field changes to the form input, by convention of id", function(){
      var el = this.view.$("#drivers_license");
      var selected = el.attr("checked");

      // verify it's not checked first
      this.model.set({drivers_license: "no"});
      expect(selected).toBeFalsy();

      //then verify it's checked
      this.model.set({drivers_license: "yes"});
      expect(selected).toBeTruthy();
    });

    it("binds the model's value to the form field on render", function(){
      var el = this.view.$("#drivers_license");
      var selected = el.attr("checked");

      expect(selected).toBe("yes");
    });
  });

});
