import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, query, where, getDocs  } from 'firebase/firestore';
import dotenv from "dotenv";
dotenv.config();

// Configuração do Firebase (substitua pelas suas credenciais)
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
};

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
  id: string;
  flight: string;
  user: string;
  user_name: string;
  weight: number;
  space: string;
  a_date: string;
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
export async function setUser(userData: User) {
  try {
    const docRef = collection(db, "user")
    await addDoc(docRef, userData);
    console.log('User data set successfully');
  } catch (e) {
    console.error('Error setting document: ', e);
  }
}

// Função para ler um documento
export async function getUser(userId: string) {
  try {
    const docRef = doc(db, 'user', userId);    //buscar na coleção "user" o documento userid
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data() as User; //guardar as informações no tipo User
      console.log('User data:', userData);
    } else {
      console.log('No such document!');
    }
  } catch (e) {
    console.error('Error getting document: ', e);
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


// Função para adicionar ou atualizar um documento para a interface Offer
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
    
