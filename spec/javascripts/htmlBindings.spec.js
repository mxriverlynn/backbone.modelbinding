describe("htmlBindings", function(){
  beforeEach(function(){
    this.model = new AModel();
    this.view = new AView({model: this.model});
    this.view.render();
  });

  afterEach(function(){
    this.view.close();
  });
  
  it("binds model changes to html element", function(){
    this.model.set({a_field: "some value"});
    var showIt = $("#showIt");
    expect(showIt.html()).toEqual("some value");
  });
});
