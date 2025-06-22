const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect("mongodb://127.0.0.1:27017/studentApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Mongoose schemas
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const ideaSchema = new mongoose.Schema({
  title: String,
  description: String,
  requirements: String,
  fileUrl: String,
  postedBy: String,
  applicants: [
    {
      name: String,
      email: String,
      github: String,
      resumeUrl: String,
    }
  ],
});

const User = mongoose.model("User", userSchema);
const Idea = mongoose.model("Idea", ideaSchema);

// File upload config for pitches
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// File upload config for applicants
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, "resume_" + Date.now() + path.extname(file.originalname)),
});
const uploadResume = multer({ storage: resumeStorage });

// Routes
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.json({ success: false, message: "Email already registered" });

    await new User({ name, email, password }).save();
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: "Something went wrong" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) res.json({ success: true, name: user.name });
  else res.json({ success: false });
});

app.post("/pitch", upload.single("file"), async (req, res) => {
  const { title, description, requirements, postedBy } = req.body;
  const newIdea = new Idea({
    title,
    description,
    requirements,
    fileUrl: req.file ? `/uploads/${req.file.filename}` : "",
    postedBy,
    applicants: [],
  });
  await newIdea.save();
  res.json({ success: true });
});

app.get("/pitches", async (req, res) => {
  const search = req.query.search || "";
  const filter = search ? { title: { $regex: search, $options: "i" } } : {};
  const ideas = await Idea.find(filter);
  res.json(ideas);
});

app.post("/apply/:ideaId", uploadResume.single("resume"), async (req, res) => {
  const { name, email, github } = req.body;
  const resumeUrl = req.file ? `/uploads/${req.file.filename}` : "";

  try {
    const idea = await Idea.findById(req.params.ideaId);
    if (!idea) return res.status(404).json({ success: false, message: "Idea not found" });

    idea.applicants.push({ name, email, github, resumeUrl });
    await idea.save();

    res.json({ success: true, message: "Applied successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
