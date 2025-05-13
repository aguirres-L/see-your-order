// Importar las funciones necesarias de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, /* setDoc, */ updateDoc, deleteDoc, getDoc,   addDoc, setDoc } from "firebase/firestore"
import { query, where } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA3Cn9e9j8iOx6RNQoYfCVUOpLXJmNKPPI",
  authDomain: "verdu-shop.firebaseapp.com",
  projectId: "verdu-shop",
  storageBucket: "verdu-shop.appspot.com",
  messagingSenderId: "188984786995",
  appId: "1:188984786995:web:5c6ce0dd1e82975d1da346" 
};

// Inicializar Firebase y Firestore
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);


//

export async function getUsersFirebase() {
  const userCollection = collection(db, "datos-user"); // remplazaar
  const userSnapshot = await getDocs(userCollection);
  const userList = userSnapshot.docs.map(doc => doc.data());

  return userList;
}




export const addDocumentFirebase = async (collectionName, data) => {
  try {
    // Añade el documento y obtiene la referencia
    const docRef = await addDoc(collection(db, collectionName), data);
    // Agrega el ID de Firestore al documento
    await updateDoc(docRef, { idFirestore: docRef.id });
    return docRef.id;  // Retorna el ID del nuevo documento
  } catch (e) {
    console.error("Error al agregar documento: ", e);
    throw e;
  }
};


export async function addDocumentToSubcollection(
  parentCollectionName,
  parentDocId,
  subCollectionName,
  data
) {
  try {
    // 1. Referencia a la subcolección: match/[parentDocId]/nana
    const subColRef = collection(db, parentCollectionName, parentDocId, subCollectionName);

    // 2. Agregar el documento a la subcolección
    const docRef = await addDoc(subColRef, data);

    // 3. Opcional: guardarte el id en el propio documento
    await updateDoc(docRef, { idFirestore: docRef.id });

    return docRef.id;
  } catch (error) {
    console.error("Error añadiendo documento a la subcolección:", error);
    throw error;
  }
}
 

export const updateDocumentFirebase = async (collectionName, id, data) => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);
   // console.log("Documento actualizado exitosamente.");
  } catch (error) {
    console.error("Error al actualizar documento:", error);
  }
};







///* ------------------------ */



export async function setDocumentFirebase(collectionName, docId, data) {
  try {
    const docRef = doc(db, collectionName, docId); // Referencia con ID personalizado
    await setDoc(docRef, data); // Establece los datos en el documento
   // console.log("Documento creado/actualizado exitosamente!");
    return docRef.id;
  } catch (e) {
    console.error("Error al establecer el documento: ", e);
    throw e;
  }
}

// Función para actualizar un documento en una colección específica


export const updateDocumentFirebasexxx = async (collectionName, idFirestore, data) => {
  try {
    const docRef = doc(db, collectionName, idFirestore);  // Utiliza el ID de Firestore
    await updateDoc(docRef, data);
   // console.log("Documento actualizado exitosamente!");
  } catch (e) {
    console.error("Error al actualizar documento: ", e);
    throw e;
  }
};


export const getDocumentsFirebase = async (collectionName) => {
  try {
    const collectionRef = collection(db, collectionName);
    const querySnapshot = await getDocs(collectionRef);
    
    // Obtener los documentos y retornarlos en forma de array, incluyendo el ID de Firestore
    const documents = querySnapshot.docs.map(doc => ({ idFirestore: doc.id, ...doc.data() }));
    
    return documents;
  } catch (e) {
    console.error("Error al obtener documentos: ", e);
    throw e;
  }
};


// Función para eliminar un documento
export const deleteDocumentFirebase = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);

    // Eliminar el documento de la colección
    await deleteDoc(docRef);
  } catch (e) {
    console.error("Error al eliminar documento: ", e);
    throw e;
  }
};



/*  Get Name but eamil   */

export const getDocumentByFieldFirebase = async (collectionName, field, value) => {
  try {
    // Crear una consulta que busque por el campo dado
    const q = query(collection(db, collectionName), where(field, "==", value));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Retornar el primer documento encontrado
      const docData = querySnapshot.docs[0].data();
      return docData;
    } else {
      return null; // Retornar null si no se encuentra ningún documento
    }
  } catch (e) {
    console.error(`Error al obtener documentos por ${field}: `, e);
    throw e;
  }
};


// Obtener un documento específico por ID
export async function getDocumentFirebaseId(collectionName, docId) {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { idFirestore: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
}

export async function setDocumentFirebase1(collectionName, docId, data) {
  const docRef = db.collection(collectionName).doc(docId);
  await docRef.set(data);
}