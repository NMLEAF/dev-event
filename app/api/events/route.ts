import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { Event } from "@/database";

import connectDB from "@/lib/mongodb";
import { CloudinaryUploadResult } from "@/lib/constants";

export async function POST(req: NextRequest) {
  let uploadResult: CloudinaryUploadResult | null = null;

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

    const file = formData.get("image") as File;
    if (!file)
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 },
      );

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: "DevEvent",
          },
          (error, results) => {
            if (error) return reject(error);

            resolve(results);
          },
        )
        .end(buffer);
    });

    event.image = uploadResult.secure_url;

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

    // Delete the image to clean up if an upload happened
    if (uploadResult && uploadResult.public_id) {
      try {
        await cloudinary.uploader.destroy(uploadResult.public_id, {
          resource_type: "image",
        });
      } catch (destroyErr) {
        console.error("Failed to delete uploaded image:", destroyErr);
      }
    }

    return NextResponse.json(
      {
        message: "Event creation failed",
        error: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
