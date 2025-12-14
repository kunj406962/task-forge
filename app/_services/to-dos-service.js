import { db } from "../_utils/firebase";
import { doc, collection, getDocs, addDoc, query, updateDoc, deleteDoc, serverTimestamp, where, Timestamp } from "firebase/firestore";

export const getToDos = async (userId) => {
    try{
        const toDos = [];
        const toDosRef = collection(db, 'users', userId, 'todos');
        const getData = await getDocs(toDosRef);
        getData.forEach((toDo)=>{
            toDos.push({
                id: toDo.id,
                ... toDo.data()
            })
        })

        return toDos;
        
    }catch(error){
        console.error("Error fetching to-dos: ", error)
    }
}

export const addTodo=async(userId, todoData)=>{
    try{
        const todosRef= collection(db, "users", userId, "todos");
        const newTodo={
            ...todoData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        }
        const docRef= await addDoc(todosRef, newTodo);
    }catch(error){
        console.error("Error adding to-do: ", error)
    }
}

export const updateTodo = async (userId, todoId, updates) => {
    try{
        const todoRef = doc(db, 'users', userId, 'todos', todoId);
        await updateDoc(todoRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
    }catch(error){
        console.error("Error updating to-do: ", error)
    }
};

export const deleteTodo = async (userId, todoId) => {
    try{
        const todoRef = doc(db, 'users', userId, 'todos', todoId);
        await deleteDoc(todoRef);
    }catch(error){
        console.error("Error deleting to-do: ", error)
    }
};

export const getTodosDueOnDate = async (userId, targetDate) => {
  try {
    const todosRef = collection(db, 'users', userId, 'todos');
    
    // Query for todos with dueDate equal to targetDate
    const q = query(
      todosRef,
      where('dueDate', '==', targetDate),
      where('completed', '==', false) // Only get incomplete ones
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
  } catch (error) {
    console.error("Error getting todos for date:", error);
    return [];
  }
};