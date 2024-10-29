import os

from flask import Flask, jsonify, request
from langchain import hub
from langchain.agents import AgentExecutor, Tool, create_react_agent
from langchain.chains import RetrievalQA
from langchain.chains.conversation.memory import ConversationBufferWindowMemory
from langchain_community.document_loaders import JSONLoader
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_groq import ChatGroq
from langchain_text_splitters import CharacterTextSplitter

embeddings = HuggingFaceEmbeddings()
if "GROQ_API_KEY" not in os.environ:
    os.environ["GROQ_API_KEY"] = "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"


loader = JSONLoader('./db/all_data.json', jq_schema='.sales[]', text_content=False)
documents = loader.lazy_load()

text_splitter = CharacterTextSplitter(
    chunk_size=1450,
    chunk_overlap=400
)
texts = text_splitter.split_documents(documents)
print(len(texts))
vectordb = Chroma.from_documents(
    documents=texts,
    embedding=embeddings,
    persist_directory='./bot-api/db'
)
retriever = vectordb.as_retriever()

llm = ChatGroq(
    model="llama-3.1-70b-versatile",
    temperature=0.8
)

conversational_memory = ConversationBufferWindowMemory(
    memory_key='chat_history',
    k=4, 
    return_messages=True  
)

qa = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    return_source_documents=False
)


tools = [
    Tool(
        name='Salesman',
        func=qa.invoke,
        description=(
            """use this tool when answering sales knowledge queries to get
            more information about the topic."""
        )
    )
]

prompt = hub.pull("hwchase17/react-chat")

agent = create_react_agent(
    tools=tools,
    llm=llm,
    prompt=prompt,
)


agent_executor = AgentExecutor(agent=agent,
                               tools=tools,
                               verbose=True,
                               memory=conversational_memory,
                               max_iterations=30,
                               max_execution_time=600,
                               handle_parsing_errors=True
                               )



app = Flask(__name__)

@app.route('/generate', methods=['POST'])
def generate_report():
    data = request.get_json()
    query = data['query']
    response = agent_executor.invoke({"input": query})
    return jsonify({'response': response['output']})

@app.route('/report', methods=['POST'])
def generate_response():
    data = request.get_json()
    query = data['query']
    if not query:
        return jsonify({'error': 'Prompt não fornecido'}), 400

    response = agent_executor.invoke({"input": query})
    return response['output']
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
