import { type ClientSchema, a, defineData } from "@aws-amplify/backend";


const schema = a.schema({
  Class: a.model({
    classId: a.id(),                 // ID de Clase (PK)
    className: a.string(),
    availableSlots: a.integer(),
  }),
  TimeSlot: a.model({
    timeSlotId: a.id(),              // ID de Horario (PK)
    classId: a.id(),                 // ID de Clase (FK)
    time: a.string(),
    date: a.string(),                 // Fecha como string
    slotsAvailable: a.integer(),
  }),
  Attendee: a.model({
    attendeeId: a.id(),              // ID de Asistente (PK)
    classId: a.id(),                 // ID de Clase (FK)
    userId: a.id(),
    userName: a.string(),
  })
}).authorization((allow) => allow.publicApiKey());





export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});


