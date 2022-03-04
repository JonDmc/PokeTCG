'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class card extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.card.belongsTo(models.user)
      models.card.belongsToMany(models.deck, { through: 'cardDecks', onDelete: 'cascade' })
    }
  }
  card.init({
    userId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    type: DataTypes.STRING,
    attack: DataTypes.STRING,
    weakness: DataTypes.STRING,
    resistance: DataTypes.STRING,
    rarity: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'card',
  });
  return card;
};