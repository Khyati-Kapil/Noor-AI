import { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    age: "",
    height: "",
    weight: "",
    gender: "",
    primaryGoal: "",
    activityLevel: "",
    skinType: "",
    skinConcerns: [],
    hairType: "",
    hairConcerns: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e, type) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [type]: checked ? [...prev[type], value]: prev[type].filter((v) => v !== value),
    }));
  };

  const handleSubmit=(e)=>{
    e.preventDefault()
    console.log("Register:",formData)
    alert("Form submitted Successfully");
  }
  return (
    <>
    <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input name="email" value ={formData.email} onChange={handleChange} />
        <label>Password</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} />
        <label>Age</label>
        <input name="age" value={formData.age} onChange={handleChange} />
        <label>Height (cm)</label>
        <input name="height" value={formData.height} onChange={handleChange} />
        <label>Weight (kg)</label>
        <input name="weight" value={formData.weight} onChange={handleChange} />
        <label>Gender</label>
        <select name ="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
        </select>
        <label>Primary Goal</label>
        <select
          name="primaryGoal"
          value={formData.primaryGoal}
          onChange={handleChange}>
          <option value="">Select</option>
          <option value="gain">Weight Gain</option>
          <option value="loss">Weight Loss</option>
          <option value="maintain">Maintain</option>
          <option value="skin">Improve Skin</option>
          <option value="hair">Improve Hair</option>
          <option value="wellness">Overall Wellness</option>
        </select>

        <label>Activity Level</label>
        <select
          name="activityLevel"
          value={formData.activityLevel}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="light">Light</option>
          <option value="moderate">Moderate</option>
          <option value="active">Active</option>
        </select>

        <label>Skin Type</label>
        <select
          name="skinType"
          value={formData.skinType}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="dry">Dry</option>
          <option value="oily">Oily</option>
          <option value="combination">Combination</option>
          <option value="normal">Normal</option>
        </select>

        <label>Skin Concerns</label>
        {["acne", "pigmentation", "dullness", "wrinkles","redness","others"].map((c) => (
          <div key={c}>
            <input type="checkbox" value={c} onChange={(e) => handleCheckboxChange(e, "skinConcerns")}/>
            {c}
          </div>
        ))}

        <label>Hair Type</label>
        <select 
            name="hairType"
            value={formData.hairType}
            onChange={handleChange} >
         <option value="">Select</option>
          <option value="dry">Dry</option>
          <option value="oily">Oily</option>
          <option value="normal">Normal</option>
          <option value="combination">Combination</option>
        </select>
       
        <label>Hair Concerns</label>
        {["hair fall", "dandruff", "frizz", "slow growth"].map((c) => (
          <div key={c}>
            <input
              type="checkbox"
              value={c}
              onChange={(e) => handleCheckboxChange(e, "hairConcerns")}
            />
            {c}
          </div>
        ))}

    <button type="submit" style={{ marginTop: "1rem" }}>
          Register
        </button>
      </form>
      

    </>
  )

}

export default Register;
