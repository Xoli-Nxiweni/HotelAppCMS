import { db } from './Firebase'; // Ensure this path is correct
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

// Fetch a collection from Firestore
export const fetchCollection = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    let data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
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
      console.log('Collection Name:', collectionName);
      console.log('Document ID:', docId);
      console.log('Data:', data);
  
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

// Add a user to a collection
export const addUser = async (collectionName, user) => {
  try {
    await addDoc(collection(db, collectionName), user);
  } catch (error) {
    console.error('Error adding user:', error);
  }
};

// Delete a user from a collection
export const deleteUser = async (collectionName, id) => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

// Fetch users from a collection
export const fetchUsers = async (collectionName) => {
  try {
    return await fetchCollection(collectionName); // Reuse fetchCollection for users
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// Update a user in a collection
export const updateUser = async (collectionName, id, updates) => {
  try {
    await updateDocument(collectionName, id, updates);
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

