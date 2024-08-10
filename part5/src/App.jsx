import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import NewBlog from './components/NewBlog';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');
  const [user, setUser] = useState(null);

  const newBlogRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const addBlog = async (blogObject) => {
    try {
      newBlogRef.current.toggleVisibility();
      const returnedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(returnedBlog));

      setMessage(
        `A new blog '${blogObject.title}' by '${blogObject.author}' added!`
      );
      setMessageType('success');
      setTimeout(() => {
        setMessage(null);
        setMessageType('');
      }, 5000);
    } catch (error) {
      console.error('Error', error);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setMessage('Wrong username or password!');
      setMessageType('error');
      setTimeout(() => {
        setMessage(null);
        setMessageType('');
      }, 5000);
    }
  };

  const handleLogout = async () => {
    try {
      window.localStorage.removeItem('loggedBlogAppUser');
      setUser(null);
    } catch (error) {
      console.error('Error', error);
    }
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        Username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        Password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );

  if (user === null) {
    return (
      <div>
        <h2>Login to Application</h2>
        <Notification message={message} type={messageType} />
        {loginForm()}
      </div>
    );
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={message} type={messageType} />
      <div>
        {user.name} logged in <button onClick={handleLogout}>Logout</button>
      </div>
      <div>
        <Togglable buttonLabel="Create Blog" ref={newBlogRef}>
          <NewBlog createBlog={addBlog} />
        </Togglable>
      </div>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
