"use client"
import {
  Card,
  useTheme,
  Theme,
  defaultDarkModeOverride,
} from "@aws-amplify/ui-react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useEffect,useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import {Amplify} from 'aws-amplify';
import outputs from "../../amplify_outputs.json";
import { generateClient } from 'aws-amplify/data';
import { Schema } from '../../amplify/data/resource';
import "@aws-amplify/ui-react/styles.css";
import { NewCard } from '../components/NewCard';
import { Stack } from '@chakra-ui/react';
import { Alert } from '@aws-amplify/ui-react';


Amplify.configure(outputs);

interface Card {
  className: string;
  level: string;
  description: string;
  instructor: string;
  time: string;
  date: string;
  slotsAvailable?: number;
  timeSlotId?: string;
  userName: string;
  attendeeId?: string;
  id: string;
}

interface MyClass {
  readonly id: string;
  myClassId: string | null;
  userName: string | null;
  className: string | null;
  level: string | null;
  description: string | null;
  instructor: string | null;
  time: string | null;
  date: string | null;
  attendeeId: string | null;
}

const client = generateClient<Schema>({
  authMode: "apiKey",
});

function Page() {
  const { user, route, signOut } = useAuthenticator((context) => [context.user, context.route]);
  const router = useRouter();
  const [card, setCard] = useState<Card[]>([]);
  const [myClassData, setMyClassData] = useState<MyClass[]>([]);
  const [showCards, setShowCards] = useState(false);
  const [username] = useState(user?.signInDetails?.loginId);
  const { tokens } = useTheme();
  const theme: Theme = {
    name: "Auth Example Theme",
    overrides: [defaultDarkModeOverride],
  };

  useEffect(() => {
      fetchMyClass();
  }, [route,router]);

  useEffect(() => {
    if (myClassData.length > 0) {
      const formattedCards = myClassData.map(({ id,userName, className, level, description, instructor, time, date,attendeeId }) => ({
        className: className || '',
        level: level || '',
        description: description || '',
        instructor: instructor || '',
        time: time || '',
        date: date || '',
        userName: userName || '',
        attendeeId: attendeeId || '',
        id: id || '',
      }));
      setCard(formattedCards);
      
    }
    setShowCards(true);
  }, [myClassData]);

  const fetchMyClass = async () => {
    try {

      const { data: items, errors } = await client.models.MyClass.list({
        filter: {
          userName: {
            eq: username,
          },
        },
      });
      console.log(items);
      if (errors) {
        throw new Error("Error al obtener las clases: " + JSON.stringify(errors));
      }

      setMyClassData(items || []); 

    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };


  return (
    <div>
      <Header />
      <div className="w-4/5 mx-auto">
        <h2 className="text-3xl text-black font-bold text-center mb-4">
          Mis clases
        </h2>
        <Stack
          gap="4"
          direction="row"
          wrap="wrap"
          className="p-5 justify-center"
        >
      {showCards ? (
        card.map(({ className, level, description, instructor, time, date,attendeeId,id}) => (
          <NewCard
          key={id} 
          className={className}
          level={level}
          description={description}
          instructor={instructor}
          time={time}
          date={date}
          userName={user.signInDetails?.loginId}
          tipo="2"
          attendeeId={attendeeId}
          id={id}
        />
          
        ))
      ) : (
        <p>Cargando...</p>
      )}
      {card.length === 0 && <Alert
  variation="info"
  isDismissible={false}
  hasIcon={true}
  heading="No tienes clases inscritas"
  >
  Actualmete no te has inscrito a ninguna clase
</Alert>}
            </Stack>
    </div>
    </div>
  );
}

export default Page;

