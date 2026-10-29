
import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  generateTaskDescription,
} from "../api";

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
const [generatingDescription, setGeneratingDescription] = useState(false);
  const [priority, setPriority] = useState("medium");

  async function loadTasks() {
    setLoading(true);
    setError("");

    try {
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load tasks.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setPriority("medium");
  }

async function handleGenerateDescription() {
  if (!title.trim()) {
    setError("Enter a task title first.");
    return;
  }

  setGeneratingDescription(true);
  setError("");
  setNotification("");

  try {
    const data = await generateTaskDescription(title.trim());

    if (!data.description) {
      setError(
        data.message || "AI suggestion unavailable. Please write manually."
      );
      return;
    }

    setDescription(data.description);
    setNotification(
      "AI-generated suggestion added. Review or edit it before saving."
    );
  } catch (err) {
    setError(
      err.message || "AI suggestions are unavailable. Please write manually."
    );
  } finally {
    setGeneratingDescription(false);
  }
}

  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    setSaving(true);
    setError("");
    setNotification("");

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
    };

    try {
      if (editingId) {
        await updateTask(editingId, taskData);
      } else {
        await createTask(taskData);
      }

      const updatedTasks = await getTasks();
      setTasks(Array.isArray(updatedTasks) ? updatedTasks : []);

      setNotification(
        editingId
          ? "Task updated successfully!"
          : "Task created successfully!"
      );

      resetForm();
    } catch (err) {
      setError(err.message || "Unable to save task.");
    } finally {
      setSaving(false);
    }
  }

  function startEditing(task) {
    setEditingId(task._id);
    setTitle(task.title || "");
    setDescription(task.description || "");
    setPriority(task.priority || "medium");
    setError("");
    setNotification("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleToggle(task) {
    setError("");
    setNotification("");
    setSaving(true);

    try {
      await updateTask(task._id, {
        title: task.title,
        description: task.description || "",
        completed: !task.completed,
        priority: task.priority || "medium",
      });

      const updatedTasks = await getTasks();
      setTasks(Array.isArray(updatedTasks) ? updatedTasks : []);
      setNotification("Task status updated successfully!");
    } catch (err) {
      setError(err.message || "Unable to update task status.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(task) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`
    );

    if (!confirmed) return;

    setError("");
    setNotification("");
    setSaving(true);

    try {
      await deleteTask(task._id);

      const updatedTasks = await getTasks();
      setTasks(Array.isArray(updatedTasks) ? updatedTasks : []);
      setNotification("Task deleted successfully!");

      if (editingId === task._id) {
        resetForm();
      }
    } catch (err) {
      setError(err.message || "Unable to delete task.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="section skills-section">
     
      <h1>Task Manager</h1>
      <p>Create, view, update and delete tasks stored in MongoDB.</p>

      <form onSubmit={handleSubmit} className="task-form">
        <h2>{editingId ? "Edit Task" : "Create New Task"}</h2>

        <label htmlFor="task-title">Task Title</label>
        <input
          id="task-title"
          type="text"
          placeholder="Enter task title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />

        <label htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          placeholder="Enter task description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
        />

<button
  type="button"
  onClick={handleGenerateDescription}
  disabled={generatingDescription || saving}
>
  {generatingDescription
    ? "Generating description..."
    : "Generate description with AI"}
</button>

<p className="ai-disclaimer">
  AI-generated suggestion — review and edit before saving.
  Do not submit passwords, personal details, or confidential information.
</p>

        <label htmlFor="task-priority">Priority</label>
        <select
          id="task-priority"
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button
          type="submit"
          className="primary-button"
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : editingId
              ? "Update Task"
              : "Create Task"}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm} disabled={saving}>
            Cancel Edit
          </button>
        )}
      </form>

      {notification && (
        <p role="status" className="task-success">
          {notification}
        </p>
      )}

      {error && (
        <div role="alert" className="task-error">
          <p>{error}</p>
          <button type="button" onClick={loadTasks} disabled={loading}>
            Retry Loading Tasks
          </button>
        </div>
      )}

      <h2>My Tasks</h2>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <>
          <p>Total tasks: {tasks.length}</p>

          <div className="skills-container">
            {tasks.length === 0 ? (
              <p>No tasks found. Create your first task above.</p>
            ) : (
              tasks.map((task) => (
                <article className="skill-card" key={task._id}>
                  <h3>{task.title}</h3>

                  <p>
                    {task.description || "No description provided."}
                  </p>

                  <p>
                    <strong>Priority:</strong>{" "}
                    {task.priority || "medium"}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {task.completed ? "Completed" : "Pending"}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleToggle(task)}
                    disabled={saving}
                  >
                    Mark as {task.completed ? "Pending" : "Completed"}
                  </button>

                  <button
                    type="button"
                    onClick={() => startEditing(task)}
                    disabled={saving}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(task)}
                    disabled={saving}
                  >
                    Delete
                  </button>
                </article>
              ))
            )}
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={loadTasks}
            disabled={loading || saving}
          >
            Refresh Tasks
          </button>
        </>
      )}
    </section>
  );
}

export default TaskManager;
