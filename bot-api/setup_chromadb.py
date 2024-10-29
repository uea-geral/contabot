import datetime
import json
import random
import sqlite3

import chromadb
from langchain.chains import RetrievalQA
from langchain_community.document_loaders import JSONLoader
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_groq import ChatGroq
from langchain_text_splitters import CharacterTextSplitter

embeddings = HuggingFaceEmbeddings()
conn = sqlite3.connect(r'D:\Github\contabot\backend\prisma\contabot.db')
cursor = conn.cursor()

query = """
SELECT `Order`.id, `Order`.date, Product.name, Product.price, `Order`.quantity
FROM `Order`
JOIN Product ON `Order`.productId = Product.id;
"""
print("Gettings records from database with SQL query.")
cursor.execute(query)
records = cursor.fetchall()
records = records[0:1000]

chroma_client = chromadb.PersistentClient(path="./bot-api/db")

collection_name = 'sales'
try:
    collection = chroma_client.get_collection(name=collection_name)
except Exception as e:
    print(e)
    collection = chroma_client.create_collection(name=collection_name)

documents = []
ids = []

print('Converting records to string')
for record in records:
    order_date_ms = record[1] 
    order_date = datetime.datetime.fromtimestamp(order_date_ms / 1000).strftime('%Y-%m-%d %H:%M:%S')
    # data = f"Product name: {record[2]}; Price: {record[3]}; Sale_Quantity: {record[4]}; Sale_Date: {order_date}"
    data = {
        "sale_id": str(record[0]),
        "product_sale_date": str(order_date),
        "product_name": record[2],
        "product_sale_price": str(record[3]),
        "product_sale_quantity": str(record[4]),
    }
    documents.append(data)
    # ids.append(str(record[0]))
# collection.add(documents=documents, ids=ids)
documents = {'sales': documents}

with open('./bot-api/db/all_data.json', 'w') as f:
     json.dump(documents, f)


# DEALING WITH CHROMA
# print('Saving records to chromadb.')
# loader = JSONLoader('./bot-api/db/all_data.json', jq_schema='.sales[]', text_content=False)
# documents = loader.load()
# text_splitter = CharacterTextSplitter(
#     chunk_size=1450,
#     chunk_overlap=400
# )
# texts = text_splitter.split_documents(documents)

# vectordb = Chroma.from_documents(
#     documents=texts,
#     embedding=embeddings,
#     persist_directory='./bot-api/db'
# )

conn.close()
