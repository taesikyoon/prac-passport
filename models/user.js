import Sequelize from 'sequelize';

import { sequelize } from './sequelize.js';

export default class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        githubId: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        email: {
          type: sequelize.STRING(255),
          allowNull: true,
        },
        userName: {
          type: sequelize.STRING(255),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        tableName: 'user',
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }
}
