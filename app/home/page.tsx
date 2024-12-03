"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";
import { generateClient } from "aws-amplify/data";
import { Schema } from "../../amplify/data/resource";
import { NewCard } from "../components/NewCard";
import { Stack } from "@chakra-ui/react";
import { Alert } from "@aws-amplify/ui-react";

Amplify.configure(outputs);

interface Card {
  level: string | null;
  className: string | null;
  time: string | null;
  date: string | null;
  description: string | null;
  instructor: string | null;
  slotsAvailable: number | null;
  timeSlotId: string | undefined;
  classId: string | undefined;
  attendeeId?: string | undefined;
}

interface TimeSlot {
  id?: string;
  timeSlotId?: string | null;
  time?: string | null;
  date?: string | null;
  slotsAvailable?: number | null;
  classId: string; 
}
interface Class {
  id: string;
  classId: string; 
  className: string | null;
  level: string | null;
  description: string | null;
  instructor: string | null;
}
const client = generateClient<Schema>({
  authMode: "apiKey",
});

function page() {
  const { user, route, signOut } = useAuthenticator((context) => [
    context.user,
    context.route,
  ]);
  const router = useRouter();
  const [card, setCard] = useState<Card[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [classData, setDataClass] = useState<Class[]>([]);
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    if (route !== "authenticated") {
      router.push("/sign-in");
    }
    fetchClass();
    fetchTimeSlots();
  }, [route, router]);

  useEffect(() => {
    if (classData.length > 0 && timeSlots.length > 0) {
      createCard();
    }
    setShowCards(true);
  }, [classData, timeSlots]);

  const createCard = () => {
    let newCards: Card[] = [];
    const timeSlotMap: { [key: string]: TimeSlot[] } = {};

    for (let i = 0; i < timeSlots.length; i++) {
      if (timeSlots[i].classId != null) {
        if (!timeSlotMap[timeSlots[i].classId]) {
          timeSlotMap[timeSlots[i].classId] = [];
        }

        timeSlotMap[timeSlots[i].classId].push(timeSlots[i]);
      }
    }

    for (let i = 0; i < classData.length; i++) {
      const timeSlotsForClass = timeSlotMap[classData[i].classId];
      if (timeSlotsForClass) {
        for (let j = 0; j < timeSlotsForClass.length; j++) {
          const timeSlot = timeSlotsForClass[j];
          newCards.push({
            level: classData[i].level,
            className: classData[i].className,
            time: timeSlot.time ?? null,
            date: timeSlot.date ?? null,
            description: classData[i].description,
            instructor: classData[i].instructor,
            slotsAvailable: timeSlot.slotsAvailable ?? null,
            timeSlotId: timeSlot.id,
            classId: timeSlot.classId,
          });
        }
      }
    }

    setCard(newCards);
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
  };

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
  };

  if (route !== "authenticated") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <div className="w-4/5 mx-auto">
        <h2 className="text-3xl text-black font-bold text-center mb-6">
          Clases disponibles
        </h2>
        <Stack
          gap="4"
          direction="row"
          wrap="wrap"
          className="p-5 justify-center"
        >
          {showCards ? (
            card.map(
              ({
                className,
                level,
                description,
                instructor,
                time,
                date,
                slotsAvailable,
                timeSlotId,
                classId,
              }) => (
                <NewCard
                  className={className}
                  level={level}
                  description={description}
                  instructor={instructor}
                  time={time}
                  date={date}
                  slotsAvailable={slotsAvailable}
                  userName={user.signInDetails?.loginId}
                  timeSlotId={timeSlotId}
                  classId={classId}
                  tipo="1"
                />
              )
            )
          ) : (
            <p>Cargando...</p>
          )}
          {card.length === 0 && (
            <Alert
              variation="info"
              isDismissible={false}
              hasIcon={true}
              heading="No hay clases disponibles"
            >
              Actualmete no hay clases disponibles, pronto agregaremos más
            </Alert>
          )}
        </Stack>
      </div>
    </div>
  );
}

export default page;
