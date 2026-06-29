import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

// 1. GET '/'        -> READ all tags for the user.
router.get("/", async (req, res, next) => {
  try {
    const tags = await prisma.tag.findMany({
      where: { userId: req.user.id },
      orderBy: { name: "asc" },
    });
    res.json(tags);
  } catch (err) {
    next(err);
  }
});

// 2. POST '/'       -> CREATE a tag from req.body.name. Respond 201 with the new tag.
router.post("/", async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ message: "Name is required and must be a non-empty string" });
    }
    const tag = await prisma.tag.create({
      data: { name: name.trim(), userId: req.user.id },
    });
    res.status(201).json(tag);
  } catch (err) {
    next(err);
  }
});

// 3. PUT '/:id'     -> UPDATE (rename) a tag. Read the id from req.params.
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ message: "Name is required and must be a non-empty string" });
    }

    const existing = await prisma.tag.findFirst({
      where: { id, userId: req.user.id },
    });
    if (!existing) {
      return res.status(404).json({ message: "Tag not found" });
    }

    const tag = await prisma.tag.update({
      where: { id },
      data: { name: name.trim() },
    });
    res.json(tag);
  } catch (err) {
    next(err);
  }
});

// 4. DELETE '/:id'  -> DELETE a tag.
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.tag.findFirst({
      where: { id, userId: req.user.id },
    });
    if (!existing) {
      return res.status(404).json({ message: "Tag not found" });
    }

    await prisma.tag.delete({ where: { id } });
    res.json({ id });
  } catch (err) {
    next(err);
  }
});

export default router;
