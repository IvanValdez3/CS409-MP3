// For simple Testing purpose only - tasks
/*
export const getTasks = async (req, res) => {
    res.send('Get all tasks');
    //Works -> postman returned correct message
};

export const postTask = async (req, res) => {
    res.send('Create a new task');
    //Works -> postman returned correct message
};

export const getTaskId = async (req, res) => {
    const { taskId } = req.params;
    res.send(`Get task ID: ${taskId}`);
    //Works -> postman returned correct message
};

export const putTask = async (req, res) => {
    const { taskId } = req.params;
    res.send(`Update task ID: ${taskId}`);
    //Works -> postman returned correct message
}

export const deleteTask = async (req, res) => {
    const { taskId } = req.params;
    res.send(`Delete task ID: ${taskId}`);
    //Works -> postman returned correct message
};
*/

// Best Google search that helped me understand MVC more
// https://www.google.com/search?q=routes+controllers+and+models+style+in+javascrip&rlz=1C1GCEA_enUS1175US1175&oq=routes+controllers+and+models+style+in+javascrip&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQIRigATIHCAIQIRigATIHCAMQIRigAdIBCDg3NzhqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8

const Task = require('../models/tasks.js');
const User = require('../models/users.js');
const { parseHelper } = require('../controllers/parseHelper.js');

//First Get all tasks, respond with a list of tasks

const tasksController = {

    getTasks: async (req, res) => {
        try {
            const { query, query_options, count } = parseHelper(req);
            
            // Essentially if count is true we are told that 
            // "return the count of documents that match the query  (instead of the documents themselves)".
            if (count) {
                const tasks = await Task.countDocuments(query);
                return res.status(200).json({ message: "count", data: tasks });
            }

            const options = await Task.find(query, query_options.select, query_options)
             .sort(query_options.sort)
             .skip(query_options.skip)
             .limit(query_options.limit);
            res.status(200).json({ message: "success, following is the list of tasks", data: options });
        } catch (error) {
            //console.error('Error', error);
            res.status(500).json({ message: 'An error occured', data: error.message });
        }
    },

    postTask : async (req, res) => {
        try {
            const newTask = await Task.findById(req.query.taskId);
            newTask = newTask.select(req.query.select || '');

            if (!newTask) {
                return res.status(404).json({ message: 'Task not found', data: null });
            }
            res.status(200).json({ message: 'success, following is the task', data: newTask });
        } catch (error) {
            //console.error('Error', error);
            res.status(500).json({ message: 'An error occured', data: error.message });
        }

    };
};



