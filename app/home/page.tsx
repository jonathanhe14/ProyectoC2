"use client"

import { useAuthenticator } from '@aws-amplify/ui-react';
import { useEffect,useState } from 'react';
import { useRouter } from 'next/navigation';
import { singletonEventRole } from 'aws-cdk-lib/aws-events-targets';
import { signOut } from 'aws-amplify/auth';
import Header from '@/app/components/Header';
import { Classcard } from '../components/Classcard';
import {Amplify} from 'aws-amplify';
import outputs from "../../amplify_outputs.json";
import { generateClient } from 'aws-amplify/data';
import { Schema } from '../../amplify/data/resource';


Amplify.configure(outputs);

interface Card {
  level: string | null;
  className: string | null;
  time: string | null;
  date: string | null;
  description: string | null;
  instructor: string | null;
  slotsAvailable: number | null;
}

interface TimeSlot {
  id?: string;
  timeSlotId?: string | null;
  time?: string | null;
  date?: string | null;
  slotsAvailable?: number | null;
  classId: string ; // Add this line
}
interface Class {
  id: string;
  classId: string; // Permitir null
  className: string | null;
  level:string|null;
  description:string|null;
  instructor:string|null;
}
const client = generateClient<Schema>({
  authMode: "apiKey",
});





function page() {
  const { user, route, signOut } = useAuthenticator((context) => [context.user, context.route]);
  const router = useRouter();
  const [card, setCard] = useState<Card[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [classData, setDataClass] = useState<Class[]>([]);
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    if (route !== 'authenticated') {
      router.push('/sign-in');
    }
    fetchClass();
    fetchTimeSlots();
  }, [route, router]);

  // Solo llamar a createCard cuando los datos estén completamente cargados
  useEffect(() => {
    if (classData.length > 0 && timeSlots.length > 0) {
      createCard(); // Ahora solo se llama aquí, una vez que los datos están cargados
      setShowCards(true); // Marcamos que los datos están listos para ser mostrados
    }
  }, [classData, timeSlots]); // Este useEffect depende solo de classData y timeSlots

  const createCard = () => {
    let newCards: Card[] = [];
    const timeSlotMap: { [key: string]: TimeSlot[] } = {}; // Cambiamos el mapa a un arreglo de TimeSlot por classId
  
    // Llenamos el mapa de timeSlots con arrays para cada classId
    for (let i = 0; i < timeSlots.length; i++) {
      if (timeSlots[i].classId != null) {
        // Si no existe el array para este classId, lo creamos
        if (!timeSlotMap[timeSlots[i].classId]) {
          timeSlotMap[timeSlots[i].classId] = [];
        }
        // Agregamos el TimeSlot al array correspondiente
        timeSlotMap[timeSlots[i].classId].push(timeSlots[i]);
      }
    }
  
    // Ahora iteramos sobre classData y para cada classId encontramos los TimeSlots correspondientes
    for (let i = 0; i < classData.length; i++) {
      const timeSlotsForClass = timeSlotMap[classData[i].classId];
      if (timeSlotsForClass) {
        // Si existen TimeSlots para esta clase, iteramos sobre ellos
        for (let j = 0; j < timeSlotsForClass.length; j++) {
          const timeSlot = timeSlotsForClass[j];
          newCards.push({
            level: classData[i].level,
            className: classData[i].className,
            time: timeSlot.time ?? null,  // Usamos null si es undefined
            date: timeSlot.date ?? null,  // Usamos null si es undefined
            description: classData[i].description,
            instructor: classData[i].instructor,
            slotsAvailable: timeSlot.slotsAvailable ?? null,  // Usamos null si es undefined
          });
        }
      }
    }
  
    // Actualizamos el estado solo una vez
    setCard(newCards); // Ahora solo reemplazamos el estado, no agregamos más
    console.log("Cards:", newCards);
  };
  

  const fetchClass = async () => {
    try {
      const { data: items, errors } = await client.models.Class.list();
      if (errors) {
        console.error(errors);
      } else {
        setDataClass(items);
      }
    } catch (error) {
      console.error("Error fetching clases:", error);
    }
  }

  const fetchTimeSlots = async () => {
    try {
      const { data: items, errors } = await client.models.TimeSlot.list();
      if (errors) {
        console.error(errors);
      } else {
        const newArr = items.filter((item) => item.classId !== null);
        setTimeSlots(items);
      }
    } catch (error) {
      console.error("Error fetching clases:", error);
    }
  }

  if (route !== 'authenticated') {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      {showCards ? card.map(({ className, level, description, instructor, time, date }) => (
        <Classcard
          key={className} // Siempre es buena práctica poner una "key" única
          className={className}
          level={level}
          description={description}
          instructor={instructor}
          time={time}
          date={date}
        />
      )) : <p>Cargando...</p>}
    </div>
  );
}

export default page;
