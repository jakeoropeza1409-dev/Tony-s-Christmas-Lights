import OpenAI from "openai";
import formidable from "formidable-serverless";

export const config = { api: { bodyParser: false } };

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).send("File upload error");

    try {
      const fileBuffer = files.file[0].buffer || files.file.buffer;

      const response = await openai.images.generate({
        model: "gpt-image-1",
        prompt: "Generate colorful Christmas lights on this house in a cozy festive style",
        size: "1024x1024",
        image: fileBuffer
      });

      res.status(200).json({ url: response.data[0].url });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "AI generation failed" });
    }
  });
}
