const App = () => {
  const course = {
    id: 1,
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
        id: 1,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
        id: 2,
      },
      {
        name: "State of a component",
        exercises: 14,
        id: 3,
      },
      {
        name: "Redux",
        exercises: 11,
        id: 4,
      },
    ],
  };

  return <Course course={course} />;
};

const Course = ({ course }) => {
  return (
    <div>
      <Header header={course.name} />
      <Content parts={course.parts} />
    </div>
  );
};

const Header = ({ header }) => {
  return <h1>{header}</h1>;
};

const Content = ({ parts }) => {
  const total =
    parts[0].exercises +
    parts[1].exercises +
    parts[2].exercises +
    parts[3].exercises;
  return (
    <div>
      {parts.map((part) => (
        <Part key={part.id} exercises={part.exercises} text={part.name} />
      ))}
      <Total total={total} />
    </div>
  );
};

const Part = ({ id, exercises, text }) => {
  return (
    <p id={id}>
      {text} {exercises}
    </p>
  );
};

const Total = ({ total }) => {
  return (
    <p>
      <b>Total of {total} exercises</b>
    </p>
  );
};

export default App;

