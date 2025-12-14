import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  const { title, completed, deadline, remindAt } = req.body;

  try {
    const task = await Task.create({
      title,
      completed,
      deadline,
      remindAt,
      userId: req.user.userId,
    });

    return res.status(201).json({
      status: "success",
      message: "Task was created successfully",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message,
    });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId });

    return res.status(200).json({
      status: "success",
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateTask = async (req, res) => {
  const { title } = req.params;
  const updates = req.body;
  if (updates.remindAt) {
    updates.lastReminderSentAt = null;
  }

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { title, userId: req.user.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        status: "error",
        message: "Task not found or unauthorized",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteTask = async (req, res) => {
  const { title } = req.params;

  try {
    const deletedTask = await Task.findOneAndDelete({
      title,
      userId: req.user.userId,
    });

    if (!deletedTask) {
      return res.status(404).json({
        status: "error",
        message: "Task not found or unauthorized",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Task deleted successfully",
      data: deletedTask,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message,
    });
  }
};
