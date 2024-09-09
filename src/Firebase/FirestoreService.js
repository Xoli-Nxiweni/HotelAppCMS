// src/Firebase/FirestoreService.js
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

// Initialize Firestore
const db = getFirestore();

// Fetch a collection from Firestore
export const fetchCollection = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

// Add a document to a collection
export const addDocument = async (collectionName, document) => {
  try {
    await addDoc(collection(db, collectionName), document);
  } catch (error) {
    console.error('Error adding document:', error);
  }
};

// Update a document in a collection
export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

// Delete a document from a collection
export const deleteDocument = async (collectionName, id) => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting document:', error);
  }
};

// Fetch users from a collection
export const fetchUsers = async () => {
  return await fetchCollection('users');
};

// Add a user to a collection
export const addUser = async (user) => {
  await addDocument('users', user);
};

// Update a user in a collection
export const updateUser = async (id, updates) => {
  await updateDocument('users', id, updates);
};

// Delete a user from a collection
export const deleteUser = async (id) => {
  await deleteDocument('users', id);
};
