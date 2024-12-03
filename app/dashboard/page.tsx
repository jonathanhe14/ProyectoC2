"use client";
import "@aws-amplify/ui-react/styles.css";
import {  Loader, useTheme, Button,Flex,Table,TableBody,TableCell,TableHead,TableRow, Badge } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import { MdDeleteForever } from "react-icons/md";

Amplify.configure(outputs);
interface Class {
  id: string;
  classId: string | null; // Permitir null
  className: string | null;
  level:string|null;
  description:string|null;
  instructor:string|null;
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
        console.log("Clases:", items);
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

      <Flex direction="column" >
      <h2 className="text-3xl text-black font-bold text-center ">
          Clases
        </h2>
      <div >
        {isLoaded ? (
          <Loader
            variation="linear"
            emptyColor={tokens.colors.black}
            filledColor={tokens.colors.blue[40]}
          />
        ) : null}

        <div className="relative overflow-x-auto">
          <Table
          highlightOnHover={true}
          variation="bordered"
          >
            {!isLoaded ? (
              <TableHead>
                <TableRow>
                  <TableCell as="th">Nombre de la Clase</TableCell>
                  <TableCell as="th">Dificultad</TableCell>
                  <TableCell as="th">Instructor</TableCell>
                  <TableCell as="th">Horarios Disponibles</TableCell>
                  <TableCell as="th">Eliminar </TableCell>
                </TableRow>
              </TableHead>
            ) : null}
            <TableBody>
              {clases.map(({ id, classId, className,level,instructor }) => (
                <TableRow key={classId}>
                  <TableCell>{className}</TableCell>
                  <TableCell>{level ==="Dificil" ? <Badge  variation="error">Dificil</Badge>: level==="Intermedio" ?<Badge variation="warning">Intermedio</Badge>: <Badge variation="success">Facil</Badge>}</TableCell>
                  <TableCell>{instructor}</TableCell>
                  <TableCell>
                    <Button onClick={handleHorarios(classId)} variation="link">
                      Horarios
                    </Button>
                  </TableCell>
                  <TableCell>

                    <Button
                      onClick={handleDeleteClass(id)}
                      colorTheme="error"
                      variation="link"
                    >
                      Borrar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        </div>
        <Button variation="primary" onClick={() => route.push("/newclass")}>
          Agregar Clase
        </Button>
        

      </Flex>
    </div>
  );
}
