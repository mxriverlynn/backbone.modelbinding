describe("attribute handlers", function(){

  var View = Backbone.View.extend({
    render: function(){
      this.$el.html("<div data-bind='text fn:foo|fn-test'/>");
      Backbone.Phoenix.bind(this);
    }
  });

  describe("when registering an attribute handler", function(){
    var handler;

    beforeEach(function(){
      handler = jasmine.createSpy();
      Backbone.Phoenix.addAttributeHandler("fn", handler);

      this.model = new Backbone.Model();
      this.view = new View({
        model: this.model
      });
      this.view.render();

      this.model.set({"fn-test": "foo bar"});
    });

    it("should call the registered handler", function(){
      expect(handler).toHaveBeenCalledWith('foo','foo bar');
    });
  });

});
