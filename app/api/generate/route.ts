import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// אתחול הקליינטים עם משתני הסביבה הסודיים מוורסל
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID!, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY! }
});

export async function POST(request: Request) {
  try {
    const { userId, vibeStyle, userMemory, variantId, shippingAddress } = await request.json();

    // שלב א': אימות משתמש ובדיקת קרדיטים בסופה-בייס
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits, email')
      .eq('id', userId)
      .single();

    if (profileError || !profile || profile.credits < 1) {
      return NextResponse.json({ error: 'Insufficient credits or user not found' }, { status: 403 });
    }

    // שלב ב': הנדסת פרומפט ופנייה ל-DALL-E 3 HD
    const dynamicPrompt = `Premium t-shirt graphic design, ${vibeStyle} style, featuring elements inspired by: "${userMemory}". Vibrant colors, hyper-detailed, isolated vector art style, flat background.`;
    
    const aiResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: dynamicPrompt,
      n: 1,
      quality: "hd",
      size: "1024x1024",
    });
    if (!aiResponse.data || !aiResponse.data[0]?.url) {
     throw new Error("No image returned from OpenAI");
   }
   const rawImageUrl = aiResponse.data[0].url;

    // שלב ג': שליחה ל-API להסרת רקע (למשל Photoroom)
    const bgResponse = await fetch('https://image-api.photoroom.com/v1/segment', {
      method: 'POST',
      headers: { 'x-api-key': process.env.PHOTOROOM_API_KEY!, 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: rawImageUrl, format: 'png' })
    });
    const imageBuffer = await bgResponse.arrayBuffer();

    // שלב ד': העלאת ה-PNG השקוף ל-AWS S3 לקבלת URL קבוע עבור פרינטפול
    const s3Filename = `designs/${userId}-${Date.now()}.png`;
    await s3.send(new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: s3Filename,
      Body: Buffer.from(imageBuffer),
      ContentType: 'image/png',
    }));
    const publicStorageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Filename}`;

    // שלב ה': הפחתת קרדיט אחד למשתמש בסופה-בייס
    await supabase
      .from('profiles')
      .update({ credits: profile.credits - 1 })
      .eq('id', userId);

    // שלב ו': הזרקת הזמנה ישירה (Draft Order) ל-Printful API
    const printfulResponse = await fetch('https://api.printful.com/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        recipient: shippingAddress, // אובייקט כתובת מלא שהתקבל מ-Stripe
        items: [{
          variant_id: variantId, // קוד המוצר המדויק (צבע/מידה/דגם)
          quantity: 1,
          files: [{ url: publicStorageUrl }] // פרינטפול תמשוך את הקובץ מ-S3 שלך
        }]
      })
    });
    const printfulOrder = await printfulResponse.json();

    // שלב ז': שמירת רשומת ההזמנה במסד הנתונים למעקב הלקוח
    await supabase.from('orders').insert({
      user_id: userId,
      printful_order_id: printfulOrder.result.id,
      status: printfulOrder.result.status,
      image_url: publicStorageUrl,
      shirt_details: { variantId, vibeStyle }
    });

    return NextResponse.json({ success: true, orderId: printfulOrder.result.id, finalImage: publicStorageUrl });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}