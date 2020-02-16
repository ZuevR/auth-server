const config = require('config');

module.exports = {
  'development': {
    'username': config.get('Database.username'),
    'password': config.get('Database.password'),
    'database': config.get('Database.database'),
    'host': config.get('Database.host'),
    'dialect': 'postgres'
  },
  'test': {
    'username': config.get('Database.username'),
    'password': config.get('Database.password'),
    'database': config.get('Database.database'),
    'host': config.get('Database.host'),
    'dialect': 'postgres'
  },
  'production': {
    'username': 'root',
    'password': null,
    'database': 'database_production',
    'host': '127.0.0.1',
    'dialect': 'mysql'
  }
};
