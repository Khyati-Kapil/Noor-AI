import cors from "cors";

const corsOptions = {
  origin: true,
    credentials: false 
};

export default cors(corsOptions);


