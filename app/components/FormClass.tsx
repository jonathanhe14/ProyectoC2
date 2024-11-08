'use client';
import { time } from "console";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { UUID } from "crypto";
import { useRouter } from "next/navigation";
import {Input,Label,Flex,useTheme,Theme,Button} from '@aws-amplify/ui-react';

interface ClassData {
  classId: string | null;
  className: string;
  availableSlots: number;
}


const client = generateClient<Schema>({
  authMode: "apiKey",
});

const FormClass: React.FC = () => {

  const [isLoading, setisLoading] = useState(false);

  const { tokens } = useTheme();
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
    }finally{
      setisLoading(true);
    }
  };


  return (
    <div>
      <h2 className="text-3xl font-bold mb-5">Ingresar Clase y Horarios</h2>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
        {/* Información de la Clase */}
        <div>
          <Label htmlFor="className" color={tokens.colors.white}>Nombre de la Clase:</Label>
          <Input
            type="text"
            id="className"
            name="className"
            value={classData.className}
            onChange={handleClassChange}
            required
          />
        </div>
  
        <br />
        <br />
        <div>
          <Label
            htmlFor="availableSlots"
            color={tokens.colors.white}
          >
            Cupos Disponibles:
          </Label>
  
          <Input
            type="number"
            id="availableSlots"
            name="availableSlots"
            value={classData.availableSlots}
            onChange={handleClassChange}
            required
            color={tokens.colors.white}
            
          />
        </div>
  
        <br />
        <br />
    {isLoading ? <Button type="submit" value="Agregar Clase"isLoading={true} loadingText="Creando" variation="primary" ></Button>:<Button type="submit" value="Agregar Clase" variation="primary" >Agregar Clase</Button>}
      </form>
    </div>
  );
}

export default FormClass;
