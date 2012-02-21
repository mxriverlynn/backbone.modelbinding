describe("model unbinding", function(){
  beforeEach(function(){
    this.model = new AModel({ 
      name: "a name",
      bio: "a bio",
      password: "it's a secret",
      education: "college",
      graduated: "no",
      drivers_license: true,
      isValid: true
    });
    this.view = new AView({model: this.model});
    this.view.render();
  });

  describe("when unbinding a view should", function(){
    beforeEach(function(){
      Backbone.Phoenix.unbind(this.view);
    });

    it("should unbind the data-bind", function(){
      this.model.set({isValid: false});
      var el = this.view.$("#clicker");
      var disabled = el.attr("disabled");
      expect(disabled).toBeFalsy();
    });
  });
  
});

