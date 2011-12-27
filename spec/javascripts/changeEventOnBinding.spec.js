describe("data-bind for existing model values with predefined change events", function() {
  beforeEach(function() {
    this.model = new AModel({
      operating_system: 'osx',
      graduated: 'yes',
      prefilled_name: 'text',
      drivers_license: '1'
    });

    this.view = new AView({ model: this.model });

    this.callback = function() {
      $(this).data('changed', 'changed');
    };
  });

  describe("when select was subscribed with change event", function() {
    beforeEach(function() {
      var self = this;
      this.view.render(function() {
        self.el = self.view.$('#operating_system');
        self.el.change(self.callback);
      });
    });

    it("select should be changed", function() {
      expect(this.el.data('changed')).toBe('changed');
    });
  });

  describe("when radio group was subscribed with change event", function() {
    beforeEach(function() {
      var self = this;
      this.view.render(function() {
        self.el = self.view.$('#graduated_yes');
        self.el.change(self.callback);
      });
    });

    it("select should be changed", function() {
      expect(this.el.data('changed')).toBe('changed');
    });
  });

  describe("when input element was subscribed with change event", function() {
    beforeEach(function() {
      var self = this;
      this.view.render(function() {
        self.el = self.view.$('#prefilled_name');
        self.el.change(self.callback);
      });
    });

    it("select should be changed", function() {
      expect(this.el.data('changed')).toBe('changed');
    });
  });

  describe("when checkbox element was subscribed with change event", function() {
    beforeEach(function() {
      var self = this;
      this.view.render(function() {
        self.el = self.view.$('#drivers_license');
        self.el.change(self.callback);
      });
    });

    it("select should be changed", function() {
      expect(this.el.data('changed')).toBe('changed');
    });
  });
});
