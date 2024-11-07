'use client';
import { time } from "console";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { UUID } from "crypto";
import { useRouter } from "next/navigation";

interface ClassData {
  classId: string | null;
  className: string;
  availableSlots: number;
}


const client = generateClient<Schema>({
  authMode: "apiKey",
});

const FormClass: React.FC = () => {

  const router = useRouter();
  const [classData, setClassData] = useState<ClassData>({
    classId: crypto.randomUUID(),
    className: "",
    availableSlots: 0,
  });


  const handleClassChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClassData({
      ...classData,
      [name]: name == "availableSlots" ? parseInt(value) : value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    console.log("Datos de la clase:", classData);
    createClass();
    router.push("/dashboard");
  };

  const createClass = async () => {
    try {
      const newClass = await client.models.Class.create({
        classId: classData.classId,
        className: classData.className,
        availableSlots: classData.availableSlots,
      });
      console.log("Clase creada:", newClass);
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
  
        <input type="submit" value="Agregar Clase" className="button"/>
      </form>
    </div>
  );
}

export default FormClass;
