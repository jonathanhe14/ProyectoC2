import { type ClientSchema, a, defineData } from "@aws-amplify/backend";


const schema = a.schema({
  Class: a.model({
    classId: a.id().required(),                 
    className: a.string(),
    level: a.string(),
    description: a.string(),
    instructor: a.string(),
    timeSlots: a.hasMany('TimeSlot','classId'),
  }),
  TimeSlot: a.model({
    timeSlotId: a.id(),              
    time: a.string(),
    date: a.string(),                
    slotsAvailable: a.integer(),
    classId: a.id().required(),              
    class: a.belongsTo('Class','classId'),    
  }),
  Attendee: a.model({
    attendeeId: a.id().required(),             
    userName: a.string().required(),
    timeSlotId: a.string().required()    
  }),
  MyClass: a.model({
    myClassId: a.id(), 
    userName: a.string(),
    className: a.string(),
    level: a.string(),
    description: a.string(),
    instructor: a.string(),
    time: a.string(),
    date: a.string(),           
    timeSlotId: a.string(),
    attendeeId: a.string(),
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


