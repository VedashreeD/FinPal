#!/usr/bin/env python3
from typing import List, TypedDict, Union, Dict, Any
from datetime import datetime
from langchain_ollama import ChatOllama
from langchain.schema import SystemMessage, HumanMessage, AIMessage, BaseMessage
from langchain_core.agents import AgentAction, AgentFinish
from langgraph.graph import StateGraph, START, END

# Define State Schema 
class AgentState(TypedDict):
    messages: List[BaseMessage]
    agent_outcome: Union[AgentAction, AgentFinish, None]

# Initialize Tools & LLM 
def get_time() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

llm = ChatOllama(model="0xroyce/plutus:latest")
SYSTEM_PROMPT = """You are a helpful assistant who can:
1. Answer questions related to finance and investments.
2. Keep the conversation delightful and engaging.

OUTPUT FORMATTING:
- Use spaces for indentation.
- Use bullet points for lists.
- Use markdown for tables.
"""

# Define Node Functions
def agent_node(state: AgentState) -> AgentState:
    """Process messages and decide next action."""
    # Initialize system message if needed
    if not state["messages"]:
        state["messages"] = [SystemMessage(content=SYSTEM_PROMPT)]

    # Get last message
    last_msg = state["messages"][-1]
    if not isinstance(last_msg, HumanMessage):
        return state

    # Check for time request
    if "what is the time" in last_msg.content.lower():
        state["agent_outcome"] = AgentAction(
            tool="get_time",
            tool_input={},
            log="Getting current time"
        )
    else:
        # Normal conversation
        response = llm.invoke(state["messages"])
        state["agent_outcome"] = AgentFinish(
            return_values={"output": response.content},
            log="Direct response"
        )
    return state

def tool_node(state: AgentState) -> AgentState:
    """Execute tool actions."""
    outcome = state.get("agent_outcome")
    if isinstance(outcome, AgentAction) and outcome.tool == "get_time":
        result = get_time()
        state["messages"].append(AIMessage(content=result))
    return state

def output_node(state: AgentState) -> AgentState:
    """Handle final responses."""
    outcome = state.get("agent_outcome")
    if isinstance(outcome, AgentFinish):
        state["messages"].append(AIMessage(content=outcome.return_values["output"]))
    return state

# Build Graph
def build_graph():
    # Create graph with state schema
    workflow = StateGraph(AgentState)
    
    # Add nodes
    workflow.add_node("agent", agent_node)
    workflow.add_node("tool", tool_node)
    workflow.add_node("output", output_node)
    
    # Add edges in sequence
    workflow.add_edge(START, "agent")
    workflow.add_edge("agent", "tool")
    workflow.add_edge("tool", "output")
    workflow.add_edge("output", END)
    
    return workflow.compile()

if __name__ == "__main__":
    print("Chatbot ready! Type 'exit' to quit\n")
    
    app = build_graph()
    state = {
        "messages": [],
        "agent_outcome": None
    }
    
    while True:
        user_input = input("You: ").strip()
        if user_input.lower() in ("exit", "quit"):
            break
            
        state["messages"].append(HumanMessage(content=user_input))
        state = app.invoke(state)
        
        # Print last AI message
        last_msg = state["messages"][-1]
        if isinstance(last_msg, AIMessage):
            print(f"Bot: {last_msg.content}\n")
