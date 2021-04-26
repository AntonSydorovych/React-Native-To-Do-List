import React from 'react';
import { StyleSheet } from 'react-native';
import { ToDoApp } from './ToDoList/Main';

export default function App() {


  return (
    <ToDoApp />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
