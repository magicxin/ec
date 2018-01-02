/* eslint-disable */
class FormController {
  constructor (parent = {}) {
    this.$name = 'name';
    this.$error = {};
    this.$dirty = false;
    this.$pristine = true;
    this.$valid = true;
    this.$invalid = false;
    this.$submitted = false;
    this.$$parentForm = parent;
  }

  $setDirty () {
    this.$dirty = true
    this.$pristine = false
    this.$$parentForm.$setDirty()
  }

  $setPristine () {
    this.$pristine = true
    this.$dirty = false
    this.$$parentForm.$setPristine()
  }

  $setValid () {
    this.$invalid = false
    this.$valid = true
    this.$$parentForm.$setValid()
  }

  $setInvalid () {
    this.$invalid = true
    this.$valid = false
    this.$$parentForm.$setInvalid()
  }
}

// let instance = new FormController

export default FormController