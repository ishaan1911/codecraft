from groq import Groq

# Hardcode your key temporarily for testing
client = Groq(api_key="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")

response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",  # ← Updated model name
    messages=[{"role": "user", "content": "Say hello!"}],
    max_tokens=100
)

print("✅ Groq is working!")
print(response.choices[0].message.content)