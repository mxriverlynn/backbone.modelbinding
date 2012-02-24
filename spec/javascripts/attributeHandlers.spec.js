describe("attribute handlers", function(){

  var View = Backbone.View.extend({
    render: function(){
      this.$el.html("<div data-bind='text fn:foo|fn-test'/>");
      Backbone.Phoenix.bind(this);
    }
  });

  describe("when registering an attribute handler", function(){
    var handlerWascalled;

    Backbone.Phoenix.addAttributeHandler("fn", function(config, value){
      handlerWasCalled = true;
    });

    beforeEach(function(){
      this.model = new Backbone.Model();
      this.view = new View({
        model: this.model
      });
      this.view.render();

      this.model.set({"fn-test": "foo bar"});
    });

    it("should call the registered handler", function(){
      expect(handlerWasCalled).toBeTruthy();
    });
  });

});
