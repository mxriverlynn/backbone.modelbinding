describe("model unbinding", function(){
  beforeEach(function(){
    this.model = new AModel({ 
      name: "a name",
      bio: "a bio",
      password: "it's a secret",
      education: "college"
    });
    this.view = new AView({model: this.model});
    this.view.render();
  });

  describe("when unbinding a view should", function(){
    beforeEach(function(){
      Backbone.ModelBinding.unbind(this.view);
    });

    it("should unbind the text box", function(){
      this.model.set({name: "some name change"});
      var el = this.view.$("#name");
      expect(el.val()).toEqual("a name");
    });

    it("should unbind the textarea", function(){
      this.model.set({bio: "some change to my bio"});
      var el = this.view.$("#bio");
      expect(el.val()).toEqual("a bio");
    });

    it("should unbind the password", function(){
      this.model.set({password: "this isn't it"});
      var el = this.view.$("#password");
      expect(el.val()).toEqual("it's a secret");
    });

    it("should unbind the select box", function(){
      this.model.set({education: "none"});
      var el = this.view.$("#education");
      expect(el.val()).toEqual("college");
    });
  });
  
});

