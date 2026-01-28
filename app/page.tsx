import ExploreBtn from "@/components/ExploreBtn";

const Page = () => {
  return (
    <section>
      <h1 className="text-center">
        The Hub for Every Dev <br /> Event You Cant't Miss
      </h1>
      <p className="text-center mt-5">
        Hackatons, Meetups, Conferences, all in One Place
      </p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events">
          {[1, 2, 3].map((event) => (
            <li key={event}>Events {event}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Page;
