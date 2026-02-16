export const calculateCalories = ({
    weight,
    height,
    age,
    gender,
    activityLevel,
    goal,
  }) => {
    const safeWeight = Number(weight) || 60;
    const safeHeight = Number(height) || 165;
    const safeAge = Number(age) || 24;
    const safeGender = gender || "other";
    const safeActivity = activityLevel || "moderate";
    const safeGoal = goal || "maintain";

    let bmr =
      safeGender === "male"
        ? 10 * safeWeight + 6.25 * safeHeight - 5 * safeAge + 5
        : 10 * safeWeight + 6.25 * safeHeight - 5 * safeAge - 161;
  
    const activityMultiplier = {
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
    };
  
    const maintenance = bmr * (activityMultiplier[safeActivity] || activityMultiplier.moderate);

    if (safeGoal === "loss") return Math.max(maintenance - 400, 1200);
    if (safeGoal === "gain") return maintenance + 300;
  
    return Math.round(maintenance);
  };
  

  
