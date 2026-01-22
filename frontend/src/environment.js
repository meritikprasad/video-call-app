let IS_PROD = true;
 const server = IS_PROD ? 
            "https://video-call-app-backend-01ua.onrender.com" : 
            "http://localhost:8000";
    
export default server;