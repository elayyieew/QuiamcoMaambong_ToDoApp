import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, Alert, Platform, KeyboardAvoidingView, ScrollView, Image } from 'react-native';
import Task from './Task';
import { TaskContext } from '../context/TaskContext';

const TaskScreen = ({ navigation }) => {
    const { completedTasks, setCompletedTasks } = useContext(TaskContext);
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskItems, setTaskItems] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleAddTask = () => {
        if (!taskTitle || !taskDescription) {
            Alert.alert('Error', 'Please fill in both title and description.');
            return;
        }

        Keyboard.dismiss();

        if (isEditing) {
            let itemsCopy = [...taskItems];
            itemsCopy[currentTaskIndex] = { title: taskTitle, description: taskDescription, completed: false };
            setTaskItems(itemsCopy);
            setIsEditing(false);
            setCurrentTaskIndex(null);
        } else {
            setTaskItems([...taskItems, { title: taskTitle, description: taskDescription, completed: false }]);
        }

        setTaskTitle('');
        setTaskDescription('');
    };

    const handleCompleteTask = (index) => {
        let itemsCopy = [...taskItems];
        itemsCopy[index].completed = true;
        setTaskItems(itemsCopy);
        setCompletedTasks([...completedTasks, itemsCopy[index]]);
        itemsCopy.splice(index, 1);
        setTaskItems(itemsCopy);
    };

    const handleEditTask = (index) => {
        setTaskTitle(taskItems[index].title);
        setTaskDescription(taskItems[index].description);
        setIsEditing(true);
        setCurrentTaskIndex(index);
    };

    const handleDeleteTask = (index) => {
        let itemsCopy = [...taskItems];
        itemsCopy.splice(index, 1);
        setTaskItems(itemsCopy);
    };

    const filteredTasks = taskItems.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={90}
            >
                <View style={styles.tasksWrapper}>
                    <Text style={styles.sectionTitle}>Tasks for Today</Text>
                    
                    {/* Search TextInput */}
                    <TextInput
                        style={styles.searchInput}
                        placeholder='Search Tasks'
                        value={searchQuery}
                        onChangeText={text => setSearchQuery(text)}
                    />
                    
                    <TouchableOpacity
                        style={styles.completedButton}
                        onPress={() => navigation.navigate('CompletedTasks')}
                    >
                        <Text style={styles.completedButtonText}>View Completed Tasks</Text>
                    </TouchableOpacity>
                    
                    {/* Display logo and message if no tasks */}
                    {taskItems.length === 0 && (
                        <View style={styles.noTasksWrapper}>
                            <Image source={require('../assets/logo.png')} style={styles.logo} />
                            <Text style={styles.noTasksText}>No tasks created yet. Please add some tasks!</Text>
                        </View>
                    )}
                </View>

                <ScrollView style={styles.items}>
                    {filteredTasks.map((item, index) => (
                        <Task
                            key={index}
                            title={item.title}
                            description={item.description}
                            completed={item.completed}
                            onDelete={() => handleDeleteTask(index)}
                            onEdit={() => handleEditTask(index)}
                            onCheck={() => handleCompleteTask(index)}
                        />
                    ))}
                </ScrollView>

                <View style={styles.writeTaskWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder={'Task Title'}
                        value={taskTitle}
                        onChangeText={text => setTaskTitle(text)}
                    />
                    <TextInput
                        style={[styles.input, styles.descriptionInput]}
                        placeholder={'Task Description'}
                        value={taskDescription}
                        onChangeText={text => setTaskDescription(text)}
                    />
                    <TouchableOpacity onPress={handleAddTask}>
                        <View style={styles.addWrapper}>
                            <Text style={styles.addText}>{isEditing ? '✓' : '+'}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#edf2fb',
    },
    tasksWrapper: {
        paddingTop: 100,
        paddingHorizontal: 20,
        flex: 1,
    },
    sectionTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'Helvetica Neue',
        color: '#6EACDA',
    },
    completedButton: {
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#007BFF',
        backgroundColor: 'transparent',
        alignSelf: 'center',
    },
    completedButtonText: {
        fontSize: 16,
        color: '#007BFF',
        textAlign: 'center',
        fontFamily: 'Avenir Next',
    },
    searchInput: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginTop: 30,
        backgroundColor: '#e2eafc',
        borderRadius: 20,
        borderColor: '#6096ba',
        borderWidth: 1,
        marginBottom: 20,
    },
    items: {
        marginTop: 30,
        paddingHorizontal: 20,
        maxHeight: 400,
    },
    writeTaskWrapper: {
        padding: 20,
        paddingBottom: 10,
        backgroundColor: '#edf2fb',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    input: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: '#e2eafc',
        borderRadius: 60,
        borderColor: '#6096ba',
        borderWidth: 1,
        width: '40%',
        marginRight: 10,
    },
    descriptionInput: {
        flex: 1,
        marginRight: 10,
    },
    addWrapper: {
        width: 60,
        height: 60,
        backgroundColor: '#a3cef1',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addText: {
        fontSize: 24,
    },
    noTasksWrapper: {
        marginTop: 150,
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    noTasksText: {
        color: '#6EACDA',
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'Helvetica Neue',
    },
});

export default TaskScreen;
