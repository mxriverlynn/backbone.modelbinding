describe("model unbinding", function(){
  beforeEach(function(){
    this.model = new AModel({ name: "a name" });
    this.view = new AView({model: this.model});
    this.view.render();
  });

  describe("when unbinding a view should", function(){
    it("it should unbind the text box", function(){
      Backbone.ModelBinding.unbind(this.view);
      this.model.set({name: "some name change"});
      var el = this.view.$("#name");
      expect(el.val()).toEqual("a name");
    });
  });
  
});

