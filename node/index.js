const express = require('express');

const mysql = require('mysql');
const { uniqueNamesGenerator, names } = require('unique-names-generator');

const app = express();

const config = {
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'nodedb',
};

app.get('/test', function(req, res) {
  const randomName = uniqueNamesGenerator({ dictionaries: [names] });
  res.send(randomName);
});

app.get('/', function(req, res) {
  const randomName = uniqueNamesGenerator({ dictionaries: [names] });
  
  const connection = mysql.createConnection(config);

  const insert = `INSERT INTO people(name) VALUES ('${randomName}')`;

  connection.query(insert, function(err, results, fields) {
    if (err) {
      errorHandler(res, connection, err);
      return;
    }

    const select = `SELECT * FROM people`;

    connection.query(select, function(err, results, fields) {
      if (err) {
        errorHandler(res, connection, err);
        return;
      } 

      console.log(results);

      const lis = results.map(result => `<li>${result.name}</li>`);

      const html = 
        `<h1>Full Cycle Rocks!</h1><div><ul>${lis.join('')}</ul></div>`;

      res.send(html);

      connection.end();
    });
  });
});

function errorHandler(res, connection, err) {
  console.log(err);
  connection.end();
  res.status(500).send('error');
}

app.listen(3000, function() {
  console.log('App listening on port 3000...');
});
