import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { TaskContext } from '../context/TaskContext';

const CompletedTasks = ({ navigation }) => {
  const { completedTasks, setCompletedTasks } = useContext(TaskContext);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tasks based on the search query
  const filteredTasks = completedTasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteTask = (index) => {
    const updatedTasks = completedTasks.filter((_, i) => i !== index);
    setCompletedTasks(updatedTasks);
  };

  return (
    <View style={styles.container}>
      {/* Header with back button and search input */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        {/* Search input */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks..."
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
      </View>

      <Text style={styles.sectionTitle}>Completed Tasks</Text>

      {filteredTasks.length > 0 ? (
        <FlatList
          data={filteredTasks}
          renderItem={({ item, index }) => (
            <View style={styles.item}>
              <View>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDeleteTask(index)}>
                <Text style={styles.deleteButton}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View style={styles.noTasksContainer}>
          <Text style={styles.noTasksText}>No completed tasks yet!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edf2fb',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#edf2fb',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  backButtonText: {
    color: '#0353a4',
    fontSize: 18,
    fontWeight: '600',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#6EACDA',
    borderRadius: 100,
    backgroundColor: '#e2eafc',
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#6EACDA',
    fontFamily: 'Helvetica Neue',
  },
  item: {
    backgroundColor: '#6EACDA',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#03346E',
  },
  description: {
    fontSize: 14,
    color: '#021526',
  },
  deleteButton: {
    fontSize: 18,
    color: '#FF0000',
  },
  noTasksContainer: {
    marginTop: 250,
    alignItems: 'center',
  },
  noTasksText: {
    fontSize: 18,
    color: '#6EACDA',
  },
});

export default CompletedTasks;
