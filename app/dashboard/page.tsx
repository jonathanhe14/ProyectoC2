"use client";
import "@aws-amplify/ui-react/styles.css";
import { TextField } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormClass from "../components/FormClass";

Amplify.configure(outputs);
interface Class {
  classId: string | null; // Permitir null
  className: string | null; // Permitir null
  availableSlots: number | null; // Permitir null
}

const client = generateClient<Schema>({
  authMode: "apiKey",
});

export default function Dashboard() {
  const route = useRouter();
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

  const handleHorarios = (id: string | null) => (event: React.MouseEvent<HTMLButtonElement>): void => {
    route.push(`/horarios/${id}`);
  };
  

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Proximas Clases</h1>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nombre de la Clase
              </th>
              <th scope="col" className="px-6 py-3">
                Cupos Disponibles
              </th>
              <th scope="col" className="px-6 py-3">
                Horarios Disponibles
              </th>
            </tr>
          </thead>
          <tbody>
            {clases.map(({ classId, className, availableSlots }) => (
              <tr
                key={classId}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 rounded-lg"
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {className}
                </td>
                <td className="px-6 py-4">{availableSlots}</td>
                <td className="px-6 py-4"><button onClick={handleHorarios(classId)} className="button">Horarios</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="button" onClick={() => route.push("/newclass")}>
        Agregar Clase
      </button>
      <button className="button" onClick={() => route.push("/home")}>
       Home
      </button>
    </div>
  );
}
