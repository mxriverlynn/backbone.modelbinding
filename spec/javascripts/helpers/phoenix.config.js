storeDataBindSubstConfig = function (){
  Backbone.Phoenix.Configuration._dataBindSubstConfig = _.clone(this.dataBindSubstConfig);
}

restoreDataBindSubstConfig = function (){
  if (Backbone.Phoenix.Configuration._dataBindSubstConfig){
    this.dataBindSubstConfig = Backbone.Phoenix.Configuration._dataBindSubstConfig;
    delete Backbone.Phoenix.Configuration._dataBindSubstConfig;
  }
}

