import React from "react";
import phonebook from "../services/phonebook";

const Persons = ({ persons, setPersons }) => {
  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      phonebook
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          alert(`Deleted ${name} successfully.`);
        })
        .catch((error) => {
          alert("Error deleting person:", error);
        });
    }
  };

  return (
    <>
      {persons.map((person) => (
        <div key={person.id}>
          {person.name} {person.number}{" "}
          <button onClick={() => handleDelete(person.id, person.name)}>
            Delete
          </button>
        </div>
      ))}
    </>
  );
};

export default Persons;
