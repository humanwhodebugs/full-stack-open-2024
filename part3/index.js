require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const Person = require("./models/person");

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const getMorgan = morgan("tiny");

app.get("/", getMorgan, (request, response) => {
  response.send("<h1>Phonebook Backend</h1>");
});

app.get("/api/persons", getMorgan, (request, response, next) => {
  Person.find({})
    .then((people) => {
      response.json(people);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", getMorgan, (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => response.status(204).end())
    .catch((error) => next(error));
});

app.get("/info", getMorgan, (request, response) => {
  const date = new Date();
  const personCount = persons.length;
  response.send(`
    <p>Phonebook has info for ${personCount} people.</p>
    <p>${date}</p>
  `);
});

const postMorgan = morgan(
  ":method :url :status :res[content-length] - :response-time ms :request-body"
);

morgan.token("request-body", (req, res) => {
  return JSON.stringify(req.body);
});

app.post("/api/persons", postMorgan, (request, response, next) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      Error: "Name cannot be empty!",
    });
  } else if (!body.number) {
    return response.status(400).json({
      Error: "Number cannot be empty!",
    });
  }

  /*
  const numberExist = persons.find((person) => person.number === body.number);

  if (numberExist) {
    return response.status(400).json({
      Error: "Number already exists in the phonebook!",
    });
  }

  const nameExist = persons.find((person) => person.name === body.name);

  if (nameExist) {
    return response.status(400).json({
      Error: "Name already exists in the phonebook!",
    });
  }

  const person = {
    id: generateRandomId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
  */

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Unknown endpoint!" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformatted id!" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
