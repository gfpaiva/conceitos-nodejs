const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4');

const app = express();

function validateRepositoryId(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) return res.status(400).json({ error: 'Invalid id.' });
  
  const repositoryIdx = repositories.findIndex(repository => repository.id === id);

  if (repositoryIdx < 0) return res.sendStatus(404);

  req.repositoryIdx = repositoryIdx;

  return next();
}

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', validateRepositoryId);

const repositories = [];

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title = '', url = '', techs= [] } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const { title, url, techs } = request.body;
  const { repositoryIdx } = request;

  const repository = {
    ...repositories[repositoryIdx],
    title,
    url,
    techs,
  };


  repositories[repositoryIdx] = repository;

  return response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const { repositoryIdx } = request;

  repositories.splice(repositoryIdx, 1);

  response.sendStatus(204);
});

app.post('/repositories/:id/like', (request, response) => {
  const { repositoryIdx } = request;
  
  const repository = repositories[repositoryIdx];
  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
