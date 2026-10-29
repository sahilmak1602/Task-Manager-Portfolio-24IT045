
const taskEvents = require("./events");

taskEvents.on("task-created", (task) => {
    const title = task.title || "Untitled task";
    const assignedUser =
        task.assignedTo || task.userId || "Not assigned";

    console.log(
        `[Notification] Started for task "${title}" at ${new Date().toISOString()}`
    );

    // Simulate a slow background notification.
    setTimeout(() => {
        console.log(
            `[Notification] Task "${title}" created at ${new Date().toISOString()} | Assigned user: ${assignedUser}`
        );
    }, 2000);
});

module.exports = taskEvents;
// Listener for task deletion
taskEvents.on("task-deleted", (task) => {
    console.log(
        `[Notification] Task "${task.title}" deleted at ${new Date().toISOString()}`
    );
});

// Handle event-processing errors
taskEvents.on("error", (err) => {
    console.error(
        `[Event Error] ${err?.message || err}`
    );
});