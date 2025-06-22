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
      resumeUrl: String,
      status: { type: String, default: "Pending" },
    },
  ],
});

const User = mongoose.model("User", userSchema);
const Idea = mongoose.model("Idea", ideaSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.json({ success: false, message: "Email already registered" });

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

app.post("/apply", upload.single("resume"), async (req, res) => {
  const { ideaId, name } = req.body;
  const idea = await Idea.findById(ideaId);

  const alreadyApplied = idea.applicants.find((a) => a.name === name);
  if (alreadyApplied) return res.json({ success: false, message: "Already applied" });

  idea.applicants.push({
    name,
    resumeUrl: req.file ? `/uploads/${req.file.filename}` : "",
  });
  await idea.save();
  res.json({ success: true });
});

app.get("/my-applications/:name", async (req, res) => {
  const name = req.params.name;
  const ideas = await Idea.find({ "applicants.name": name });
  const applications = ideas.map((idea) => {
    const applicant = idea.applicants.find((a) => a.name === name);
    return {
      title: idea.title,
      status: applicant.status,
    };
  });
  res.json(applications);
});

app.post("/update-status", async (req, res) => {
  const { ideaId, applicantName, status } = req.body;
  const idea = await Idea.findById(ideaId);
  const applicant = idea.applicants.find((a) => a.name === applicantName);
  if (applicant) {
    applicant.status = status;
    await idea.save();
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
