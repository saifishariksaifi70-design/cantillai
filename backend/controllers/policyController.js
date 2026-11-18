
import Policy from "../models/Policy.js";

// Get all policies
export async function listPolicies(req, res) {
  try {
    const policies = await Policy.find()
      .sort({ version: -1 });

    return res.json({ policies });

  } catch (error) {
    console.error("List Policies Error:", error.message);

    return res.status(500).json({
      message: "Could not fetch policies."
    });
  }
}

// Create new policy
export async function createPolicy(req, res) {
  try {
    const { title, rules } = req.body;

    if (!title?.trim() || !rules) {
      return res.status(400).json({
        message: "Title and rules required."
      });
    }

    if (
      rules.autoPOUnder > rules.sourcingAtOrAbove
    ) {
      return res.status(400).json({
        message: "Auto-PO threshold cannot exceed sourcing threshold."
      });
    }

    const latest = await Policy.findOne()
      .sort({ version: -1 });

    const policy = await Policy.create({
      title: title.trim(),
      version: (latest?.version || 0) + 1,
      rules,
      status: "draft",
      uploadedBy: req.user.id
    });

    return res.status(201).json({ policy });

  } catch (error) {
    console.error("Create Policy Error:", error.message);

    return res.status(500).json({
      message: "Could not create policy."
    });
  }
}

// Publish policy
export async function publishPolicy(req, res) {
  try {
    const policy = await Policy.findById(req.params.id);

    if (!policy) {
      return res.status(404).json({
        message: "Policy not found."
      });
    }

    await Policy.updateMany(
      { status: "active" },
      { $set: { status: "archived" } }
    );

    policy.status = "active";
    await policy.save();

    return res.json({
      message: "Policy published.",
      policy
    });

  } catch (error) {
    console.error("Publish Policy Error:", error.message);

    return res.status(500).json({
      message: "Could not publish policy."
    });
  }
}
