'use strict';

module.exports = function Product(id, name, description, category, available){
    this.id = id;
    this.name = name;
    this.description = description;
    this.category = category;
    this.available = available;
}