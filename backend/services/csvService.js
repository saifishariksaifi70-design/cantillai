
import fs from "fs";
import csv from "csv-parser";

// 1. Read and parse CSV file
export function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv({
        headers: [
          "itemName",
          "quantity",
          "unitPrice",
          "category",
          "currency",
          "purpose"
        ],
        skipLines: 1
      }))
      .on("data", (row) => {
        results.push(row);
      })
      .on("end", () => {
        const filteredRows = results.filter(
          (row) => row.itemName?.trim().toLowerCase() !== "itemname"
        );

        resolve(filteredRows);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

// 2. Validate CSV data
export function validateCSV(rows) {
  const requiredFields = [
    "itemName",
    "quantity",
    "unitPrice",
    "category"
  ];

  const errors = [];

  // Check empty CSV
  if (!rows || rows.length === 0) {
    return {
      isValid: false,
      errors: ["CSV file is empty"]
    };
  }

  // Check required columns
  const headers = Object.keys(rows[0]);

  const missingHeaders = requiredFields.filter(
    (field) => !headers.includes(field)
  );

  if (missingHeaders.length > 0) {
    return {
      isValid: false,
      errors: [
        `Missing columns: ${missingHeaders.join(", ")}`
      ]
    };
  }

  // Validate every row
  rows.forEach((row, index) => {
    const rowNumber = index + 2;

    requiredFields.forEach((field) => {
      if (!row[field]?.trim()) {
        errors.push(
          `Row ${rowNumber}: ${field} is required`
        );
      }
    });

    const quantity = Number(row.quantity);
    const unitPrice = Number(row.unitPrice);

//     console.log("Validating Row:", JSON.stringify(row));
// console.log("Quantity:", row.quantity, "Converted:", quantity);
// console.log("Unit Price:", row.unitPrice, "Converted:", unitPrice);
// console.log("Quantity Valid:", Number.isInteger(quantity) && quantity >= 1);
// console.log("Price Valid:", Number.isFinite(unitPrice) && unitPrice >= 0);

    if (
      row.quantity?.trim() &&
      (!Number.isInteger(quantity) || quantity < 1)
    ) {
      errors.push(
        `Row ${rowNumber}: Quantity must be a positive integer`
      );
    }

    if (
      row.unitPrice?.trim() &&
      (!Number.isFinite(unitPrice) || unitPrice < 0)
    ) {
      errors.push(
        `Row ${rowNumber}: Unit price must be a valid non-negative number`
      );
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}
