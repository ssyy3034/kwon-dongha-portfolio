import { projectDetails } from "./src/data/project-details";

console.log("Checking project details...");

Object.entries(projectDetails).forEach(([id, detail]) => {
  console.log(`Checking ${id}...`);
  if (!detail) {
    console.error(`Detail for ${id} is undefined/null`);
    return;
  }

  try {
    JSON.stringify(detail);
  } catch (e) {
    console.error(`JSON stringify failed for ${id}:`, e);
  }

  if (typeof detail.overview !== "string")
    console.error(`${id}.overview is not string`);

  const allSections = [
    ...(detail.sections.backend ?? []),
    ...(detail.sections.frontend ?? []),
  ];

  allSections.forEach((s, i) => {
    if (typeof s.problem !== "string")
      console.error(`${id}.sections[${i}].problem is not string`);
    if (typeof s.approach !== "string")
      console.error(`${id}.sections[${i}].approach is not string`);
    if (typeof s.result !== "string")
      console.error(`${id}.sections[${i}].result is not string`);
    if (s.details) {
      s.details.forEach((d, j) => {
        if (typeof d !== "string")
          console.error(`${id}.sections[${i}].details[${j}] is not string`);
      });
    }
  });
});

console.log("Done.");
