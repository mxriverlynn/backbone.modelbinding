describe("default data-bind substitutions", function(){
  beforeEach(function(){
    this.model = new AModel({
      doctor: "Seuss"
    });
    this.view = new AView({model: this.model});
    this.view.render();
  });

  describe("when binding to text and unsetting the model's property", function(){
    beforeEach(function(){
      this.model.unset("doctor")
      this.el = this.view.$("#doctor");
    });

    it("should set the text to an empty string", function(){
      expect(this.el.text()).toBe("");
    });
  });

  describe("when binding to html and unsetting the model's property", function(){
    beforeEach(function(){
      this.model.unset("villain")
      this.el = this.view.$("#villain");
    });

    it("should set the html to an empty string", function(){
      expect(this.el.html()).toBe("");
    });
  });

});

describe("configured data-bind substitutions", function(){
  beforeEach(function(){
    Backbone.ModelBinding.Configuration.dataBindSubst({
      text: {"undefined": "text subst"},
      html: {"undefined": "html subst"}
    });
    this.model = new AModel({
      doctor: "Seuss"
    });
    this.view = new AView({model: this.model});
    this.view.render();
  });

  describe("when binding to text and unsetting the model's property", function(){
    beforeEach(function(){
      this.model.unset("doctor")
      this.el = this.view.$("#doctor");
    });

    it("should set the text to an empty string", function(){
      expect(this.el.text()).toBe("text subst");
    });
  });

  describe("when binding to html and unsetting the model's property", function(){
    beforeEach(function(){
      this.model.unset("villain")
      this.el = this.view.$("#villain");
    });

    it("should set the html to an empty string", function(){
      expect(this.el.html()).toBe("html subst");
    });
  });

});
