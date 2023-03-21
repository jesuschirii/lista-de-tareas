import TickIcon from "./TickIcon.jsx";
import ProgressBar from "./ProgressBar.jsx";
import { useState } from "react";
import Modal from "./Modal.jsx";

const ListItem = ({ task, getData }) => {
  const [showModal, setShowModal] = useState(false);

  const deleteItem = async () => {
    let deleteI = confirm("Quieres eliminar la tarea?");

    if (deleteI) {
      try {
        const response = await fetch(
          `http://localhost:8000/tareas/${task.id}`,
          {
            method: "DELETE",
          }
        );
        if (response.status === 200) {
          getData();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <li className="list-item">
      <div className="info-container">
        <TickIcon />
        <p className="task-title">{task.title}</p>
        <ProgressBar progress={task.progress} />
      </div>

      <div className="button-container">
        <button className="edit" onClick={() => setShowModal(true)}>
          EDITAR
        </button>
        <button className="delete" onClick={deleteItem}>
          ELIMINAR
        </button>
      </div>
      {showModal && (
        <Modal
          mode={"edit"}
          setShowModal={setShowModal}
          getData={getData}
          task={task}
        />
      )}
    </li>
  );
};

export default ListItem;
