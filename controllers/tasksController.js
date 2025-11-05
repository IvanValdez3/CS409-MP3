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

const Task = require('../models/tasksM.js');
const User = require('../models/userM.js');
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

            const options = await Task.find(query, query_options.select || null)
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
            const name = req.body.name;
            const deadline = req.body.deadline;

            if ( !name || !deadline ) {
                return res.status(400).json({ message: 'Task name and deadline are required', data: null });
            }

            const assignedUser = req.body.assignedUser;
            let assignedUserName = "unassigned";

            if (assignedUser) {
                const finduser = await User.findById(assignedUser);
                if (!finduser) {
                    return res.status(400).json({ message: 'user not found', data: null });
                }
                assignedUserName = finduser.name;
            }

            const newTask = new Task({
                name,
                deadline,
                description: req.body.description || "",
                assignedUserName,
                assignedUser: assignedUser || ""
            });

            //Now we can update the id of the task to the user's pendingTasks array if assignedUser is provided
            if (assignedUser) {
                await User.findByIdAndUpdate(assignedUser, { $push: { pendingTasks: newTask._id } });
            }
            await newTask.save();
            res.status(201).json({ message: 'Task created successfully', data: newTask });
        } catch (error) {
            //console.error('Error', error);
            res.status(500).json({ message: 'An error occured', data: error.message });
        }
    },

    getTaskId : async (req, res) => {
        try {
            const select = req.query.select || '';
            let task = await Task.findById(req.params.taskId);
            if (!task) {
                return res.status(404).json({ message: 'Task not found', data: null });
            }
            if (select) {
                task = task.select(select);
            }
            res.status(200).json({ message: 'success, following is the task', data: task });
        } catch (error) {
            //console.error('Error', error);
            res.status(500).json({ message: 'An error occured', data: error.message });
        }
    },

    putTask : async (req, res) => {
        try {
            const name = req.body.name;
            const deadline = req.body.deadline;

            if ( !name || !deadline ) {
                return res.status(400).json({ message: 'Task name and deadline are required', data: null });
            }

            const task = await Task.findById(req.params.taskId);
            if (!task) {
                return res.status(404).json({ message: 'Task was not found', data: null });
            }

            //Now we need to handle if the assigned user is being changed
            const newAssignedUser = req.body.assignedUser;
            if (newAssignedUser && newAssignedUser !== task.assignedUser) {
                const newUser = await User.findById(newAssignedUser);
                if (!newUser) {
                    return res.status(400).json({ message: 'New assigned user not found', data: null });
                }

                // Now if we did find the new User we need to remove task from old assigned user's pendingTasks
                await User.findByIdAndUpdate(task.assignedUser, { $pull: { pendingTasks: task._id } });
                await User.findByIdAndUpdate(newAssignedUser, { $push: { pendingTasks: task._id } });
                task.assignedUser = newAssignedUser;
                task.assignedUserName = newUser.name;
            }   

            task.name = name;
            task.deadline = deadline;
            task.description = req.body.description || task.description;
            task.completed = req.body.completed || task.completed;
            await task.save();
            res.status(200).json({ message: 'Task updated successfully', data: task });
        } catch (error) {
            //console.error('Error', error);
            res.status(500).json({ message: 'An error occured', data: error.message });
        }
    },

    deleteTask : async (req, res) => {
        try {
            //First we need to check if there's even a task to delete
            const task = await Task.findById(req.params.taskId);
            if (!task) {
                return res.status(404).json({ message: 'Task not found', data: null });
            }

            // Next we need to remove it from the assigned user's pendingTasks if assigned
            if (task.assignedUser) {
                await User.findByIdAndUpdate(task.assignedUser, { $pull: { pendingTasks: task._id } });
            }

            await Task.findByIdAndDelete(req.params.taskId);
            res.status(200).json({ message: 'Task deleted successfully', data: null });
        } catch (error) {
            //console.error('Error', error);
            res.status(500).json({ message: 'An error occured', data: error.message });
        }
    },
};

module.exports = tasksController;
