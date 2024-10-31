"use client";
import "@aws-amplify/ui-react/styles.css";
import { TextField } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useEffect, useState } from "react";

Amplify.configure(outputs);
interface Class {
    classId: string | null; // Permitir null
    className: string | null; // Permitir null
    availableSlots: number | null; // Permitir null
  }

const client = generateClient<Schema>({
  authMode: 'apiKey'
});

export default function Dashboard() {
    const [clases, setClases] = useState<Class[]>([]);

  const fetchClases = async () => {
    try {
      const { data: items, errors } = await client.models.Class.list();
      if (errors) {
        console.error(errors);
      } else {
        console.log(items);
        setClases(items);
      }
    } catch (error) {
      console.error("Error fetching clases:", error);
    }
  };

  useEffect(() => {
    fetchClases();
  }, []);

  const createClass = async () => {
    try {
      // Crear una nueva clase
      const newClass = await client.models.Class.create({
        classId: "1", // Considera usar un ID único o generarlo dinámicamente
        className: "Yoga",
        availableSlots: 10,
      });
      console.log("Class created");
      fetchClases(); // Volver a obtener las clases después de la creación
    } catch (error) {
      console.error("Error creating class:", error);
    }
  };

  return (
    <div>
      <button onClick={createClass}>Create Class</button>
      <ul>
        {clases.map(({ classId, className }) => (
          <li key={classId}>{className}</li>
        ))}
      </ul>
    </div>
  );
}

