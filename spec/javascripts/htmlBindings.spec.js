describe("htmlBindings", function(){
  beforeEach(function(){
    this.model = new AModel();
    this.view = new AView({model: this.model});
    this.view.render();
  });

  it("binds model changes to html element", function(){
    this.model.set({a_field: "some value"});
    var showIt = this.view.$("#showIt");
    expect(showIt.html()).toEqual("some value");
  });
});
