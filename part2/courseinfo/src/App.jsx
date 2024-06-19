const App = () => {
  const courses = [
    {
      name: "Half Stack application development",
      id: 1,
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
    },
    {
      name: "Node.js",
      id: 2,
      parts: [
        {
          name: "Routing",
          exercises: 3,
          id: 1,
        },
        {
          name: "Middlewares",
          exercises: 7,
          id: 2,
        },
      ],
    },
  ];

  return <Course courses={courses} />;
};

const Course = ({ courses }) => {
  return (
    <div>
      <Header />
      {courses.map((course) => (
        <Content key={course.id} name={course.name} parts={course.parts} />
      ))}
    </div>
  );
};

const Header = () => {
  return <h1>Web Development Curriculum</h1>;
};

const Content = ({ name, parts }) => {
  const total = parts.reduce(
    (accumulator, part) => accumulator + part.exercises,
    0
  );
  return (
    <div>
      <h2>{name}</h2>
      {parts.map((part) => (
        <Part key={part.id} exercises={part.exercises} text={part.name} />
      ))}
      <Total total={total} />
    </div>
  );
};

const Part = ({ exercises, text }) => {
  return (
    <p>
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

