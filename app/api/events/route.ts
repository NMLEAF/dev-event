import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    let event;

    try {
      event = Object.fromEntries(formData.entries()) as Record<
        string,
        FormDataEntryValue
      >;
      // Arrays need JSON.parse; ensure values are strings before parsing
      if (typeof event.agenda === "string") {
        event.agenda = JSON.parse(event.agenda);
      } else {
        return NextResponse.json(
          {
            message: "Invalid form data",
            error: "agenda must be a string",
          },
          { status: 400 },
        );
      }
      if (typeof event.tags === "string") {
        event.tags = JSON.parse(event.tags);
      } else {
        return NextResponse.json(
          {
            message: "Invalid form data",
            error: "tags must be a string",
          },
          { status: 400 },
        );
      }
    } catch (e) {
      return NextResponse.json(
        {
          message: "Invalid form data",
          error: e instanceof Error ? e.message : "Unknown error",
        },
        { status: 400 },
      );
    }
    const createdEvent = await Event.create(event);
    return NextResponse.json(
      {
        message: "Event created successfully",
        event: createdEvent,
      },
      { status: 201 },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: "Event creation failed",
        error: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
