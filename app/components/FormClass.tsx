import { time } from "console";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

interface ClassData {
  className: string;
  availableSlots: number;
}

interface TimeSlot {
  time: string;
  date: string;
  slotsAvailable: number;
}

const client = generateClient<Schema>({
  authMode: "apiKey",
});

const FormClass: React.FC = () => {
  const [classData, setClassData] = useState<ClassData>({
    className: "",
    availableSlots: 0,
  });

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { time: "", date: "", slotsAvailable: 0 },
  ]);

  const handleClassChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClassData({
      ...classData,
      [name]: name == "availableSlots" ? parseInt(value) : value,
    });
  };

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

  // Agregar un nuevo horario
  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { time: "", date: "", slotsAvailable: 1 }]);
  };

  // Enviar los datos del formulario
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Aquí manejarías el envío de datos al backend (API)
    console.log("Datos de la clase:", classData);
    console.log("Horarios:", timeSlots);
    createClass();
  };

  const createClass = async () => {
    try {
      const newClass = await client.models.Class.create({
        classId: crypto.randomUUID(),
        className: classData.className,
        availableSlots: classData.availableSlots,
      });
    } catch (error) {
      console.error("Error al crear la clase", error);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-5">Ingresar Clase y Horarios</h2>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
        {/* Información de la Clase */}
        <div>
          <label
            htmlFor="className"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Nombre de la Clase:
          </label>
          <input
            type="text"
            id="className"
            name="className"
            value={classData.className}
            onChange={handleClassChange}
            required
            className="input-field"
          />
        </div>
  
        <br />
        <br />
        <div>
          <label
            htmlFor="availableSlots"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Cupos Disponibles:
          </label>
  
          <input
            type="number"
            id="availableSlots"
            name="availableSlots"
            value={classData.availableSlots}
            onChange={handleClassChange}
            min="1"
            className="input-field"
            required
          />
        </div>
  
        <br />
        <br />
  
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
        <button type="button" onClick={addTimeSlot} className="button">
          Agregar otro Horario
        </button>
        <br />
        <br />
  
        <input type="submit" value="Agregar Clase y Horarios" className="button"/>
      </form>
    </div>
  );
}

export default FormClass;
