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
      this.model.unset("doctor");
      this.el = this.view.$("#doctor");
    });

    it("should set the text to an empty string", function(){
      expect(this.el.text()).toBe("");
    });
  });

  describe("when binding to html and unsetting the model's property", function(){
    beforeEach(function(){
      this.model.unset("villain");
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
      text: "text subst",
      html: "&nbsp;"
    });
    this.model = new AModel({
      doctor: "Seuss"
    });
    this.view = new AView({model: this.model});
    this.view.render();
  });

  afterEach(function(){
    Backbone.ModelBinding.Configuration.restoreDataBindSubstConfig();
  });

  describe("when binding to text and unsetting the model's property", function(){
    beforeEach(function(){
      this.model.unset("doctor");
      this.el = this.view.$("#doctor");
    });

    it("should set the text to an empty string", function(){
      expect(this.el.text()).toBe("text subst");
    });
  });

  describe("when binding to html and unsetting the model's property", function(){
    beforeEach(function(){
      this.model.unset("villain");
      this.el = this.view.$("#villain");
    });

    it("should set the html to an empty string", function(){
      expect(this.el.html()).toBe("&nbsp;");
    });
  });

});

describe("resetting the data bind substitutions", function(){
  beforeEach(function(){
    Backbone.ModelBinding.Configuration.dataBindSubst({
      text: "text subst",
      html: "html subst"
    });
    this.model = new AModel({
      doctor: "Seuss",
      villain: "mort"
    });
    this.view = new AView({model: this.model});
    this.view.render();

    Backbone.ModelBinding.Configuration.restoreDataBindSubstConfig();
  });

  it("should use the default for text substitutions", function(){
    this.model.unset("doctor");
    this.doctorEl = this.view.$("#doctor");
    expect(this.doctorEl.text()).toBe("");
  });

  it("should use the default for html substitutions", function(){
    this.model.unset("villain");
    this.villainEl = this.view.$("#villain");
    expect(this.villainEl.html()).toBe("");
  });
});
