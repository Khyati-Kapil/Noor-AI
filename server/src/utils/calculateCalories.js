export const calculateCalories = ({
    weight,
    height,
    age,
    gender,
    activityLevel,
    goal,
  }) => {
    let bmr =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;
  
    const activityMultiplier = {
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
    };
  
    const maintenance = bmr * activityMultiplier[activityLevel];
  
    if (goal === "loss") return Math.max(maintenance - 400, 1200);
    if (goal === "gain") return maintenance + 300;
  
    return Math.round(maintenance);
  };
  

  