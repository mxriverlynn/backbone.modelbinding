describe("custom conventions", function(){
  describe("replace the text input handler with a convention that sets the #name field value", function(){
    beforeEach(function(){
      this.model = new AModel({});
      this.view = new AView({model: this.model});
      this.oldHandler = Backbone.ModelBinding.Conventions.text.handler;

      var nameSettingsHandler = {
        bind: function(selector, view, model){
          view.$("#name").val("a custom convention supplied this name");
        }
      };
      Backbone.ModelBinding.Conventions.text.handler = nameSettingsHandler;

      this.view.render();
    });

    afterEach(function(){
      Backbone.ModelBinding.Conventions.text.handler = this.oldHandler;
    });

    it("should set the custom field value when rendered", function(){
      expect(this.view.$("#name").val()).toBe("a custom convention supplied this name");
    });
  });
});
