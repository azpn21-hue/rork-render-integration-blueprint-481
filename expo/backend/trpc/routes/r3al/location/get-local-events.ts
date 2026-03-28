import { protectedProcedure } from "../../../create-context";
import { z } from "zod";

export const getLocalEventsProcedure = protectedProcedure
  .input(
    z.object({
      lat: z.number().min(-90).max(90),
      lon: z.number().min(-180).max(180),
      radius: z.number().min(1).max(100).default(25),
      limit: z.number().min(1).max(50).default(10),
      category: z.enum(["all", "music", "sports", "community", "business", "entertainment"]).default("all"),
    })
  )
  .query(async ({ input }) => {
    console.log("[Location] Fetching local events near:", input.lat, input.lon);

    const mockEvents = [
      {
        id: "event_1",
        title: "Summer Music Festival",
        description: "Three-day outdoor music festival featuring local and national artists.",
        category: "music",
        location: "City Amphitheater",
        address: "123 Main St",
        distance: 3.2,
        startDate: new Date(Date.now() + 86400000 * 7).toISOString(),
        endDate: new Date(Date.now() + 86400000 * 9).toISOString(),
        ticketPrice: 75,
        attendees: 234,
        imageUrl: null,
      },
      {
        id: "event_2",
        title: "Tech Startup Networking Mixer",
        description: "Connect with local entrepreneurs and investors in the tech community.",
        category: "business",
        location: "Innovation Hub",
        address: "456 Tech Blvd",
        distance: 2.1,
        startDate: new Date(Date.now() + 86400000 * 3).toISOString(),
        endDate: new Date(Date.now() + 86400000 * 3).toISOString(),
        ticketPrice: 0,
        attendees: 87,
        imageUrl: null,
      },
      {
        id: "event_3",
        title: "Community Cleanup Day",
        description: "Join neighbors for a morning of community service and environmental care.",
        category: "community",
        location: "Various Parks",
        address: "Meet at City Hall",
        distance: 1.8,
        startDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        endDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        ticketPrice: 0,
        attendees: 156,
        imageUrl: null,
      },
      {
        id: "event_4",
        title: "Local Basketball Tournament",
        description: "Annual amateur basketball tournament with teams from across the region.",
        category: "sports",
        location: "Sports Complex",
        address: "789 Athletic Dr",
        distance: 6.5,
        startDate: new Date(Date.now() + 86400000 * 5).toISOString(),
        endDate: new Date(Date.now() + 86400000 * 6).toISOString(),
        ticketPrice: 15,
        attendees: 312,
        imageUrl: null,
      },
      {
        id: "event_5",
        title: "Comedy Night at The Laugh Factory",
        description: "Stand-up comedy showcase featuring regional comedians.",
        category: "entertainment",
        location: "The Laugh Factory",
        address: "321 Comedy Ln",
        distance: 4.3,
        startDate: new Date(Date.now() + 86400000 * 1).toISOString(),
        endDate: new Date(Date.now() + 86400000 * 1).toISOString(),
        ticketPrice: 25,
        attendees: 98,
        imageUrl: null,
      },
    ];

    const filteredEvents = input.category === "all"
      ? mockEvents
      : mockEvents.filter(e => e.category === input.category);

    const events = filteredEvents
      .filter(e => e.distance <= input.radius)
      .slice(0, input.limit);

    console.log("[Location] Returning", events.length, "local events");

    return {
      success: true,
      events,
      location: {
        lat: input.lat,
        lon: input.lon,
      },
      radius: input.radius,
    };
  });
