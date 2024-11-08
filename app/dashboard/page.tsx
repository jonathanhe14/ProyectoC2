"use client";
import "@aws-amplify/ui-react/styles.css";
import { Placeholder, Loader, useTheme, Button } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormClass from "../components/FormClass";
import Header from "../components/Header";

Amplify.configure(outputs);
interface Class {
  id: string;
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
  const [isLoaded, setIsLoaded] = useState(true);
  const { tokens } = useTheme();

  const fetchClases = async () => {
    try {
      const { data: items, errors } = await client.models.Class.list();
      if (errors) {
        console.error(errors);
      } else {
        setClases(items);
      }
    } catch (error) {
      console.error("Error fetching clases:", error);
    } finally {
      setIsLoaded(false); // Detener el loader después de la carga
    }
  };

  useEffect(() => {
    fetchClases();
  }, []);

  const handleHorarios = (id: string | null) => {
    return (event: React.MouseEvent<HTMLButtonElement>): void => {
      event.preventDefault();
      console.log('Hola');
      route.push(`/horarios/${id}`);
    };
  };

  const handleDeleteClass = (classId: string | null) => {
    return async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
      event.preventDefault();
      if (!classId) return;

      try {
        console.log(classId);
        const toBeDeletedClass = { id: classId };
        const { data: deleteClass, errors } = await client.models.Class.delete(
          toBeDeletedClass
        );
        if (errors) {
          console.error('Error deleting class:', errors);
        } else {
          console.log('Clase eliminada:', deleteClass);
          fetchClases(); // Volver a cargar las clases después de eliminar
        }
      } catch (error) {
        console.error('Error deleting class:', error);
      }
    };
  };

  return (
    <div>
      <Header />
      <div className="pt-20">
        <h1 className="text-3xl font-bold mb-2">Próximas Clases</h1>
        {isLoaded ? (
          <Loader
            variation="linear"
            emptyColor={tokens.colors.black}
            filledColor={tokens.colors.blue[40]}
          />
        ) : null}

        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            {!isLoaded ? (
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
                  <th scope="col" className="px-6 py-3">
                    Eliminar Clase
                  </th>
                </tr>
              </thead>
            ) : null}

            <tbody>
              {clases.map(({ id, classId, className, availableSlots }) => (
                <tr
                  key={classId}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 rounded-lg"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {className}
                  </td>
                  <td className="px-6 py-4">{availableSlots}</td>
                  <td className="px-6 py-4">
                  <Button onClick={handleHorarios(classId)} variation="link">
                        Horarios
                      </Button>
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        onClick={handleDeleteClass(id)}
                        variation="link"
                      >
                        Borrar
                      </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Button variation="primary" onClick={() => route.push("/newclass")}>
          Agregar Clase
        </Button>
        <Button variation="primary" onClick={() => route.push("/home")}>
          Home
        </Button>
      </div>
    </div>
  );
}
