var Reflux = require('reflux');
var Api = require('../utils/api');
var Actions = require('../actions');
var _ = require('lodash');  

module.exports= Reflux.createStore({
  listenables: [
    Actions
  ],
  
  getImages: function(topicId) {
    Api.get('topics/' + topicId)
      .then(function(response) {
        console.log(response.data)
        this.images = _.reject(response.data, function(image) {
          return image.is_album
        });
        
        this.triggerChange();
      }.bind(this));
  },
  
  getImage: function(id) {
    Api.get('gallery/image/' + id)
      .then(function(response) {
        if(this.images){
          this.images.push(response.data);
        } else {
          this.images = [response.data];
        }
        
        this.triggerChange();
      }.bind(this));
  },
  
  find: function(id) {
    var image = _.find(this.images, {id: id})
    
    if (image) {
      return image
    } else {
      this.getImage(id);
      return null
    }
  },
  
  triggerChange: function() {
    this.trigger('change', this.images);
  }
});