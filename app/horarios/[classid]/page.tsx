'use client';
import { UUID } from 'crypto';
import React, { useEffect } from 'react'
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";
import { useState } from 'react';
import { Amplify } from "aws-amplify";
import outputs from "../../../amplify_outputs.json";
import Router from 'next/router';
import FormTime from '../../components/FormTime';
import { Input,Label } from '@aws-amplify/ui-react';
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
 const route = Router;


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

  return (
    <>
    <Header />
{!showForm ? (
  <div>
    <h1 className="text-3xl font-bold mb-2">Horarios de la clase</h1>
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Hora</th>
            <th scope="col" className="px-6 py-3">Fecha</th>
            <th scope="col" className="px-6 py-3">Espacios Disponibles</th>
          </tr>
        </thead>
        <tbody>
          {timeSlots.map(({ timeSlotId, classId, time, date, slotsAvailable }) => (
            <tr
              key={timeSlotId}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 rounded-lg"
            >
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {time}
              </td>
              <td className="px-6 py-4">{date}</td>
              <td className="px-6 py-4">{slotsAvailable}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
) : null}
        

    <button className="button" onClick={toogleForm}>
      {showForm ? "Ocultar Formulario" : "Agregar Horario"}
      
    </button>
          {showForm && <FormTime classId={classId} />}
    {/* <button className="button" onClick={() => route.push("/dashboard")}>
     Clases
    </button> */}
    </>

  )
}

