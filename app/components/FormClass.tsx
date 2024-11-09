"use client";
import { time } from "console";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { UUID } from "crypto";
import { useRouter } from "next/navigation";
import {
  Input,
  Label,
  Flex,
  useTheme,
  Theme,
  Button,
  TextAreaField,
  Radio,
  RadioGroupField,
  ThemeProvider,defaultDarkModeOverride
} from "@aws-amplify/ui-react";

interface ClassData {
  classId: string | null;
  className: string;
  instructor: string;
  level: string;
  description: string;
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
    level: "",
    description: "",
    instructor: "",
  });

  const handleClassChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
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
        level: classData.level,
        description: classData.description,
        instructor: classData.instructor,
      });
      console.log("Clase creada:", newClass);
    } catch (error) {
      console.error("Error al crear la clase", error);
    } finally {
      setisLoading(true);
    }
  };
  const theme: Theme = {
    name: 'Auth Example Theme',
    overrides: [defaultDarkModeOverride],
  };

  return (
    <ThemeProvider theme={theme} colorMode="dark">
    <div>
      <h2 className="text-3xl font-bold mb-5">Ingresar Clase y Horarios</h2>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
        {/* Información de la Clase */}
        <Flex direction="column" gap='2rem'>
        <Flex direction="column">
          <Label htmlFor="className" color={tokens.colors.white}>
            Nombre de la Clase:
          </Label>
          <Input
            type="text"
            id="className"
            name="className"
            value={classData.className}
            onChange={handleClassChange}
            required
          />
        </Flex>

        <Flex direction="column">
          <Label htmlFor="instructor" color={tokens.colors.white}>
            Instructor
          </Label>

          <Input
            type="text"
            id="instructor"
            name="instructor"
            value={classData.instructor}
            onChange={handleClassChange}
            required
            color={tokens.colors.white}
          />
        </Flex>

          <TextAreaField
            label="Descripcion"
            value={classData.description} // Controlando el valor
            onChange={handleClassChange} // Manejando el cambio
            name="description"
            
          />
        <Flex>
          <RadioGroupField
            legend=""
            name="level"
            id="level"
            value={classData.level}
            onChange={handleClassChange}
            direction='row'
          >
            <Radio value="Facil" name="level">
              Facil
            </Radio>
            <Radio value="Intermedio" name="level">
              Intermedio
            </Radio>
            <Radio value="Dificil" name="level">
              Dificil
            </Radio>{" "}
            {/* Corregido "level" */}
          </RadioGroupField>
        </Flex>
        {isLoading ? (
          <Button
            type="submit"
            value="Agregar Clase"
            isLoading={true}
            loadingText="Creando"
            variation="primary"
          ></Button>
        ) : (
          <Button type="submit" value="Agregar Clase" variation="primary">
            Agregar Clase
          </Button>
        )}
        </Flex>
      </form>
    </div>
    </ThemeProvider>
  );
};

export default FormClass;
