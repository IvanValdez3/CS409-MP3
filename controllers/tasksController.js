// For simple Testing purpose only - tasks

export const getTasks = async (req, res) => {
    res.send('Get all tasks');
};

export const postTask = async (req, res) => {
    res.send('Create a new task');
};

export const getTaskId = async (req, res) => {
    const { taskId } = req.params;
    res.send(`Get task ID: ${taskId}`);
};

export const putTask = async (req, res) => {
    const { taskId } = req.params;
    res.send(`Update task ID: ${taskId}`);
}

export const deleteTask = async (req, res) => {
    const { taskId } = req.params;
    res.send(`Delete task ID: ${taskId}`);
};
