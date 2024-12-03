'use client';
import React, { useEffect } from 'react'
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";
import { useState } from 'react';
import { Amplify } from "aws-amplify";
import outputs from "../../../amplify_outputs.json";
import Router, { useRouter } from 'next/navigation';
import FormTime from '../../components/FormTime';
import { Button,Flex,Table,TableBody,TableCell,TableHead,TableRow } from '@aws-amplify/ui-react';
import Header from '@/app/components/Header';


Amplify.configure(outputs);
interface timeSlot {
  timeSlotId: string | null;
  classId: string | null;
  time: string | null;
  date: string | null;
  slotsAvailable: number | null;
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

interface PageProps {
  classId: string;
}
const client = generateClient<Schema>({
  authMode: "apiKey",
});

export default function Horarios({params}:{params: {classid: string}}) {
  const classId = params.classid;
  const [timeSlots, setTimeSlots] = useState<timeSlot[]>([]);
  const [showForm, setShowForm] = useState(false);
  const route = useRouter();


 const toogleForm = () => {
  setShowForm(!showForm);
 };

  const fetchTimeSlots = async () => {
    try{
      const { data: items, errors } = await client.models.TimeSlot.list({
        filter: {
          classId: {
            eq: classId
          }
      }});
      console.log(items);
      if(errors){
        console.error(errors);
      } else {

        setTimeSlots(items);
      }
    }catch(error){
      console.error("Error fetching clases:", error);
    }
  }

  useEffect(() => {
    if (classId) {
      fetchTimeSlots();
    }
  }, [classId]);

  if (!timeSlots) {
    return <p>Cargando horarios de la clase...</p>;
  }


  const handleDeleteTimeSolt = (timeId: string | null) => {
    return async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
      event.preventDefault();
      if (!timeId) return;

      try {
        const toBeDeletedTime = { id: timeId };
        const { data: deleteTime, errors } = await client.models.TimeSlot.delete(
          toBeDeletedTime
        );
        if (errors) {
          console.error('Error deleting Time:', errors);
        } else {
          console.log('Horario eliminado:', deleteTime);
          fetchTimeSlots();
        }
      } catch (error) {
        console.error('Error deleting Time:', error);
      }
    };
  };

  const handleAsistentes = (id: string | null) => {
    return (event: React.MouseEvent<HTMLButtonElement>): void => {
      event.preventDefault();
      route.push(`/asistentes/${id}`);
    };
  };

  return (
    <>
    <Header />
    <Flex direction="column">
    <h2 className="text-3xl text-black font-bold text-center ">
          Horarios
        </h2>
{!showForm ? (
  <div>
    <div className="relative overflow-x-auto">
      <Table
        highlightOnHover={true}
        variation="bordered"
      >
        <TableHead>
          <TableRow>
            <TableCell as="th">Hora</TableCell>
            <TableCell as="th">Fecha</TableCell>
            <TableCell as="th">Campos</TableCell>
            <TableCell as="th">Eliminar</TableCell>
            <TableCell as="th">Asistentes</TableCell>
          </TableRow>
      </TableHead>
      <TableBody>
        {timeSlots.map(({ id,timeSlotId, time, date, slotsAvailable }) => (
          <TableRow key={timeSlotId}>
            <TableCell>{time}</TableCell>
            <TableCell>{date}</TableCell>
            <TableCell>{slotsAvailable}</TableCell>
            <TableCell>
              <Button
                onClick={handleDeleteTimeSolt(id)}
                variation="link"
              >
                Borrar
              </Button>

            </TableCell>
            <TableCell>
              <Button
                onClick={handleAsistentes(id)}
                variation="link"
              >
                Asistentes
              </Button>
              </TableCell>
          </TableRow>

        ))}
        </TableBody>
      </Table>
    </div>
  </div>
) : null}
        
        {showForm && <FormTime id={classId} />}
    <Button onClick={toogleForm} variation='primary'>
      {showForm ? "Volver" : "Agregar Horario"}
      
    </Button>
         
    {/* <button className="button" onClick={() => route.push("/dashboard")}>
     Clases
    </button> */}
    </Flex>
    </>

  )
}


