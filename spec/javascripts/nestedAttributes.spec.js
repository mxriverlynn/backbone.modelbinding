describe("data-bind nested attribute names", function() {

  describe("when our html presentation was changed by user", function() {
    beforeEach(function() {
      this.model = new AModel();
      this.view = new NestedView({ model: this.model });
      this.view.render();
    });

    describe("on the title text box", function() {
      beforeEach(function() {
        var element = this.view.$('input[name=title]');
        element.val('changed');
        element.trigger('change');
      });

      it("should change value in model", function() {
        expect(this.model.get('title')).toBe('changed');
      });
    });

    describe("on the nested[title] text box", function() {
      beforeEach(function() {
        var element = this.view.$('input[name="nested[title]"]');
        element.val('changed');
        element.trigger('change');
      });

      it("should change value in model", function() {
        expect(this.model.get('nested').title).toBe('changed');
      });
    });

    describe("on the nested[nested_attributes][title] text box", function() {
      beforeEach(function() {
        var element = this.view.$('input[name="nested[nested_attributes][title]"]');
        element.val('changed');
        element.trigger('change');
      });

      it("should change value in model", function() {
        expect(this.model.get('nested').nested_attributes.title).toBe('changed');
      });
    });

    describe("on the nested[graduate] select box", function() {
      beforeEach(function() {
        var element = this.view.$('select[name="nested[graduate]"]');
        element.val('college');
        element.trigger('change');
      });

      it("should change value in model", function() {
        expect(this.model.get('nested').graduate).toBe('college');
      });
    });

    describe("on the nested[sex] radio group", function() {
      beforeEach(function() {
        var element = this.view.$('input[value="female"]');
        element.attr('checked', 'checked');
        element.trigger('change');
      });

      it("should change value in model", function() {
        expect(this.model.get('nested').sex).toBe('female');
      });
    });

    describe("on the nested[drunk] checkbox", function() {
      beforeEach(function() {
        var element = this.view.$('input[type=checkbox]');
        element.attr('checked', 'checked');
        element.trigger('change');
      });

      it("should change value in model", function() {
        expect(this.model.get('nested').drunk).toBeTruthy();
      });
    });
  });

  describe("when we have model instance with existing attributes to bind it", function() {
    beforeEach(function() {
      this.model = new AModel({
        title: 'model title',
        nested: {
          title: 'model nested title',
        nested_attributes: {
          title: 'model nested nested_attributes title'
        }
        }
      });
      this.view = new NestedView({ model: this.model });
    });

    describe("when render nested view", function() {
      beforeEach(function() {
        this.view.render();
      });

      it("should have a simple attribute", function() {
        expect(this.model.get('title')).toBe('model title');
      });

      it("should have a nested attributes", function() {
        expect(typeof(this.model.get('nested')) === 'undefined').toBeFalsy();
      });

      describe('when model has no another nested attribute', function() {
        it('should have attribute another nested title in model', function() {
          expect(typeof(this.model.get('another_nested')) === 'undefined').toBeFalsy();
        });

        it('should have attribute another nested title in model', function() {
          expect(this.model.get('another_nested').title).toBe('view another nested title');
        });
      });

      it('should have attribute title', function () {
        expect(this.view.$('input[name="nested[title]"]').val()).toBe('model nested title');
      });

      it('should have nested attribute', function() {
        expect(this.view.$('input[name="nested[nested_attributes][title]"]').val()).toBe('model nested nested_attributes title');
      });
    });

  });
});
