import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useState } from "react";
import { Card, For, Stack } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import { Box, Text } from "@chakra-ui/react";
import { Badge } from "@chakra-ui/react";
import { Button } from "@aws-amplify/ui-react";
import { Alert } from "@aws-amplify/ui-react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ClasscardProps {
  className: string | null;
  description: string | null;
  level: string | null;
  instructor: string | null;
  time: string | null;
  date: string | null;
  slotsAvailable?: number | null;
  userName: string | undefined;
  timeSlotId?: string;
  classId?: string | undefined;
  tipo: string | undefined;
  attendeeId?: string | undefined;
  id?: string | undefined;
}

interface MyClass {
  myClassId: string;
  userName: string;
  className: string;
  level: string;
  description: string;
  instructor: string;
  time: string;
  date: string;
  classId: string;
  attendeeId: string | undefined;
  id: string | undefined;
}

interface Attendee {
  readonly id?: string;
  attendeeId: string;
  userName: string;
  timeSlotId: string;
}

const client = generateClient<Schema>({
  authMode: "apiKey",
});

export const NewCard: React.FC<ClasscardProps> = ({
  className,
  description,
  level,
  instructor,
  time,
  date,
  slotsAvailable,
  userName,
  timeSlotId,
  classId,
  tipo,
  attendeeId,
  id,
}) => {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertHeading, setAlertHeading] = useState<string | null>(null);
  const [attendeeData, setAttendeeData] = useState<Attendee>({
    attendeeId: crypto.randomUUID(),
    userName: userName || "",
    timeSlotId: timeSlotId || "",
  });

  const [myclassData, setMyClassData] = useState<MyClass>({
    myClassId: crypto.randomUUID(),
    userName: userName || "",
    className: className || "",
    level: level || "",
    description: description || "",
    instructor: instructor || "",
    time: time || "",
    date: date || "",
    classId: classId || "",
    attendeeId: attendeeData.attendeeId,
    id: id,
  });
 
  const createMyClass = async () => {
    const timeSlot = {
      id: timeSlotId || "",
      timeSlotId: timeSlotId,
      time: time,
      date: date,
      slotsAvailable: (slotsAvailable ?? 0) - 1,
      classId: classId,
    };
    try {
      const { data: updateTimeSlot, errors } =
        await client.models.TimeSlot.update(timeSlot);

      const attendee = await client.models.Attendee.create({
        attendeeId: attendeeData.attendeeId,
        userName: attendeeData.userName,
        timeSlotId: attendeeData.timeSlotId,
      });
      const idAttendee = attendee.data?.id;

      const myClass = await client.models.MyClass.create({
        myClassId: myclassData.myClassId,
        userName: myclassData.userName,
        className: myclassData.className,
        level: myclassData.level,
        description: myclassData.description,
        instructor: myclassData.instructor,
        time: myclassData.time,
        date: myclassData.date,
        timeSlotId: timeSlotId,
        attendeeId: idAttendee,
      });
      setAlertMessage("Te has inscrito a la clase");
      setAlertHeading("Inscripción exitosa");
      
    } catch (error) {
      console.error("Error creando la clase:", error);
    }

    return "Clase creada";
  };
  const mostrarAlerta = (mensaje: string, heading: string) => {
    if (!alertMessage || !alertHeading) return null;

    return (
      <Alert
        variation="success"
        isDismissible={false}
        hasIcon={true}
        heading={heading}
      >
        {mensaje}
      </Alert>
    );
  };
  const limpiar = () => {
    setAlertMessage(null);
    setAlertHeading(null);
  };

  const handleDeleteAttendde = (
    attendeeId: string | null,
    myClassId: string | null
  ): ((event: React.MouseEvent<HTMLButtonElement>) => Promise<void>) => {
    return async (
      event: React.MouseEvent<HTMLButtonElement>
    ): Promise<void> => {
      event.preventDefault();
      if (!attendeeId) return;
      try {
        const toBeDeletedTime = { id: attendeeId };
        const { data: deleteTime, errors } =
          await client.models.Attendee.delete(toBeDeletedTime);
        handleDeleteClass(myClassId ?? null);
        if (errors) {
          console.error("Error deleting Time:", errors);
        } else {
          console.log("Asistencia eliminada:", deleteTime);
        }
      } catch (error) {
        console.error("Error deleting Time:", error);
      }
    };
  };
  const handleDeleteClass = (myClassId: string | null) => {
    return async (
      event: React.MouseEvent<HTMLButtonElement>
    ): Promise<void> => {
      event.preventDefault();
      console.log("myClassId", myClassId);
      if (!myClassId) return;

      try {
        const toBeDeletedClass = { id: myClassId };
        const { data: deleteTime, errors } = await client.models.MyClass.delete(
          toBeDeletedClass
        );
        console.log("Clase eliminada", deleteTime);
        if (errors) {
          console.error("Error deleting Time:", errors);
        } else {
          console.log("Asistencia eliminada:", deleteTime);
        }
      } catch (error) {
        console.error("Error deleting Time:", error);
      }
    };
  };

  return (
    <DialogRoot>
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow w-[600px] mb-5 hover:bg-gray-200 transition-colors duration-300 flex justify-between ">
        {/* Contenido en el lado izquierdo */}
        <div>
          <a href="#">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
              {className}
            </h5>
          </a>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {description}
          </p>
          <p className="text-gray-700 text-xs"> Fecha: {date}</p>
          <p className="text-gray-700 text-xs mb-5">Hora: {time}</p>
          <DialogTrigger asChild>
            <Button className="mt-10" colorTheme="info">
              Detalles
            </Button>
          </DialogTrigger>
        </div>


        <div className="flex-shrink-0 ml-4">
          <img
            src="https://picsum.photos/300/300"
            alt="Clase imagen"
            className="rounded-lg object-cover w-[150px] h-[150px]"
          />
        </div>
      </div>

      {/* Dialog Content: lo que aparece dentro del modal */}
      <DialogContent>
        <DialogHeader className="border-b border-gray-200 rounded-b">
          <DialogTitle className="text-2xl text-gray-700 font-bold">
            {className}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="grid grid-cols-2 gap-4">
            <h3 className="text-xl text-gray-700 font-semibold">
              Descripción:
            </h3>
            <p className="text-lg text-gray-700 mb-3 ml-1">{description}</p>

            <h3 className="text-xl text-gray-700 font-semibold">Instructor:</h3>
            <p className="text-lg text-gray-700 mb-3 ml-1">{instructor}</p>

            <h3 className="text-xl text-gray-700 font-semibold">
              Fecha y Hora:
            </h3>
            <p className="text-lg text-gray-700 mb-3 ml-1">
              {date} - {time}
            </p>

            <h3 className="text-xl text-gray-700 font-semibold">Nivel:</h3>
            <p className="text-lg text-gray-700 mb-3 ml-1">{level}</p>


          {tipo === "1" ? (
            <>
              <h3 className="text-xl text-gray-700 font-semibold">
                Cupos aun disponibles:
              </h3>
              <p className="text-lg text-gray-700  mb-3 ml-1">
                {slotsAvailable}
              </p>
            </>
          ) : null}
                    </div>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button onClick={limpiar} colorTheme="error">
              Salir
            </Button>
          </DialogActionTrigger>
          {tipo === "1" ? (
            <Button onClick={createMyClass} colorTheme="success">
              Incribirse
            </Button>
          ) : null}
        </DialogFooter>
        <DialogCloseTrigger />
        {alertMessage &&
          alertHeading &&
          mostrarAlerta(alertMessage, alertHeading)}
      </DialogContent>
    </DialogRoot>
  );
};
