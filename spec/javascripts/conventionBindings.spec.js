describe("conventionBindings", function(){
  beforeEach(function(){
    this.model = new AModel({
      name: "Ashelia Bailey", 
      education: "graduate", 
      age_level: 0,
      graduated: "maybe",
      us_citizen: false,
      drivers_license: true,
      motorcycle_license: false,
      bio: "my baby girl"
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

  describe("textarea element binding", function(){
    it("bind view changes to the model's field, by convention of id", function(){
      var el = this.view.$("#bio");
      el.val("my sweet baby girl");
      el.trigger('change');

      expect(this.model.get('bio')).toEqual("my sweet baby girl");
    });

    it("bind model field changes to the form input, by convention of id", function(){
      this.model.set({bio: "a grumpy baby"});
      var el = this.view.$("#bio");
      expect(el.val()).toEqual("a grumpy baby");
    });

    it("binds the model's value to the form field on render", function(){
      var el = this.view.$("#bio");
      expect(el.val()).toEqual("my baby girl");
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

    it("binds the model's value to the form field on render (graduated)", function(){
      var el = this.view.$("input[type=radio][name=graduated]:checked");
      var selected = el.val();

      expect(selected).toBe("maybe");
    });

    it("binds the model's value to the form field on render (us_citizen)", function(){
      var el = this.view.$("#us_citizen_false");
      expect(el.is(':checked')).toBe(true);
    });
  });

});
