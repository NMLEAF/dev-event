import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database";
import { Suspense } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Page = async () => {
  // Api Fetch
  const response = await fetch(`${BASE_URL}/api/events`);
  const { events } = await response.json();

  return (
    <section>
      <h1 className="text-center">
        The Hub for Every <br />
        Dev Event You Can't Miss
      </h1>
      <p className="text-center mt-5">
        Hackatons, Meetups, Conferences, all in One Place
      </p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <Suspense fallback={<div>Loading...</div>}>
          {events.length > 0 ? (
            <ul className="events">
              {events.map((event: IEvent) => (
                <li key={event._id?.toString()} className="list-none">
                  <EventCard {...event} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">
              No events available at the moment.
            </p>
          )}
        </Suspense>
      </div>
    </section>
  );
};

export default Page;
