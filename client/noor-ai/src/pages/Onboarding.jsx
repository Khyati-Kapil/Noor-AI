import "./onboarding.css";

const Onboarding = () => {
  return (
    <div className="onboard-page">
      <div className="onboard-container">
        <h1 className="title">Your journey starts here!</h1>

        <div className="grid">
          <div className="card peach">
            <h3>About You</h3>
            <div className="two">
              <input placeholder="Age" />
              <input placeholder="Height (cm)" />
            </div>
            <input placeholder="Weight (kg)" />
          </div>

          <div className="card mint">
            <h3>Skin & Tone</h3>
            <select>
              <option>Skin Type</option>
            </select>
            <select>
              <option>Activity Level</option>
            </select>
          </div>

          <div className="card cream full">
            <h3>Skin & Hair</h3>
            <div className="two">
              <select>
                <option>Hair Type</option>
              </select>
              <select>
                <option>Primary Goal</option>
              </select>
            </div>
          </div>

          <div className="card lavender full">
            <h3>Account</h3>
            <input placeholder="Email" />
            <input type="password" placeholder="Password" />
          </div>
        </div>

        <button className="cta">Next Step</button>
        <div className="steps">Step 1 of 3</div>
      </div>
    </div>
  );
};

export default Onboarding;
