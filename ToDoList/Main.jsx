import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

export const ToDoApp = () => {
    const [newTaskText, setNewTaskText] = useState(' ');
    const [id, setId] = useState(+localStorage.getItem('id') || 0);
    const [tasks, updateTasks] = useState([]);
    const [edittedText, setEdittedText] = useState(' ');

    let saveId = () => {
        localStorage.setItem('id', JSON.stringify(id));
    }

    let saveTasksToLS = (tasks) => {
        localStorage.setItem('myTasks', JSON.stringify(tasks));
    }

    useEffect(() => {
        if (tasks.length == 0 && JSON.parse(localStorage.getItem('myTasks')).length !== 0) {
            setId(+localStorage.getItem('id') + 1)
            updateTasks(JSON.parse(localStorage.getItem('myTasks')));
        }
    }, [tasks]);

    const writingTask = (taskText) => {
        setNewTaskText(taskText)
    };

    const edittingTask = (taskText) => {
        setEdittedText(taskText)
    };

    const addNewTask = () => {
        if (newTaskText == ' ') return;
        const newTask = {
            text: newTaskText,
            id: id,
            key: id,
            isDone: false,
            isEditting: false
        };
        updateTasks([...tasks, newTask])
        setNewTaskText(' ');
        setId(id + 1);
        localStorage.setItem('myTasks', JSON.stringify([...tasks, newTask]));
        saveId();
    }

    const getTaskDone = (taskId) => {
        const isDoneTasks = tasks.map(task => {
            return task.id == taskId ? task = { ...task, isDone: !task.isDone, key: task.key } : task = task
        })
        updateTasks(isDoneTasks);
        saveTasksToLS(isDoneTasks);
    }

    const getTaskEditable = (taskId, text, isEditting) => {
        let mappedTasks;
        !isEditting ?
            (mappedTasks = tasks.map(task => {
                return task.id == taskId ?
                    task = {
                        ...task,
                        isEditting: !task.isEditting
                    } :
                    task = task
            }),
                updateTasks(mappedTasks),
                setEdittedText(text))
            :
            (mappedTasks = tasks.map(task => {
                return task.id == taskId ?
                    task = {
                        ...task,
                        isEditting: !task.isEditting,
                        text: edittedText
                    } :
                    task = task
            }),
                updateTasks(mappedTasks),
                setEdittedText(text),
                saveTasksToLS(mappedTasks));
    };

    const deleteTask = (taskId) => {
        let newTasks = tasks.filter(task => task.id !== taskId);
        updateTasks(newTasks);
        saveTasksToLS(newTasks);

        if (tasks.length == 1) {
            clearLocalStorage()
            location.reload()
        }


    }

    const clearLocalStorage = () => {
        localStorage.removeItem('id');
    };

    const inputArea = () => {
        return (
            <TextInput
                style={styles.inputArea}
                onChangeText={(e) => writingTask(e)}
                value={newTaskText}
            />
        )
    }

    const addTaskButton = () => {
        return (
            <TouchableOpacity
                onPress={() => addNewTask()}
                style={styles.button}>
                <Text style={styles.buttonText}>Add new task</Text>
            </TouchableOpacity>
        )
    }

    const deleteTaskButton = (id) => {
        return (
            <TouchableOpacity
                onPress={() => deleteTask(id)}
                style={styles.button}>
                <Text style={styles.delButtonText}>Delete</Text>
            </TouchableOpacity>
        )
    }

    const editButton = (id, text, isEditting) => {
        return (
            !isEditting ?
                <TouchableOpacity
                    onPress={() => getTaskEditable(id, text, isEditting)}
                    style={[styles.button, { borderRightWidth: 1 }]}>
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity> :
                <TouchableOpacity
                    onPress={() => getTaskEditable(id, text, isEditting)}
                    style={[styles.button, { borderRightWidth: 1 }]}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
        )
    }

    const getDoneButton = (id, isDone, isEditting) => {
        return (isEditting ?
            (<TouchableOpacity
                onPress={() => alert("you can't do this while editting")}
                style={styles.button} >
                <Text style={[styles.button, { borderRightWidth: 1 }]}>Done</Text>
            </TouchableOpacity >) :
            !isDone ?
                (<TouchableOpacity
                    onPress={() => getTaskDone(id)}
                    style={[styles.button, { borderRightWidth: 1 }]} >
                    <Text style={styles.buttonText}>Done</Text>
                </TouchableOpacity >) :
                (<TouchableOpacity
                    onLongPress={() => getTaskDone(id)}
                    style={[styles.button, { borderRightWidth: 1 }]}>
                    <Text style={styles.buttonText}>Get active</Text>
                </TouchableOpacity>))
    }

    const taskList = () => {
        if (tasks.length > 0) {
            return tasks.map(task => {

                return <View style={styles.singleTask} key={task.id} >
                    {task.isDone ?
                        <Text style={[styles.inputForTaskList, styles.isDone]}>  {task.text} </Text> :
                        task.isEditting ?
                            <TextInput
                                style={styles.input}
                                onChangeText={(e) => edittingTask(e)}
                                value={edittedText}
                            /> :
                            <Text onPress={() => { }} style={styles.inputForTaskList}>  {task.text} </Text>
                    }
                    <View style={styles.wrapper}>
                        {getDoneButton(task.id, task.isDone, task.isEditting)}
                        {editButton(task.id, task.text, task.isEditting)}
                        {deleteTaskButton(task.id)}
                    </View>
                </View>
            })
        }
    }

    return (

        <View style={styles.mainWraper}>
            <View style={styles.extraWraper}>
                <Text style={styles.text}> Just do it </Text>
            </View>
            {inputArea()}
            {addTaskButton()}
            {taskList()}
        </View>
    )
}

const styles = StyleSheet.create({
    extraWraper: {
        flexDirection: 'row',
    },

    mainWraper: {
        flex: 1,
        backgroundColor: '#202124',
        alignItems: 'center',
        justifyContent: 'flex-start',

    },

    image: {
        flex: 1,
        resizeMode: "cover",
    },

    singleTask: {
        marginTop: 40,
        minWidth: 230,
        maxWidth: 'auto',
        height: 'auto',

        shadowColor: "white",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,

        elevation: 24,
    },

    inputArea: {
        height: 60,
        margin: 12,
        borderWidth: 1,
        borderColor: 'white',
        color: 'white',
        textDecorationLine: 'none',
        fontSize: 20
    },

    constant: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 60
    },
    text: {
        fontSize: 22,
        fontWeight: "bold",
        color: 'white',
        fontStyle: 'italic',
        flexWrap: 'wrap',
        maxWidth: 'auto',
        height: 'auto'
    },

    input: {
        backgroundColor: 'black',
        color: 'white',
    },

    button: {
        height: 30,
        minWidth: 77,
        borderRightWidth: 0,
        borderColor: 'white',
        backgroundColor: '#363636',
        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonText: {
        color: 'white',
    },

    delButtonText: {
        color: 'red',
    },

    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },

    inputForTaskList: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 40,
        minWidth: 150,
        maxWidth: 650,
        margin: 12,
        color: 'white',
        fontSize: 20
    },

    isDone: {
        textDecorationLine: 'line-through',
        textDecorationStyle: "solid",
        textDecorationColor: "red",
        borderColor: '#202124',
        backgroundColor: '#202124'
    },


});
