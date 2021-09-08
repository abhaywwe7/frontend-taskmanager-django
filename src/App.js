import React, { Component } from "react";
import "./App.css";
import Modal from "./components/Modal";
import axios from "axios";
// import CustomModal from "./components/Modal";
// const tasks = [
//   {
//     id: 1,
//     title: "Study time",
//     description: "Attend class and study",
//     completed: true,
//   },
//   {
//     id: 2,
//     title: "Watch movie",
//     description: "Movie time after 11:00",
//     completed: false,
//   },
// ];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      viewCompleted: false,
      activeItem: {
        title: "",
        description: "",
        completed: false,
      },
      taskList: [],
    };
  }
  refreshList = () => {
    axios
      .get("http://127.0.0.1:8000/api/tasks/")
      .then((res) => this.setState({ taskList: res.data }))
      .catch((err) => console.log(err));
  };

  componentDidMount() {
    this.refreshList();
  }

  displayCompleted = (status) => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }
    return this.setState({ viewCompleted: false });
  };

  renderTabList = () => {
    return (
      <div className="my-5 tab-list">
        <span
          onClick={() => this.displayCompleted(true)}
          className={this.state.viewCompleted ? "active" : ""}
        >
          Completed
        </span>
        <span
          onClick={() => this.displayCompleted(false)}
          className={this.state.viewCompleted ? "" : "active"}
        >
          Incompleted
        </span>
      </div>
    );
  };

  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.taskList.filter(
      (item) => item.completed === viewCompleted
    );
    return newItems.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${
            this.state.viewCompleted ? "completed-todo" : ""
          }`}
          title={item.description}
        >
          {item.title}
        </span>
        <span>
          <button
            onClick={() => this.editItem(item)}
            className="btn btn-info mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => this.handleDelete(item)}
            className="btn btn-danger mr-2"
          >
            Delete
          </button>
        </span>
      </li>
    ));
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = (item) => {
    this.toggle();
    if (item.id) {
      // if old post to edit and submit
      axios
        .put(`http://127.0.0.1:8000/api/tasks/${item.id}/`, item)
        .then((res) => this.refreshList());
      return;
    }
    // if new post to submit
    axios
      .post("http://127.0.0.1:8000/api/tasks/", item)
      .then((res) => this.refreshList());
  };

  // Delete item
  handleDelete = (item) => {
    axios
      .delete(`http://127.0.0.1:8000/api/tasks/${item.id}/`)
      .then((res) => this.refreshList());
  };

  createItem = () => {
    const item = { title: "", modal: !this.state.modal };
    this.setState({ activeItem: item, modal: !this.state.modal });
  };
  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  render() {
    return (
      <main className="content p-4 mb-2 bg-success">
        <h1 className="text-white text-uppercase text-center my-5">
          My Todo List
        </h1>
        <div className="row">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="">
                <button onClick={this.createItem} className="btn btn-warning">
                  Add Task
                </button>
              </div>
              {this.renderTabList()}
              <ul className="list-group list-group-flush">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        <footer className="my-5 mb-2 bg-success text-white text-center text-capitalize">
          Copyright 2021 &copy; All rights reserved
        </footer>
        {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}
      </main>
    );
  }
}

export default App;
