from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from chatbot import build_graph, HumanMessage, AIMessage
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()

# Enable CORS for Vite's default port
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    # Initialize chatbot once when server starts
    logger.debug("Initializing chatbot...")
    chat_app = build_graph()
    chat_state = {
        "messages": [],
        "agent_outcome": None
    }
    logger.info("Chatbot initialized successfully!")
except Exception as e:
    logger.error(f"Failed to initialize chatbot: {str(e)}")
    raise

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(request: ChatRequest):
    global chat_state
    
    try:
        logger.debug(f"Received message: {request.message}")
        
        # Add user message to state
        chat_state["messages"].append(HumanMessage(content=request.message))
        logger.debug(f"Current message history: {len(chat_state['messages'])} messages")
        
        # Process through chat graph
        logger.debug("Processing message through chat graph...")
        chat_state = chat_app.invoke(chat_state)
        
        # Get last AI message
        last_msg = chat_state["messages"][-1]
        if isinstance(last_msg, AIMessage):
            response = last_msg.content
            logger.info(f"Generated response: {response[:100]}...")  # Log first 100 chars
            return {"response": response}
        
        logger.warning("No AI message generated in response")
        return {"response": "I apologize, I couldn't process that request."}
        
    except Exception as e:
        logger.error(f"Error processing message: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Endpoint to verify server is running"""
    return {"status": "healthy", "message_count": len(chat_state["messages"])}

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting FastAPI server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)

    #to run: uvicorn main:app --reload
