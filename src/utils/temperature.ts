
/**
 * Generates a realistic temperature based on the current month and latitude
 * @param latitude Optional latitude value
 * @returns A string representation of temperature with degree symbol
 */
export const generateRealisticTemperature = (latitude?: number): string => {
  const month = new Date().getMonth();
  
  // Determine season in Northern Hemisphere
  // (inverted for Southern Hemisphere if latitude < 0)
  let isSummer: boolean;
  
  if (latitude !== undefined) {
    const isNorthernHemisphere = latitude >= 0;
    const isNorthernSummer = month >= 3 && month <= 8;
    isSummer = isNorthernHemisphere ? isNorthernSummer : !isNorthernSummer;
  } else {
    // Default to northern hemisphere when no latitude is provided
    isSummer = month >= 3 && month <= 8;
  }
  
  // Base temperature adjusted by season
  const baseTemp = isSummer ? 25 : 10;
  
  // Latitude adjustment (cooler toward poles, warmer toward equator)
  const latAdjustment = latitude 
    ? (Math.abs(latitude) > 45 ? -5 : Math.abs(latitude) < 23 ? 5 : 0)
    : 0;
  
  // Random variation (+/- 4°C)
  const randomVariation = Math.random() * 8 - 4;
  
  // Calculate final temperature
  const finalTemp = Math.round(baseTemp + latAdjustment + randomVariation);
  
  return `${finalTemp}°`;
};
