//Testing file for git changes

// Best Google search that helped me understand MVC more
// https://www.google.com/search?q=routes+controllers+and+models+style+in+javascrip&rlz=1C1GCEA_enUS1175US1175&oq=routes+controllers+and+models+style+in+javascrip&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQIRigATIHCAIQIRigATIHCAMQIRigAdIBCDg3NzhqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8

const User = require('../models/userM.js');
const { parseHelper } = require('../controllers/parseHelper.js');

const userController = {

    getUsers: async (req, res) => {
        try {
            const { query, query_options, count } = parseHelper(req);
            
            // Essentially if count is true we are told that 
            // "return the count of documents that match the query  (instead of the documents themselves)".
            if (count) {
                const tasks = await User.countDocuments(query);
                return res.status(200).json({ message: "count", data: tasks });
            }

            const options = await User.find(query, query_options.select || null)
             .sort(query_options.sort)
             .skip(query_options.skip)
             .limit(query_options.limit);
            res.status(200).json({ message: "success, following is the list of users", data: options });
        } catch (error) {
            //console.error('Error', error);
            res.status(500).json({ message: 'An error occured', data: error.message });
        }
    },

    postUser : async (req, res) => {
        try {
            const name = req.body.name;
            const email = req.body.email;

            if ( !name || !email ) {
                return res.status(400).json({ message: 'User name and email are required', data: null });
            }

            const assignedUser = await User.findOne({ email });
            //let assignedUserName = "unassigned";

            if (assignedUser) {
                //const finduser = await User.findById(assignedUser);
                //if (!finduser) {
                return res.status(400).json({ message: 'user not found', data: null });
                //}
                //assignedUserName = finduser.name;
            }

            const newUser = new User({
                name,
                email,
                pendingTasks: [],
            });

            //Now we can update the id of the task to the user's pendingTasks array if assignedUser is provided
            //if (assignedUser) {
            //    await User.findByIdAndUpdate(assignedUser, { $push: { pendingTasks: newTask._id } });
            //}
            await newUser.save();
            res.status(201).json({ message: 'User created successfully', data: newUser });
        } catch (error) {
            //console.error('Error', error);
            res.status(500).json({ message: 'An error occured', data: error.message });
        }
    },

    getTaskId : async (req, res) => {
        try {
            const select = req.query.select || '';
            let user = await User.findById(req.params.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found', data: null });
            }
            if (select) {
                user = user.select(select);
            }
            res.status(200).json({ message: 'success, following is the user', data: user });
        } catch (error) {
            //console.error('Error', error);
            res.status(500).json({ message: 'An error occured', data: error.message });
        }
    },

    putUser : async (req, res) => {
        try {
            const name = req.body.name;
            const email = req.body.email;

            if ( !name || !email ) {
                return res.status(400).json({ message: 'User name and email are required', data: null });
            }

            const user = await User.findById(req.params.userId);
            if (!user) {
                return res.status(404).json({ message: 'User was not found', data: null });
            }

            //Now we need to handle if the assigned user is being changed
            const newAssignedUser = await User.findOne({ email: req.body.assignedUserEmail, _id : { $ne: req.params.userId } });
            if (newAssignedUser) {
                //const newUser = await User.findById(newAssignedUser);
                //if (!newUser) {
                return res.status(400).json({ message: 'New assigned user not found', data: null });
                //}

                // Now if we did find the new User we need to remove task from old assigned user's pendingTasks
                //await User.findByIdAndUpdate(user.assignedUser, { $pull: { pendingTasks: user._id } });
                //await User.findByIdAndUpdate(newAssignedUser, { $push: { pendingTasks: user._id } });
                //user.assignedUser = newAssignedUser;
                //user.assignedUserName = newUser.name;
            }

            user.name = name;
            user.email = email;
            user.pendingTasks = user.pendingTasks;
            
            await user.save();
            res.status(200).json({ message: 'User updated successfully', data: user });
        } catch (error) {
            //console.error('Error', error);
            res.status(500).json({ message: 'An error occured', data: error.message });
        }
    },

    deleteUser : async (req, res) => {
        try {
            //First we need to check if there's even a user to delete
            const user = await User.findById(req.params.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found', data: null });
            }

            // Next we need to remove it from the assigned user's pendingTasks if assigned
            if (user.assignedUser) {
                await User.findByIdAndUpdate(user.assignedUser, { $pull: { pendingTasks: user._id } });
            }

            await User.findByIdAndDelete(req.params.userId);
            res.status(200).json({ message: 'User deleted successfully', data: null });
        } catch (error) {
            //console.error('Error', error);
            res.status(500).json({ message: 'An error occured', data: error.message });
        }
    },
};

module.exports = userController;
