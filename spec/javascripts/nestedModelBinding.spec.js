describe("data-bind nested views", function(){
  beforeEach(function(){
    this.outerModel = new AModel({name: "outerModel"});
    this.innerModel = new AModel({name: "innerModel"});
    this.outerModel.set({innerModel: this.innerModel});

    this.outerView = new NestedOuterView({model: this.outerModel});
    this.outerView.render();
    this.innerView = this.outerView.innerView;
  });

  describe ("when binding to unique fields in an inner view", function(){
    it("the inner text should be updated", function(){
      $("#innerText", this.innerView.$el).val("batman");
      $("#innerText", this.innerView.$el).trigger("change");
      expect(this.innerModel.get("innerText")).toBe("batman");
    });

    it("the outer text should not be updated", function(){
      $("#innerText", this.innerView.$el).val("robin");
      $("#innerText", this.innerView.$el).trigger("change");
      expect(this.outerModel.get("innerText")).toBe(undefined);
    });

    it("the inner select should be updated", function(){
      $("#innerSelect", this.innerView.$el).val("college");
      $("#innerSelect", this.innerView.$el).trigger("change");
      expect(this.innerModel.get("innerSelect")).toBe("college");
    });

    it("the outer select should not be updated", function(){
      $("#innerSelect", this.innerView.$el).val("graduate");
      $("#innerSelect", this.innerView.$el).trigger("change");
      expect(this.outerModel.get("innerSelect")).toBe(undefined);
    });

    it("the inner radio should be updated", function(){
      $("#graduated_maybe", this.innerView.$el).attr("checked", "checked");
      $("#graduated_maybe", this.innerView.$el).trigger("change");
      expect(this.innerModel.get("innerRadio")).toBe("maybe");
    });

    it("the outer radio should not be updated", function(){
      $("#graduated_yes", this.innerView.$el).attr("checked", "checked");
      $("#graduated_yes", this.innerView.$el).trigger("change");
      expect(this.outerModel.get("innerRadio")).toBe(undefined);
    });

    it("the inner checkbox should be updated", function(){
      $("#innerCheckbox", this.innerView.$el).removeAttr("checked");
      $("#innerCheckbox", this.innerView.$el).trigger("change");
      expect(this.innerModel.get("innerCheckbox")).toBe(false);
      $("#innerCheckbox", this.innerView.$el).attr("checked", "checked");
      $("#innerCheckbox", this.innerView.$el).trigger("change");
      expect(this.innerModel.get("innerCheckbox")).toBe(true);
    });

    it("the outer checkbox should not be updated", function(){
      $("#innerCheckbox", this.innerView.$el).removeAttr("checked");
      $("#innerCheckbox", this.innerView.$el).trigger("change");
      $("#innerCheckbox", this.innerView.$el).attr("checked", "checked");
      $("#innerCheckbox", this.innerView.$el).trigger("change");
      expect(this.outerModel.get("innerCheckbox")).toBe(undefined);
    });
  });

  describe ("when binding to unique fields in an outer view", function(){
    it("the outer text should be updated", function(){
      $("#outerText", this.outerView.$el).val("joker");
      $("#outerText", this.outerView.$el).trigger("change");
      expect(this.outerModel.get("outerText")).toBe("joker");
    });

    it("the inner text should not be updated", function(){
      $("#outerText", this.outerView.$el).val("penguin");
      $("#outerText", this.outerView.$el).trigger("change");
      expect(this.innerModel.get("outerText")).toBe(undefined);
    });

    it("the outer select should be updated", function(){
      $("#outerSelect", this.outerView.$el).val("grade_school");
      $("#outerSelect", this.outerView.$el).trigger("change");
      expect(this.outerModel.get("outerSelect")).toBe("grade_school");
    });

    it("the inner select should not be updated", function(){
      $("#outerSelect", this.outerView.$el).val("none");
      $("#outerSelect", this.outerView.$el).trigger("change");
      expect(this.innerModel.get("outerSelect")).toBe(undefined);
    });

    it("the outer radio should be updated", function(){
      $("#graduated_maybe", this.outerView.$el).attr("checked", "checked");
      $("#graduated_maybe", this.outerView.$el).trigger("change");
      expect(this.outerModel.get("outerRadio")).toBe("maybe");
    });

    it("the inner radio should not be updated", function(){
      $("#graduated_yes", this.outerView.$el).attr("checked", "checked");
      $("#graduated_yes", this.outerView.$el).trigger("change");
      expect(this.innerModel.get("outerRadio")).toBe(undefined);
    });

    it("the outer checkbox should be updated", function(){
      $("#outerCheckbox", this.outerView.$el).removeAttr("checked");
      $("#outerCheckbox", this.outerView.$el).trigger("change");
      expect(this.outerModel.get("outerCheckbox")).toBe(false);
      $("#outerCheckbox", this.outerView.$el).attr("checked", "checked");
      $("#outerCheckbox", this.outerView.$el).trigger("change");
      expect(this.outerModel.get("outerCheckbox")).toBe(true);
    });

    it("the inner checkbox should not be updated", function(){
      $("#outerCheckbox", this.outerView.$el).removeAttr("checked");
      $("#outerCheckbox", this.outerView.$el).trigger("change");
      $("#outerCheckbox", this.outerView.$el).attr("checked", "checked");
      $("#outerCheckbox", this.outerView.$el).trigger("change");
      expect(this.innerModel.get("outerCheckbox")).toBe(undefined);
    });
  });

  describe("when binding to shared id fields in an inner view", function () {
    it("the inner text should be updated", function () {
      $("#sharedText", this.innerView.$el).val("batman");
      $("#sharedText", this.innerView.$el).trigger("change");
      expect(this.innerModel.get("sharedText")).toBe("batman");
    });

    it("the outer text should not be updated", function () {
      $("#sharedText", this.innerView.$el).val("robin");
      $("#sharedText", this.innerView.$el).trigger("change");
      expect(this.outerModel.get("sharedText")).toBe(undefined);
    });

    it("the inner select should be updated", function () {
      $("#sharedSelect", this.innerView.$el).val("college");
      $("#sharedSelect", this.innerView.$el).trigger("change");
      expect(this.innerModel.get("sharedSelect")).toBe("college");
    });

    it("the outer select should not be updated", function () {
      $("#sharedSelect", this.innerView.$el).val("graduate");
      $("#sharedSelect", this.innerView.$el).trigger("change");
      expect(this.outerModel.get("sharedSelect")).toBe("none");
    });

    it("the inner radio should be updated", function () {
      $("#graduated_maybe[name=sharedRadio]", this.innerView.$el).attr("checked", "checked");
      $("#graduated_maybe[name=sharedRadio]", this.innerView.$el).trigger("change");
      expect(this.innerModel.get("sharedRadio")).toBe("maybe");
    });

    it("the outer radio should not be updated", function () {
      $("#graduated_yes[name=sharedRadio]", this.innerView.$el).attr("checked", "checked");
      $("#graduated_yes[name=sharedRadio]", this.innerView.$el).trigger("change");
      expect(this.outerModel.get("sharedRadio")).toBe(undefined);
    });

    it("the inner checkbox should be updated", function () {
      $("#sharedCheckbox", this.innerView.$el).removeAttr("checked");
      $("#sharedCheckbox", this.innerView.$el).trigger("change");
      expect(this.innerModel.get("sharedCheckbox")).toBe(false);
      $("#sharedCheckbox", this.innerView.$el).attr("checked", "checked");
      $("#sharedCheckbox", this.innerView.$el).trigger("change");
      expect(this.innerModel.get("sharedCheckbox")).toBe(true);
    });

    it("the outer checkbox should not be updated", function () {
      $("#sharedCheckbox", this.innerView.$el).removeAttr("checked");
      $("#sharedCheckbox", this.innerView.$el).trigger("change");
      $("#sharedCheckbox", this.innerView.$el).attr("checked", "checked");
      $("#sharedCheckbox", this.innerView.$el).trigger("change");
      expect(this.outerModel.get("sharedCheckbox")).toBe(false);
    });
  });

  describe("when binding to shared id fields in an outer view", function () {
    it("the outer text should be updated", function () {
      $("#sharedText:first", this.outerView.$el).val("batman");
      $("#sharedText", this.outerView.$el).trigger("change");
      expect(this.outerModel.get("sharedText")).toBe("batman");
    });

    it("the inner text should not be updated", function () {
      $("#sharedText:first", this.outerView.$el).val("robin");
      $("#sharedText:first", this.outerView.$el).trigger("change");
      expect(this.innerModel.get("sharedText")).toBe(undefined);
    });

    it("the outer select should be updated", function () {
      $("#sharedSelect:first", this.outerView.$el).val("college");
      $("#sharedSelect:first", this.outerView.$el).trigger("change");
      expect(this.outerModel.get("sharedSelect")).toBe("college");
    });

    it("the inner select should not be updated", function () {
      $("#sharedSelect:first", this.outerView.$el).val("graduate");
      $("#sharedSelect:first", this.outerView.$el).trigger("change");
      expect(this.innerModel.get("sharedSelect")).toBe("none");
    });

    it("the outer radio should be updated", function () {
      $("#graduated_maybe[name=sharedRadio]:first", this.outerView.$el).attr("checked", "checked");
      $("#graduated_maybe[name=sharedRadio]:first", this.outerView.$el).trigger("change");
      expect(this.outerModel.get("sharedRadio")).toBe("maybe");
    });

    it("the inner radio should not be updated", function () {
      $("#graduated_yes[name=sharedRadio]:first", this.outerView.$el).attr("checked", "checked");
      $("#graduated_yes[name=sharedRadio]:first", this.outerView.$el).trigger("change");
      expect(this.innerModel.get("sharedRadio")).toBe(undefined);
    });

    it("the outer checkbox should be updated", function () {
      $("#sharedCheckbox:first", this.outerView.$el).removeAttr("checked");
      $("#sharedCheckbox:first", this.outerView.$el).trigger("change");
      expect(this.outerModel.get("sharedCheckbox")).toBe(false);
      $("#sharedCheckbox:first", this.outerView.$el).attr("checked", "checked");
      $("#sharedCheckbox:first", this.outerView.$el).trigger("change");
      expect(this.outerModel.get("sharedCheckbox")).toBe(true);
    });

    it("the inner checkbox should not be updated", function () {
      $("#sharedCheckbox:first", this.outerView.$el).attr("checked", "checked");
      $("#sharedCheckbox:first", this.outerView.$el).trigger("change");
      expect(this.innerModel.get("sharedCheckbox")).toBe(false);
    });
  });
});
