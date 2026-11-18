
export function evaluateRequest(request, policy) {
  const missing = [];

  // Check required purchase details
  if (!request.itemName) missing.push("itemName");

  if (!request.quantity || request.quantity < 1) {
    missing.push("quantity");
  }

  if (
    request.unitPrice === null ||
    request.unitPrice === undefined
  ) {
    missing.push("unitPrice");
  }

  // If required details are missing
  if (missing.length) {
    return {
      outcome: "needs_info",
      reasons: [`Missing: ${missing.join(", ")}`]
    };
  }

  // Calculate total purchase amount
  const total = request.quantity * request.unitPrice;

  const rules = policy.rules;
  const category = (request.category || "").toLowerCase();

  // Check restricted categories
  if (
    (rules.restrictedCategories || [])
      .map(x => x.toLowerCase())
      .includes(category)
  ) {
    return {
      outcome: "rejected",
      reasons: ["Category is restricted by active policy."]
    };
  }

  // Check sourcing threshold
  if (total >= rules.sourcingAtOrAbove) {
    return {
      outcome: "sourcing_request",
      reasons: [`Total ${total} meets sourcing threshold.`]
    };
  }

  // Check approval requirement
  if (total > rules.approvalRequiredAbove) {
    return {
      outcome: "needs_approval",
      reasons: [`Total ${total} requires approval.`]
    };
  }

  // Check automatic purchase order eligibility
  if (total <= rules.autoPOUnder) {
    return {
      outcome: "purchase_order",
      reasons: [`Total ${total} is within auto-PO threshold.`]
    };
  }

  return {
    outcome: "sourcing_request",
    reasons: ["Policy default: sourcing required."]
  };
}
