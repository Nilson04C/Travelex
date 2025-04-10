import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, query, where, getDocs  } from 'firebase/firestore';
import admin from "firebase-admin";
import serviceAccountJson from "./travelex-aedc8-firebase-adminsdk-fbsvc-50fadc7c38.json";
import { ServiceAccount } from "firebase-admin";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const serviceAccount = serviceAccountJson as ServiceAccount;


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const auth = admin.auth();

// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
};

const FIREBASE_API_KEY = process.env.apiKey;

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Definir um tipo para os dados
interface User {
  name: string;
  phone_number: string;
  email: string;
  created_at: Date;
}

interface Flight {
  number: string;
  a_date: Date;
  d_date: Date;
  origin: string;
  destiny: string;
}

interface Offer {
  flight: string;
  user: string;
  user_name: string;
  weight: number;
  space: string;
  date: string;
}

interface Delivery {
  client: number;
  traveler: number;
  content: string;
  flight: string;
  status: string;
}

interface Transaction {
  id: number;
  amount: number; 
  currency: string;
  delivery: number;
  status: string;
  time: Date;
}


// Função para adicionar ou atualizar um documento
export async function setUser(userData: User, uid: string) {
  try {
    // Define a referência ao documento com o ID do usuário (uid)
    const docRef = doc(db, "user", uid);

    // Usa setDoc para salvar os dados do usuário no Firestore
    await setDoc(docRef, userData);
    console.log("User data set successfully with UID:", uid);
  } catch (e) {
    console.error("Error setting document: ", e);
    throw new Error("Erro ao salvar os dados do usuário no Firestore.");
  }
}


export async function addUser(email: string, password: string) {
  try { 
    const userRecord = await auth.createUser({
      email,
      password,
    });
    console.log("Usuário criado no Firebase Auth:", userRecord.uid);
    return String(userRecord.uid);
  }
  catch (e) {
    console.error('Error updating document: ', e);
  }
}

// Função para ler um documento
export async function getUser(userId: string): Promise<User | null> {
  try {
    const docRef = doc(db, "user", userId); // Buscar na coleção "user" o documento userId
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data() as User; // Guardar as informações no tipo User
      console.log("User data:", userData);
      return userData;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (e) {
    console.error("Error getting document: ", e);
    throw new Error("Erro ao buscar os dados do usuário.");
  }
}

// Função para adicionar ou atualizar um documento para a interface Flight
export async function setFlight(flightData: Flight) {
  try {
    const docRef = collection(db, "flight");
    await addDoc(docRef, flightData);
    console.log('Flight data set successfully');
  } catch (e) {
    console.error('Error setting flight document: ', e);
  }
}

export async function getFlight(flightId: string) {
  try {
    const docRef = doc(db, 'flight', flightId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const flightData = docSnap.data() as Flight;
      console.log('Flight data:', flightData);
    } else {
      console.log('No such flight document!');
    }
  } catch (e) {
    console.error('Error getting flight document: ', e);
  }
}


// Função para adicionar um documento para a interface Offer
export async function setOffer(offerData: Offer) {
  try {
    const docRef = collection(db, "offer");
    await addDoc(docRef, offerData);
    console.log('Offer data set successfully');
  } catch (e) {
    console.error('Error setting offer document: ', e);
  }
}

export async function getOffer(offerId: string[]) {
  try {
    for(var id of offerId)
    {
      const docRef = doc(db, 'offer', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const offerData = docSnap.data() as Offer;
        console.log('Offer data:', offerData);
      } else {
        console.log('No such offer document!');
      }
    }
  } catch (e) {
    console.error('Error getting offer document: ', e);
  }
}


// Função para adicionar ou atualizar um documento para a interface Delivery
export async function setDelivery(deliveryData: Delivery) {
  try {
    const docRef = collection(db, "delivery");
    await addDoc(docRef, deliveryData);
    console.log('Delivery data set successfully');
  } catch (e) {
    console.error('Error setting delivery document: ', e);
  }
}

export async function getDelivery(deliveryId: string) {
  try {
    const docRef = doc(db, 'delivery', deliveryId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const deliveryData = docSnap.data() as Delivery;
      console.log('Delivery data:', deliveryData);
    } else {
      console.log('No such delivery document!');
    }
  } catch (e) {
    console.error('Error getting delivery document: ', e);
  }
}


// Função para adicionar ou atualizar um documento para a interface Transaction
export async function setTransaction(transactionData: Transaction) {
  try {
    const docRef = collection(db, "transaction");
    await addDoc(docRef, transactionData);
    console.log('Transaction data set successfully');
  } catch (e) {
    console.error('Error setting transaction document: ', e);
  }
}

export async function getTransaction(transactionId: string) {
  try {
    const docRef = doc(db, 'transaction', transactionId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const transactionData = docSnap.data() as Transaction;
      console.log('Transaction data:', transactionData);
    } else {
      console.log('No such transaction document!');
    }
  } catch (e) {
    console.error('Error getting transaction document: ', e);
  }
}



// Função para buscar todas as offers com base no origin e destination do flight
export async function getOffersByRoute(origin: string, destination: string) {
  try {
    // Passo 1: Buscar os voos com o origin e destination específicos
    const flightQuery = query(
      collection(db, "flight"),
      where("origin", "==", origin),
      where("destination", "==", destination)
    );

    console.log(origin, destination);

    const flightDocs = await getDocs(flightQuery);

    if (flightDocs.empty) {
      console.log("Nenhum voo encontrado com o origin e destination especificados.");
      return;
    }

    // Obter os IDs dos voos encontrados
    const flightIds = flightDocs.docs.map((doc) => doc.id);

    console.log("Voos encontrados:", flightIds);

    // Passo 2: Buscar as offers associadas aos voos encontrados
    const offerQuery = query(
      collection(db, "offer"),
      where("flight", "in", flightIds) // Filtrar as offers com base nos IDs dos voos
    );

    const offerDocs = await getDocs(offerQuery);

    if (offerDocs.empty) {
      console.log("Nenhuma oferta encontrada para os voos especificados.");
      return;
    }

    // Obter os dados das offers
    const offers = offerDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    console.log("Offers encontradas:", offers);
    return offers;
  } catch (e) {
    console.error("Erro ao buscar offers por origin e destination:", e);
  }
}

export async function getDeliverybyUser(user: string) {
  try {
    // Consulta 1: Buscar deliveries onde "client" é igual ao "user"
    const clientQuery = query(
      collection(db, "delivery"),
      where("client", "==", user)
    );


    // Consulta 2: Buscar deliveries onde "traveler" é igual ao "user"
    const travelerQuery = query(
      collection(db, "delivery"),
      where("traveler", "==", user)
    );

    // Executar ambas as consultas
    const [clientDocs, travelerDocs] = await Promise.all([
      getDocs(clientQuery),
      getDocs(travelerQuery),
    ]);

    // Combinar os resultados das duas consultas
    const deliveries = [
      ...clientDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      ...travelerDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    ];

    // Verifica se não há entregas encontradas
    if (deliveries.length === 0) {
      console.log("Nenhuma entrega encontrada para o usuário especificado.");
      return;
    }

    // Remover duplicatas, caso existam
    const uniqueDeliveries = Array.from(
      new Map(deliveries.map((delivery) => [delivery.id, delivery])).values()
    );


    //console.log("Deliveries encontradas:", uniqueDeliveries);
    return uniqueDeliveries;
  } catch (e) {
    console.error("Erro ao buscar deliveries por usuário:", e);
  }
}



export async function authenticateUser(email: string, password: string): Promise<string> {
  try {
    // Autentica o usuário usando a Firebase Authentication REST API
    interface AuthResponse {
      idToken: string;
      refreshToken: string;
      expiresIn: string;
      localId: string;
    }

    const response = await axios.post<AuthResponse>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true, // Garante que o ID Token seja retornado
      }
    );

    const idToken = response.data.idToken; // Obtém o ID Token da resposta
    console.log("ID Token gerado com sucesso:", idToken);

    return idToken; // Retorna o ID Token
  } catch (error) {
    console.error("Erro ao autenticar usuário:", error);
    throw new Error("Credenciais inválidas.");
  }
}

export async function verifyToken(token: string): Promise<string> {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("Token verificado com sucesso:", decodedToken);
    return decodedToken.uid; // Retorna o UID do usuário
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    throw new Error("Token inválido.");
  }
}

