class View extends Backbone.View
  render: ->
    @$el.html("<div data-bind='text fn:foo|fn-test'/>")
    Backbone.Phoenix.bind(this)

describe "attribute handlers", ->

  context "registering an attribute handler", ->
    Given -> Backbone.Phoenix.addAttributeHandler "fn", @handler = jasmine.createSpy()
    Given -> @model = new Backbone.Model()
    Given -> new View(model: @model).render()

    When -> @model.set("fn-test": "foo bar")

    Then -> expect(@handler).toHaveBeenCalledWith("foo", "foo bar")

