import { projectDetails } from "./src/data/project-details";

console.log("Checking project details...");

Object.entries(projectDetails).forEach(([id, detail]) => {
  console.log(`Checking ${id}...`);
  if (!detail) {
    console.error(`Detail for ${id} is undefined/null`);
    return;
  }

  // Check recursive structures or weird objects
  try {
    JSON.stringify(detail);
  } catch (e) {
    console.error(`JSON stringify failed for ${id}:`, e);
  }

  // Check FormattedText usage fields
  if (typeof detail.overview !== "string")
    console.error(`${id}.overview is not string`);

  if (detail.sections) {
    detail.sections.forEach((s, i) => {
      if (typeof s.challenge !== "string")
        console.error(`${id}.sections[${i}].challenge is not string`);
      if (typeof s.solution !== "string")
        console.error(`${id}.sections[${i}].solution is not string`);
      if (s.details) {
        s.details.forEach((d, j) => {
          if (typeof d !== "string")
            console.error(`${id}.sections[${i}].details[${j}] is not string`);
        });
      }
    });
  }
});

console.log("Done.");
