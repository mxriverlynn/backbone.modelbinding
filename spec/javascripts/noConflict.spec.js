describe("Backbone.noConflict", function(){
  beforeEach(function(){    
    var that = this;  
    this.localBackbone = Backbone.noConflict();
    this.localUnderscore = _.noConflict();
      
    var Model = this.localBackbone.Model.extend({});
    var View = this.localBackbone.View.extend({
      render: function(){
        var html = $("\
          <input id='input'>\
          <select id='select'> \
            <option value='none'>none</option> \
          </select> \
          <input type='radio' id='radio' name='radio' value='yes'>\
          <input type='checkbox' id='check' value='yes'>\
          <button id='data' data-bind='disabled isValid'>Click Me!</button>\
        ");
        this.$(this.el).append(html);
      }
    });
      
    this.model = new Model();
    this.view = new View({model: this.model});
    this.view.render();
  });
  
  afterEach(function(){
    Backbone = this.localBackbone;
    _ = this.localUnderscore;
  });
  
  it("should use local copy of backbone when binding", function(){
    this.localBackbone.Phoenix.bind(this.view);
  });
});
