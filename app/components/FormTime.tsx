'use client';
import { time } from "console";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { UUID } from "crypto";
import { useRouter } from "next/navigation";



interface TimeSlot {
  time: string;
  date: string;
  slotsAvailable: number;
}

interface ClassData {
    classId: string | null;
}

const client = generateClient<Schema>({
  authMode: "apiKey",
});

const FormTime: React.FC<ClassData> = ({classId}) => {

  const router = useRouter();


  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { time: "", date: "", slotsAvailable: 0 },
  ]);

 

  const handleTimeSlotChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    // Verificamos que el "name" es una clave válida en TimeSlot
    if (name === "time" || name === "date" || name === "slotsAvailable") {
      const newTimeSlots = [...timeSlots];

      newTimeSlots[index] = {
        ...newTimeSlots[index],
        [name]: name === "slotsAvailable" ? parseInt(value) : value,
      };

      setTimeSlots(newTimeSlots);
    }
  };


  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { time: "", date: "", slotsAvailable: 1 }]);
  };


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    console.log("Horarios:", timeSlots);
    createTimeSlot();
    router.push("/dashboard");
  };


  const createTimeSlot = async () => {
    try {
      const newTimeSlots = await client.models.TimeSlot.create({
        timeSlotId: crypto.randomUUID(),
        classId: classId,
        time: timeSlots[0].time,
        date: timeSlots[0].date,
        slotsAvailable: timeSlots[0].slotsAvailable,  
      });
      console.log("Horario creado:", newTimeSlots);
    } catch (error) {
      console.error("Error al crear el horario", error);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-5">Ingresar Clase y Horarios</h2>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
        {/* Campos dinámicos para los horarios */}
        <div>
          <h3 className="text-xl font-bold mb-4">Horarios:</h3>
          {timeSlots.map((slot, index) => (
            <div key={index} className="timeSlot">
              <label htmlFor="time">Horario (ej: 10:00 AM):</label>
              <input
                type="text"
                name="time"
                value={slot.time}
                onChange={(e) => handleTimeSlotChange(index, e)}
                required
                className="input-field"
              />
  
              <div>
                <label htmlFor="date">Fecha (YYYY-MM-DD):</label>
                <div className="relative max-w-sm">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                    </svg>
                  </div>
                  <input
                    type="date"
                    name="date"
                    value={slot.date}
                    onChange={(e) => handleTimeSlotChange(index, e)}
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
              </div>
  
              <label htmlFor="slotsAvailable">Cupos Disponibles:</label>
              <input
                type="number"
                name="slotsAvailable"
                value={slot.slotsAvailable}
                onChange={(e) => handleTimeSlotChange(index, e)}
                min="1"
                className="input-field"
                required
              />
            </div>
          ))}
        </div>

        <br />
        <br />
  
        <input type="submit" value="Agregar Horario" className="button"/>
      </form>
    </div>
  );
}

export default FormTime;