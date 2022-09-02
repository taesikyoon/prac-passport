// 시퀄라이즈 생성하기위한 인덱스.js
export * from './sequelize.js';
import sequelize from './sequelize.js';

import User from './user.js';
const db = {};

db.sequelize = sequelize;
db.user = User;

User.init(sequelize);

export { db };
