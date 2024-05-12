const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('products', {
        Handle: {
            type: DataTypes.STRING(2000),
            
        },
        Title: {
            type: DataTypes.STRING(2000),
           
        },
        Description: {
            type: DataTypes.STRING(2000),
            
        },
        SKU: {
            type: DataTypes.STRING(2000),
            
        },
        Grams: {
            type: DataTypes.INTEGER,
           
        },
        Stock: {
            type: DataTypes.INTEGER,
          
        },
        Price: {
            type: DataTypes.DECIMAL,
            
        },
        ComparePrice: {
            type: DataTypes.DECIMAL,
           
        },
        Barcode: {
            type: DataTypes.STRING(2000), // Cambia el tipo de datos a STRING
           
            defaultValue: ''
        },
    });
};
