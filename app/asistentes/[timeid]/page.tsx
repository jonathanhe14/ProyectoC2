"use client";
import React, { useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";
import { useState } from "react";
import { Amplify } from "aws-amplify";
import outputs from "../../../amplify_outputs.json";
import Router from "next/router";
import FormTime from "../../components/FormTime";
import {
  Button,
  Flex,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert,
} from "@aws-amplify/ui-react";
import Header from "@/app/components/Header";

Amplify.configure(outputs);

interface attendeen {
  userName: string | null;
  timeSlotId: string | null;
  attendeeId: string | null;
}

interface PageProps {
  classId: string;
}
const client = generateClient<Schema>({
  authMode: "apiKey",
});

export default function Horarios({ params }: { params: { timeid: string } }) {
  const asistenteId = params.timeid;
  const [attendeeData, setAttendeeData] = useState<attendeen[]>([]);
  const [showForm, setShowForm] = useState(false);
  const route = Router;

  const fetchAttendeen = async () => {
    try {
      const { data: items, errors } = await client.models.Attendee.list({
        filter: {
          timeSlotId: {
            eq: asistenteId,
          },
        },
      });
      console.log(items);
      if (errors) {
        console.error(errors);
      } else {
        setAttendeeData(items);
        console.log(attendeeData);
      }
    } catch (error) {
      console.error("Error fetching clases:", error);
    }
  };

  useEffect(() => {
    if (asistenteId) {
      fetchAttendeen();
    }
  }, [asistenteId]);

  if (!attendeeData) {
    return <p>Cargando horarios de la clase...</p>;
  }

  const handleDeleteAttendee = (attendeeId: string | null) => {
    alert("borrar");
  };

  return (
    <>
      <Header />
      <Flex direction="column">
        <h2 className="text-3xl text-black font-bold text-center ">
          Asistentes
        </h2>
        {!showForm ? (
          <div>
            <div className="relative overflow-x-auto">
              <Table highlightOnHover={true} variation="bordered">
                {attendeeData.length !== 0 ? (
                  <TableHead>
                    <TableRow>
                      <TableCell as="th">Asistente</TableCell>
                    </TableRow>
                  </TableHead>
                ) : <Alert
                    variation="info"
                    isDismissible={false}
                    hasIcon={true}
                    heading="No hay asistentes"
                  >Actualmete nadie se encuentra registrado en esta clase
                    
                  </Alert>}

                <TableBody>
                  {attendeeData.map(({ attendeeId, userName }) => (
                    <TableRow key={attendeeId}>
                      <TableCell>{userName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : null}
      </Flex>
    </>
  );
}
