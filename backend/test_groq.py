import os
from groq import Groq

# Hardcode your key temporarily for testing
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",  # ← Updated model name
    messages=[{"role": "user", "content": "Say hello!"}],
    max_tokens=100
)

print("✅ Groq is working!")
print(response.choices[0].message.content)