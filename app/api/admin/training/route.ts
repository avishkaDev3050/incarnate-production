import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [explore]: any = await db.execute("SELECT * FROM training_explore WHERE id = 1");
    const [trainer]: any = await db.execute("SELECT * FROM become_trainer WHERE id = 1");
    const [included]: any = await db.execute("SELECT * FROM training_included WHERE id = 1");

    return NextResponse.json({
      success: true,
      data: {
        explore: explore[0] || {},
        trainer: trainer[0] || {},
        included: included[0] || {}
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Fetch failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { explore, trainer, included } = body;

    // 1. Update Training Explore
    await db.execute(
      `INSERT INTO training_explore (id, journey_text, title_main, title_highlight, image_url, quote, description, features) 
       VALUES (1, ?, ?, ?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE journey_text=?, title_main=?, title_highlight=?, image_url=?, quote=?, description=?, features=?`,
      [explore.journey_text, explore.title_main, explore.title_highlight, explore.image_url, explore.quote, explore.description, JSON.stringify(explore.features),
       explore.journey_text, explore.title_main, explore.title_highlight, explore.image_url, explore.quote, explore.description, JSON.stringify(explore.features)]
    );

    // 2. Update Become Trainer
    await db.execute(
      `INSERT INTO become_trainer (id, sub_title, main_title, description, image_url, features) 
       VALUES (1, ?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE sub_title=?, main_title=?, description=?, image_url=?, features=?`,
      [trainer.sub_title, trainer.main_title, trainer.description, trainer.image_url, JSON.stringify(trainer.features),
       trainer.sub_title, trainer.main_title, trainer.description, trainer.image_url, JSON.stringify(trainer.features)]
    );

    // 3. Update Training Included
    await db.execute(
      `INSERT INTO training_included (id, sub_title, main_title, features_json) 
       VALUES (1, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE sub_title=?, main_title=?, features_json=?`,
      [included.sub_title, included.main_title, JSON.stringify(included.features_json),
       included.sub_title, included.main_title, JSON.stringify(included.features_json)]
    );

    return NextResponse.json({ success: true, message: "All sections updated!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Update failed" }, { status: 500 });
  }
}