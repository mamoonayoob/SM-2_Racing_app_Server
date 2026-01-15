module.exports = function normalizeRunGroup(text) {
  const upper = text.toUpperCase();

  if (upper.includes("RED")) return "RED";
  if (upper.includes("BLUE")) return "BLUE";
  if (upper.includes("YELLOW"))return "YELLOW";
  if (upper.includes("GREEN")) return "GREEN";

  return null;
};